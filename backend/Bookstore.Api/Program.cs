using Bookstore.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<BooksContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BooksConnection")));

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              // Allow local dev frontends running on different ports.
              .WithOrigins(
                  "http://localhost:5173",
                  "https://localhost:5173",
                  "http://localhost:5174",
                  "https://localhost:5174",
                  "http://localhost:5176",
                  "https://localhost:5176");
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// In this environment, HTTPS can fail due to developer-certificate trust/runtime issues.
// Keep dev running over HTTP to unblock the frontend.
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseRouting();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
