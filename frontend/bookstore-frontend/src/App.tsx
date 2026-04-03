import { Routes, Route, Link } from 'react-router-dom';
import { BooksList } from './components/BooksList';
import { CartPage } from './components/CartPage';
import { AdminBooks } from './components/AdminBooks';
import { useCart } from './context/CartContext';

function App() {
  const { totalItems } = useCart();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark px-3" style={{ background: '#4f46e5' }}>
        <Link className="navbar-brand fw-bold" to="/">📚 Bookstore</Link>
        <div className="navbar-nav ms-auto">
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link" to="/cart">
            Cart {totalItems > 0 && <span className="badge bg-warning text-dark ms-1">{totalItems}</span>}
          </Link>
          <Link className="nav-link" to="/adminbooks">Admin</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<BooksList />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/adminbooks" element={<AdminBooks />} />
      </Routes>
    </>
  );
}

export default App;
