"use client";

import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function HomePage() {
  const captchaRef = useRef(null);
  const [status, setStatus] = useState({ kind: "idle", message: "" });
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  async function handleSubmit(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setStatus({ kind: "sending", message: "Sending your message…" });

    const recaptchaToken = captchaRef.current?.getValue();
    if (!recaptchaToken) {
      setStatus({ kind: "error", message: "Complete the reCAPTCHA check first." });
      return;
    }

    const form = new FormData(formElement);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          message: form.get("message"),
          recaptchaToken,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setStatus({
          kind: "error",
          message: result.error || "Your message could not be sent.",
        });
        return;
      }

      formElement.reset();
      captchaRef.current?.reset();
      setStatus({ kind: "success", message: "Your message has been sent." });
    } catch {
      setStatus({
        kind: "error",
        message: "A network error occurred. Please try again.",
      });
    }
  }

  return (
    <main className="card">
      <p className="eyebrow">Next.js App Router · Server-side SMTP</p>
      <h1>Contact form</h1>
      <p className="intro">
        A small portfolio example of a form handled by a Next.js route handler.
        Messages are delivered over SMTP; credentials stay on the server.
      </p>

      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" autoComplete="name" maxLength={100} required />
        </label>
        <label>
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
          />
        </label>
        <label>
          Message
          <textarea name="message" rows={6} maxLength={5000} required />
        </label>

        {siteKey ? (
          <ReCAPTCHA ref={captchaRef} sitekey={siteKey} />
        ) : (
          <p className="notice">
            Set NEXT_PUBLIC_RECAPTCHA_SITE_KEY to enable the CAPTCHA widget.
          </p>
        )}

        <button type="submit" disabled={status.kind === "sending" || !siteKey}>
          {status.kind === "sending" ? "Sending…" : "Send message"}
        </button>
      </form>

      {status.message && (
        <p className={`status ${status.kind}`} role="status" aria-live="polite">
          {status.message}
        </p>
      )}

      <p className="footnote">
        Demo only. Configure your own reCAPTCHA keys and SMTP account before use.
      </p>
    </main>
  );
}
