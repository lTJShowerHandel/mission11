import { useEffect, useState } from 'react';
import type { Book } from '../api/booksApi';
import { addBook, deleteBook, getBooks, updateBook } from '../api/booksApi';

type BookFormData = Omit<Book, 'bookId'>;

const emptyForm: BookFormData = {
  title: '',
  author: '',
  publisher: '',
  isbn: '',
  classification: '',
  category: '',
  pageCount: 0,
  price: 0,
};

export function AdminBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<BookFormData>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadAllBooks() {
    try {
      setLoading(true);
      setError(null);
      const result = await getBooks({ page: 1, pageSize: 10000 });
      setBooks(result.items);
    } catch {
      setError('Failed to load books.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAllBooks();
  }, []);

  function handleAddClick() {
    setEditingBook(null);
    setFormData(emptyForm);
    setFormError(null);
    setShowForm(true);
  }

  function handleEditClick(book: Book) {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      isbn: book.isbn,
      classification: book.classification,
      category: book.category,
      pageCount: book.pageCount,
      price: book.price,
    });
    setFormError(null);
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingBook(null);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'pageCount' || name === 'price' ? Number(value) : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const { title, author, publisher, isbn, classification, category, pageCount, price } = formData;
    if (!title || !author || !publisher || !isbn || !classification || !category || pageCount <= 0 || price <= 0) {
      setFormError('All fields are required and PageCount/Price must be positive.');
      return;
    }

    try {
      setSaving(true);
      if (editingBook) {
        await updateBook(editingBook.bookId, { ...formData, bookId: editingBook.bookId });
      } else {
        await addBook(formData);
      }
      setShowForm(false);
      setEditingBook(null);
      await loadAllBooks();
    } catch {
      setFormError('Failed to save book. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(book: Book) {
    if (!window.confirm(`Delete "${book.title}"?`)) return;
    try {
      await deleteBook(book.bookId);
      await loadAllBooks();
    } catch {
      setError('Failed to delete book.');
    }
  }

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Admin — Manage Books</h1>
        {!showForm && (
          <button type="button" className="btn btn-success" onClick={handleAddClick}>
            + Add Book
          </button>
        )}
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">{editingBook ? 'Edit Book' : 'Add New Book'}</h5>
          </div>
          <div className="card-body">
            {formError && <div className="alert alert-danger">{formError}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {(['title', 'author', 'publisher', 'isbn', 'classification', 'category'] as const).map((field) => (
                  <div className="col-md-6" key={field}>
                    <label className="form-label text-capitalize" htmlFor={field}>{field}</label>
                    <input
                      id={field}
                      name={field}
                      className="form-control"
                      value={formData[field]}
                      onChange={handleChange}
                      required
                    />
                  </div>
                ))}
                <div className="col-md-3">
                  <label className="form-label" htmlFor="pageCount">Page Count</label>
                  <input
                    id="pageCount"
                    name="pageCount"
                    type="number"
                    min={1}
                    className="form-control"
                    value={formData.pageCount}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label" htmlFor="price">Price ($)</label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min={0.01}
                    step={0.01}
                    className="form-control"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="mt-3 d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editingBook ? 'Update Book' : 'Add Book'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && <div className="alert alert-info">Loading books...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Publisher</th>
                <th>ISBN</th>
                <th>Classification</th>
                <th>Category</th>
                <th className="text-end">Pages</th>
                <th className="text-end">Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.bookId}>
                  <td>{book.bookId}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.publisher}</td>
                  <td>{book.isbn}</td>
                  <td>{book.classification}</td>
                  <td>{book.category}</td>
                  <td className="text-end">{book.pageCount}</td>
                  <td className="text-end">${book.price.toFixed(2)}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleEditClick(book)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(book)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {books.length === 0 && <p className="text-muted">No books found.</p>}
        </div>
      )}
    </div>
  );
}
