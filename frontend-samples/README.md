# Frontend – excerpts

The EwangeliBus site, built with Next.js (App Router). The files are copied without changes, so some imports point to the rest of the project.

**1-seo** – `MetaTags.js` builds the metadata (canonical, Open Graph, Twitter) for every page. `sitemap.js` combines fixed routes with trips fetched from the API, and `robots.js` blocks `/api/`.

**2-trips-map-and-calendar** – `Map.js` places markers on an SVG map using percentage coordinates. `TripsCalendar.js` is a paginated list of trips, and `MapSection.js` puts them together.

**3-observability** – a simple logger that writes JSON, and a `/api/health` endpoint.

To improve: the calendar fetches data in `useEffect` (it would be better on the server), the pagination arrows have no accessible label for screen readers, and there are inline styles.

Polish version: [README.pl.md](./README.pl.md)
