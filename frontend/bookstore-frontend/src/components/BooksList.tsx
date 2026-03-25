import { useEffect, useState } from 'react';
import type { Book, PagedResult } from '../api/booksApi';
import { getBooks, getCategories } from '../api/booksApi';
import { useCart } from '../context/CartContext';
import { CartSummaryBar } from './CartSummaryBar';
import { ToastNotification } from './ToastNotification';

const PAGE_SIZE_OPTIONS = [5, 10, 20];

interface BooksListProps {
  onViewCart: () => void;
  initialPage?: number;
  initialCategory?: string;
  onStateChange?: (page: number, category: string) => void;
}

export function BooksList({
  onViewCart,
  initialPage = 1,
  initialCategory = '',
  onStateChange,
}: BooksListProps) {
  const { addToCart } = useCart();

  const [data, setData] = useState<PagedResult<Book> | null>(null);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(5);
  const [sortBy, setSortBy] = useState<string | undefined>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [category, setCategory] = useState(initialCategory);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const result = await getBooks({
          page,
          pageSize,
          sortBy,
          sortDirection,
          category: category || undefined,
        });
        setData(result);
        onStateChange?.(page, category);
      } catch (err) {
        console.error(err);
        setError('Failed to load books. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [page, pageSize, sortBy, sortDirection, category]);

  const handleToggleTitleSort = () => {
    setSortBy('title');
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setPage(1);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    setPage(1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPage(1);
    setCategory(e.target.value);
  };

  const handlePrev = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    if (data) {
      setPage((prev) => Math.min(data.totalPages, prev + 1));
    }
  };

  const handleAddToCart = (book: Book) => {
    addToCart(book);
    setToastMessage(`"${book.title}" added to cart`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Online Bookstore</h1>
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="category" className="form-label mb-0">
            Category:
          </label>
          <select
            id="category"
            className="form-select"
            style={{ width: 'auto' }}
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <label htmlFor="pageSize" className="form-label mb-0">
            Results per page:
          </label>
          <select
            id="pageSize"
            className="form-select"
            style={{ width: 'auto' }}
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      <CartSummaryBar onViewCart={onViewCart} />

      {loading && <div className="alert alert-info">Loading books...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && data && data.items.length === 0 && (
        <div className="alert alert-secondary">No books found.</div>
      )}

      {!loading && !error && data && data.items.length > 0 && (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th
                    role="button"
                    onClick={handleToggleTitleSort}
                    className="text-nowrap"
                  >
                    Title{' '}
                    {sortBy === 'title' && (
                      <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </th>
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
                {data.items.map((book) => (
                  <tr key={book.bookId}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.publisher}</td>
                    <td>{book.isbn}</td>
                    <td>{book.classification}</td>
                    <td>{book.category}</td>
                    <td className="text-end">{book.pageCount}</td>
                    <td className="text-end">${book.price.toFixed(2)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleAddToCart(book)}
                      >
                        Add to Cart
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              Page {data.page} of {data.totalPages} (Total books: {data.totalCount})
            </div>
            <div className="btn-group" role="group">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handlePrev}
                disabled={data.page <= 1}
              >
                Previous
              </button>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleNext}
                disabled={data.page >= data.totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      <ToastNotification
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
