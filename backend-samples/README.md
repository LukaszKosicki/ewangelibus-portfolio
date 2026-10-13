# Backend – excerpts

The API behind EwangeliBus: ASP.NET Core, EF Core, PostgreSQL, MediatR. The solution is split into `Api`, `Domain`, `Data` and `Authentication`. The files below are copied without changes.

**1-startup-and-observability** – `Program.cs`: Serilog logging, an `X-Request-Id` on every request, Sentry, `live` and `ready` health checks, forwarded headers behind the ingress.

**2-cqrs-mediatr** – a controller sends a query through MediatR and the handler returns a ready DTO (example: map markers).

**3-data-access** – a generic repository over EF Core that exposes `IQueryable`.

**4-authentication** – middleware that validates the JWT, and an `[Authorize]` attribute for admin endpoints.

Things I would do differently today: use a current .NET version (the API is on .NET 6), use the built-in JWT authentication instead of custom middleware, and add tests for the handlers.

Polish version: [README.pl.md](./README.pl.md)
