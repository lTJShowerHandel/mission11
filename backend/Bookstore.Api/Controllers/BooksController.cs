using Bookstore.Api.Data;
using Bookstore.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bookstore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly BooksContext _context;

    public BooksController(BooksContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<Book>>> GetBooks(
        int page = 1,
        int pageSize = 5,
        string? sortBy = null,
        string sortDirection = "asc",
        string? category = null)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 5;

        IQueryable<Book> query = _context.Books;

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(b => b.Category == category);
        }

        if (string.Equals(sortBy, "title", StringComparison.OrdinalIgnoreCase))
        {
            query = string.Equals(sortDirection, "desc", StringComparison.OrdinalIgnoreCase)
                ? query.OrderByDescending(b => b.Title)
                : query.OrderBy(b => b.Title);
        }
        else
        {
            query = query.OrderBy(b => b.BookId);
        }

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var result = new PagedResult<Book>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            TotalPages = totalPages
        };

        return Ok(result);
    }

    [HttpGet("categories")]
    public async Task<ActionResult<List<string>>> GetCategories()
    {
        var categories = await _context.Books
            .Select(b => b.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();
        return Ok(categories);
    }

    [HttpPost]
    public async Task<ActionResult<Book>> CreateBook([FromBody] Book book)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        book.BookId = 0;
        _context.Books.Add(book);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBooks), new { id = book.BookId }, book);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBook(int id, [FromBody] Book book)
    {
        if (id != book.BookId) return BadRequest("ID mismatch");
        if (!ModelState.IsValid) return BadRequest(ModelState);

        _context.Entry(book).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _context.Books.AnyAsync(b => b.BookId == id))
                return NotFound();
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null) return NotFound();

        _context.Books.Remove(book);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

public class PagedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}

