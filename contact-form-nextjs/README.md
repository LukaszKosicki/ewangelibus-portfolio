# Contact form in Next.js

A simplified version of the EwangeliBus contact form, prepared with the help of AI. The browser posts to a Next.js route handler, which verifies reCAPTCHA on the server and sends the message over SMTP. Addresses, passwords and keys are read from environment variables.

## Running it

You need Node.js 20.9 or newer, your own reCAPTCHA keys and an SMTP account.

```bash
npm install
cp .env.example .env.local   # fill in your own values
npm run dev
```

The app runs at <http://localhost:3000>. For a production build, use `npm run build` and `npm start`.

## Notes

- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is public. All other values are secrets and must not have the `NEXT_PUBLIC_` prefix.
- `SMTP_SECURE=true` is normally for port 465, and `false` for port 587 (STARTTLS).
- Validation limits field lengths and request size. It does not replace rate limiting, which has to be added on the server or in a proxy.

Polish version: [README.pl.md](./README.pl.md)
