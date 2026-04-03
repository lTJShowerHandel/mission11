import { useCart } from '../context/CartContext';

interface CartSummaryBarProps {
  onViewCart: () => void;
}

export function CartSummaryBar({ onViewCart }: CartSummaryBarProps) {
  const { totalItems, totalPrice } = useCart();

  if (totalItems === 0) return null;

  return (
    <div className="alert alert-secondary d-flex justify-content-between align-items-center py-2 mb-3">
      <span>
        Cart:{' '}
        <span className="badge bg-primary ms-1">{totalItems}</span>{' '}
        {totalItems === 1 ? 'item' : 'items'} &mdash; ${totalPrice.toFixed(2)}
      </span>
      <button type="button" className="btn btn-sm btn-primary" onClick={onViewCart}>
        View Cart
      </button>
    </div>
  );
}
