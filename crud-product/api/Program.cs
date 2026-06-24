using Api.Data;
using Api.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Product API", Version = "v1" });
});

builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

var app = builder.Build();

MigrateDatabase(app);

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors();

app.MapGet("/health", () => Results.Ok(new { status = "healthy" }))
    .ExcludeFromDescription();

app.MapGet("/api/products", async (AppDbContext db) =>
    await db.Products.ToListAsync())
    .WithTags("Products");

app.MapGet("/api/products/{id:guid}", async (Guid id, AppDbContext db) =>
    await db.Products.FindAsync(id) is Product product
        ? Results.Ok(product)
        : Results.NotFound())
    .WithTags("Products");

app.MapPost("/api/products", async (ProductRequest request, AppDbContext db) =>
{
    var errors = Validate(request);
    if (errors.Count > 0)
        return Results.ValidationProblem(errors);

    var product = new Product
    {
        Id = Guid.NewGuid(),
        Name = request.Name,
        Price = request.Price,
        Category = request.Category,
        StockCount = request.StockCount
    };

    db.Products.Add(product);
    await db.SaveChangesAsync();
    return Results.Created($"/api/products/{product.Id}", product);
})
.WithTags("Products");

app.MapPut("/api/products/{id:guid}", async (Guid id, ProductRequest request, AppDbContext db) =>
{
    var errors = Validate(request);
    if (errors.Count > 0)
        return Results.ValidationProblem(errors);

    var product = await db.Products.FindAsync(id);
    if (product is null) return Results.NotFound();

    product.Name = request.Name;
    product.Price = request.Price;
    product.Category = request.Category;
    product.StockCount = request.StockCount;

    await db.SaveChangesAsync();
    return Results.Ok(product);
})
.WithTags("Products");

app.MapDelete("/api/products/{id:guid}", async (Guid id, AppDbContext db) =>
{
    var product = await db.Products.FindAsync(id);
    if (product is null) return Results.NotFound();

    db.Products.Remove(product);
    await db.SaveChangesAsync();
    return Results.NoContent();
})
.WithTags("Products");

app.Run();

static void MigrateDatabase(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

static Dictionary<string, string[]> Validate(ProductRequest r)
{
    // Error keys use camelCase to match JSON serialisation and frontend field names.
    var errors = new Dictionary<string, string[]>();
    if (string.IsNullOrWhiteSpace(r.Name))
        errors["name"] = ["Name is required."];
    if (r.Price < 0)
        errors["price"] = ["Price must be zero or greater."];
    if (string.IsNullOrWhiteSpace(r.Category))
        errors["category"] = ["Category is required."];
    if (r.StockCount < 0)
        errors["stockCount"] = ["StockCount must be zero or greater."];
    return errors;
}
