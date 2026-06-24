namespace Api.Models;

public class Product
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Category { get; set; } = string.Empty;
    public int StockCount { get; set; }
}

public record ProductRequest(
    string Name,
    decimal Price,
    string Category,
    int StockCount
);
