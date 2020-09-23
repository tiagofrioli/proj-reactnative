import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const storageProducts = await AsyncStorage.getItem(
        '@Market:products',
      );

      if (storageProducts) {
        setProducts(JSON.parse(storageProducts));
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      //verifica se o product existe
      const checkCart = products.filter(p => p.id === product.id);
      if (checkCart.length < 1) { //se não existe adiciona o product
        setProducts(state => [...state, { ...product, quantity: 1 }]);
      } else { // se ja existe adiciona ao product a quantidade 1
        const newProduts = products.map(p =>
          p.id !== product.id ? p : { ...p, quantity: p.quantity + 1 },
        );
        setProducts(newProduts);
      }
      // salva o product no AsyncStorage
      await AsyncStorage.setItem(
        '@Market:products',
        JSON.stringify(products),  // converte products em string json
      );
    },
    [products],
  );

  const increment = useCallback(  // incrementa a quatidade do product
    async id => {
      const newProduts = products.map(p =>
        p.id !== id ? p : { ...p, quantity: p.quantity + 1 },
      );

      setProducts(newProduts);

      // salva no AsyncStorage
      await AsyncStorage.setItem(
        '@Market:products',
        JSON.stringify(newProduts),
      );
    },
    [products],
  );

  const decrement = useCallback( // decrementa a quantidade do product
    async id => {
      const check = products.filter(prod => prod.id === id);
      let list;
      if (check[0].quantity < 2) {
        list = products.filter(prod => prod.id !== id);
      } else {
        list = products.map(p =>
          p.id !== id ? p : { ...p, quantity: p.quantity - 1 },
        );
      }

      setProducts(list);
      //salva no AsyncStorage
      await AsyncStorage.setItem(
        '@Market:products',
        JSON.stringify(list),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`Error`);
  }

  return context;
}

export { CartProvider, useCart };
