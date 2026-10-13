# Formularz kontaktowy w Next.js

Uproszczona wersja formularza ze strony EwangeliBus, przygotowana z pomocą AI. Wiadomość trafia do route handlera Next.js, który sprawdza reCAPTCHA po stronie serwera i wysyła mail przez SMTP. Adresy, hasła i klucze są w zmiennych środowiskowych.

## Uruchomienie

Potrzebny jest Node.js 20.9 lub nowszy, własne klucze reCAPTCHA i konto SMTP.

```bash
npm install
cp .env.example .env.local   # uzupełnij własne wartości
npm run dev
```

Aplikacja działa pod <http://localhost:3000>. Wersja produkcyjna: `npm run build` i `npm start`.

## Uwagi

- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` jest publiczny. Pozostałe wartości to sekrety i nie mogą mieć prefiksu `NEXT_PUBLIC_`.
- `SMTP_SECURE=true` dotyczy zwykle portu 465, a `false` portu 587 (STARTTLS).
- Walidacja ogranicza długość pól i rozmiar żądania. Nie zastępuje to limitowania liczby żądań, które trzeba dodać na serwerze lub w proxy.
