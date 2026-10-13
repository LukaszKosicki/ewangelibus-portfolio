import "./globals.css";

export const metadata = {
  title: "Contact form example",
  description: "A small Next.js contact form with server-side CAPTCHA and SMTP delivery.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
