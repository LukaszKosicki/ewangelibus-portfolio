const SITE_URL = process.env.NEXT_FRONTEND_URL || "https://ewangelibus.pl";

const STATIC_ROUTES = [
  "/",
  "/intencje",
  "/kalendarz",
  "/kontakt",
  "/lukasz-plata",
  "/lukasz-plata/konferencje-i-wyklady",
  "/lukasz-plata/modlitwa-wstawiennicza",
  "/lukasz-plata/poradnictwo-duchowe",
  "/lukasz-plata/rekolekcje",
  "/nasz-zespol",
  "/nasza-misja",
  "/nieidealny-ale-powolany",
  "/niemozliwe-swiadectwa",
  "/niemozliwe-w-rodzinie",
  "/polityka-prywatnosci",
  "/regulamin",
  "/relacje",
  "/wsparcie",
];

async function getTripRoutes() {
  const response = await fetch(
    "https://api.ewangelibus.pl/trip?pageSize=2000&pageNumber=1&sortOrder=date_desc",
    {
      next: {
        revalidate: 86400,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Unable to build sitemap from trips API: ${response.status}`);
  }

  const data = await response.json();
  if (!Array.isArray(data.trips)) {
    throw new Error("Unable to build sitemap: invalid trips payload");
  }

  return data.trips.map((trip) => `/trasa/${trip.id}`);
}

export default async function sitemap() {
  const now = new Date();
  const dynamicTripRoutes = await getTripRoutes();

  return [...STATIC_ROUTES, ...dynamicTripRoutes].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : route.startsWith("/trasa/") ? 0.7 : 0.8,
  }));
}
