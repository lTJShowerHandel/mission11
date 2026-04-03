import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart();

  return (
    <div className="container my-4">
      <h1 className="mb-4">
        Shopping Cart{' '}
        <span className="badge bg-secondary ms-2">{totalItems}</span>
      </h1>

      {items.length === 0 ? (
        <div className="alert alert-info">
          Your cart is empty.{' '}
          <button type="button" className="btn btn-link p-0" onClick={() => navigate('/')}>
            Browse Books
          </button>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-8">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th className="text-end">Price</th>
                    <th className="text-center">Qty</th>
                    <th className="text-end">Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.bookId}>
                      <td>{item.title}</td>
                      <td className="text-end">${item.price.toFixed(2)}</td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm" role="group">
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => updateQuantity(item.bookId, -1)}
                          >
                            &minus;
                          </button>
                          <span className="btn btn-outline-secondary disabled">{item.quantity}</span>
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => updateQuantity(item.bookId, 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="text-end">${(item.price * item.quantity).toFixed(2)}</td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeFromCart(item.bookId)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="button" className="btn btn-outline-primary" onClick={() => navigate('/')}>
              &larr; Continue Shopping
            </button>
          </div>

          <div className="col-lg-4">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Order Summary</h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Items ({totalItems}):</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <button type="button" className="btn btn-success w-100 mt-3" disabled>
                  Checkout (coming soon)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
