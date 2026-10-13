# Backend – fragmenty

API strony EwangeliBus: ASP.NET Core, EF Core, PostgreSQL, MediatR. Projekt dzieli się na `Api`, `Domain`, `Data` i `Authentication`. Pliki poniżej są skopiowane bez zmian.

**1-startup-and-observability** – `Program.cs`: logi Serilog, `X-Request-Id` w każdym żądaniu, Sentry, health checki `live` i `ready`, obsługa nagłówków zza ingressa.

**2-cqrs-mediatr** – kontroler wysyła zapytanie przez MediatR, a handler zwraca gotowe DTO (przykład: markery na mapie).

**3-data-access** – generyczne repozytorium nad EF Core, które wystawia `IQueryable`.

**4-authentication** – middleware sprawdzający token JWT i atrybut `[Authorize]` dla endpointów admina.

Kilka rzeczy, które dziś zrobiłbym inaczej: aktualna wersja .NET (API jest na .NET 6), wbudowane uwierzytelnianie JWT zamiast własnego middleware, testy handlerów.
