import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 12_000;
const MAX_NAME_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 5_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class RequestBodyTooLargeError extends Error {}

function errorResponse(message, status) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

async function readJsonBody(request) {
  const reader = request.body?.getReader();
  if (!reader) {
    throw new SyntaxError("Request body is empty.");
  }

  const chunks = [];
  let size = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    size += value.byteLength;
    if (size > MAX_REQUEST_BYTES) {
      await reader.cancel();
      throw new RequestBodyTooLargeError();
    }

    chunks.push(value);
  }

  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return JSON.parse(new TextDecoder().decode(bytes));
}

function getSmtpConfiguration() {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASSWORD,
    SMTP_FROM,
    CONTACT_TO,
  } = process.env;

  const port = Number(SMTP_PORT);
  if (
    !SMTP_HOST ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65_535 ||
    !["true", "false"].includes(SMTP_SECURE) ||
    !SMTP_USER ||
    !SMTP_PASSWORD ||
    !SMTP_FROM ||
    !CONTACT_TO ||
    !EMAIL_PATTERN.test(CONTACT_TO)
  ) {
    throw new Error("SMTP configuration is incomplete or invalid.");
  }

  return {
    host: SMTP_HOST,
    port,
    secure: SMTP_SECURE === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    from: SMTP_FROM,
    to: CONTACT_TO,
  };
}

async function verifyRecaptcha(token, secret) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`reCAPTCHA verification returned HTTP ${response.status}.`);
    }

    const result = await response.json();
    return result.success === true;
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request) {
  const contentLengthHeader = request.headers.get("content-length");
  const contentLength = contentLengthHeader === null ? null : Number(contentLengthHeader);
  if (contentLength !== null && contentLength > MAX_REQUEST_BYTES) {
    return errorResponse("Request is too large.", 413);
  }

  let body;
  try {
    body = await readJsonBody(request);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return errorResponse("Request is too large.", 413);
    }
    return errorResponse("Request body must be valid JSON.", 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return errorResponse("Request body must be a JSON object.", 400);
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const recaptchaToken =
    typeof body.recaptchaToken === "string" ? body.recaptchaToken.trim() : "";

  if (
    !name ||
    name.length > MAX_NAME_LENGTH ||
    !EMAIL_PATTERN.test(email) ||
    email.length > 254 ||
    !message ||
    message.length > MAX_MESSAGE_LENGTH ||
    !recaptchaToken
  ) {
    return errorResponse("Please provide valid form details and complete reCAPTCHA.", 400);
  }

  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
  if (!recaptchaSecret) {
    console.error("Contact form is missing RECAPTCHA_SECRET_KEY.");
    return errorResponse("The contact form is not configured.", 503);
  }

  let smtp;
  try {
    smtp = getSmtpConfiguration();
  } catch (error) {
    console.error("Contact form SMTP configuration is invalid.", error.message);
    return errorResponse("The contact form is not configured.", 503);
  }

  try {
    const captchaValid = await verifyRecaptcha(recaptchaToken, recaptchaSecret);
    if (!captchaValid) {
      return errorResponse("reCAPTCHA verification failed.", 403);
    }

    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      requireTLS: !smtp.secure,
      auth: smtp.auth,
    });

    await transporter.sendMail({
      from: smtp.from,
      to: smtp.to,
      replyTo: email,
      subject: "New message from the website contact form",
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form delivery failed.", error.code || "UNKNOWN");
    return errorResponse("Your message could not be sent. Please try again later.", 502);
  }
}
