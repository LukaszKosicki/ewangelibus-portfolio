# Frontend – fragmenty

Strona EwangeliBus w Next.js (App Router). Pliki są skopiowane bez zmian, więc część importów wskazuje na resztę projektu.

**1-seo** – `MetaTags.js` składa metadane (canonical, Open Graph, Twitter) dla każdej podstrony. `sitemap.js` łączy stałe adresy z trasami pobranymi z API, a `robots.js` zamyka `/api/`.

**2-trips-map-and-calendar** – `Map.js` rozmieszcza markery na mapie SVG według współrzędnych w procentach. `TripsCalendar.js` to lista tras ze stronicowaniem, a `MapSection.js` składa je razem.

**3-observability** – prosty logger zapisujący JSON i endpoint `/api/health`.

Do poprawy: pobieranie danych w kalendarzu przez `useEffect` (lepiej po stronie serwera), strzałki stronicowania bez opisu dla czytników ekranu, style inline.
