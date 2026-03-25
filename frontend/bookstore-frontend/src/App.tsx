import { useState } from 'react';
import { BooksList } from './components/BooksList';
import { CartPage } from './components/CartPage';

type View = 'books' | 'cart';

function App() {
  const [view, setView] = useState<View>('books');
  const [savedPage, setSavedPage] = useState(1);
  const [savedCategory, setSavedCategory] = useState('');

  return view === 'cart' ? (
    <CartPage onContinueShopping={() => setView('books')} />
  ) : (
    <BooksList
      onViewCart={() => setView('cart')}
      initialPage={savedPage}
      initialCategory={savedCategory}
      onStateChange={(p, c) => {
        setSavedPage(p);
        setSavedCategory(c);
      }}
    />
  );
}

export default App;
