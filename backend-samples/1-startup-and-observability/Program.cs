using Api.Extensions;
using Authentication.Helpers;
using Authentication.Services;
using Authentication.Settings;
using Data;
using Data.Interfaces;
using Data.Repositories;
using MediatR;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Localization;
using Sentry;
using Serilog;
using Serilog.Context;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseSentry(options =>
{
    options.Dsn = builder.Configuration["Sentry:Dsn"];
    options.Debug = builder.Environment.IsDevelopment();
    options.TracesSampleRate = 1.0;
    options.Environment = builder.Environment.EnvironmentName;
    options.BeforeSend = @event =>
    {
        if (string.IsNullOrWhiteSpace(builder.Configuration["Sentry:Dsn"]))
        {
            return null;
        }

        return @event;
    };
});

builder.Host.UseSerilog((context, services, loggerConfiguration) =>
{
    loggerConfiguration
        .ReadFrom.Configuration(context.Configuration)
        .Enrich.FromLogContext()
        .Enrich.WithProperty("Service", "ewangelibus-backend")
        .Enrich.WithProperty("Environment", context.HostingEnvironment.EnvironmentName)
        .WriteTo.Console();
});

// =========================
// Configuration / Secrets
// =========================

// JWT secret:
// builder.Configuration["Jwt:Key"]

// PostgreSQL connection string:
// builder.Configuration.GetConnectionString("Default")

// =========================
// Forwarded headers (Ingress / Reverse Proxy)
// =========================

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor |
        ForwardedHeaders.XForwardedProto;

    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

// =========================
// Services
// =========================

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

builder.Services.AddMediatR(typeof(Program).Assembly);

var defaultConnection = builder.Configuration.GetConnectionString("Default") ?? throw new InvalidOperationException("Missing Default connection string.");

builder.Services.AddHealthChecks()
    .AddNpgSql(defaultConnection, name: "postgres");

// Database
builder.DatabaseExtenstion();

// CORS
builder.CorsConfiguration();

// DI
builder.Services.AddTransient<AppDbContextSeed>();
builder.Services.AddTransient<AppDbContext>();

builder.Services.Configure<AuthSettings>(
    builder.Configuration.GetSection("AuthSettings"));

builder.Services.AddScoped(
    typeof(IGenericRepository<>),
    typeof(GenericRepository<>));

builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddHttpContextAccessor();

// =========================
// Build app
// =========================

var app = builder.Build();

// =========================
// Middleware
// =========================

app.UseForwardedHeaders();
app.Use(async (context, next) =>
{
    var requestId = context.Request.Headers["X-Request-Id"].FirstOrDefault()
        ?? Guid.NewGuid().ToString("N");

    context.TraceIdentifier = requestId;
    context.Response.Headers["X-Request-Id"] = requestId;

    using (LogContext.PushProperty("RequestId", requestId))
    {
        using (LogContext.PushProperty("RequestPath", context.Request.Path.Value ?? string.Empty))
        {
            using (LogContext.PushProperty("RequestMethod", context.Request.Method))
            {
                await next();
            }
        }
    }
});

app.UseSerilogRequestLogging(options =>
{
    options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
    {
        diagnosticContext.Set("RequestId", httpContext.TraceIdentifier);
        diagnosticContext.Set("RequestPath", httpContext.Request.Path.Value ?? string.Empty);
        diagnosticContext.Set("RequestMethod", httpContext.Request.Method);
        diagnosticContext.Set("RemoteIp", httpContext.Connection.RemoteIpAddress?.ToString());
    };
});

app.UseSentryTracing();

app.UseHttpsRedirection();

// Swagger only in Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();

app.UseCors();

// Authentication / Authorization
app.UseAuthentication();

app.UseAuthorization();

// Custom JWT middleware
app.UseMiddleware<JwtMiddleware>();

// Localization
app.UseRequestLocalization(new RequestLocalizationOptions
{
    DefaultRequestCulture = new RequestCulture("en-US")
});

// =========================
// Healthcheck
// =========================

app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = _ => false
});

app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = _ => true
});

app.MapGet("/health", () => Results.Ok(new { status = "ok", service = "ewangelibus-backend", timestamp = DateTime.UtcNow }));

// =========================
// Controllers
// =========================

app.MapControllers();

// =========================
// Database seeding
// WARNING:
// with replicas > 1 this may run multiple times
// =========================

// app.SeedDatabase();

// =========================
// Run app
// =========================

app.Run();