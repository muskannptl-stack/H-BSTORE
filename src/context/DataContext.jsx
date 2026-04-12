import React, { createContext, useState, useEffect, useContext } from 'react';
import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  setDoc,
  getDocs
} from 'firebase/firestore';
import { products as defaultProducts } from '../data/products';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist_v2');
    return saved ? JSON.parse(saved) : [];
  });
  const [banners, setBanners] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);


  // Sync with Firestore on mount
  useEffect(() => {
    const qProducts = query(collection(db, "products"), orderBy("id", "desc"));
    const unsubscribeProducts = onSnapshot(qProducts, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ ...doc.data(), firestoreId: doc.id }));
      if (prods.length === 0 && defaultProducts.length > 0) {
        setProducts(defaultProducts);
      } else {
        setProducts(prods);
      }
    });

    const qCategories = query(collection(db, "categories"));
    const unsubscribeCategories = onSnapshot(qCategories, (snapshot) => {
      const cats = snapshot.docs.map(doc => doc.data().name);
      if (cats.length === 0) {
        setCategories(["Grocery", "Fruits", "Vegetables", "Drinks", "Snacks", "Dairy", "Bakery", "Personal Care", "Household"]);
      } else {
        setCategories(cats);
      }
    });

    const qOrders = query(collection(db, "orders"), orderBy("date", "desc"));
    const unsubscribeOrders = onSnapshot(qOrders, (snapshot) => {
      const ords = snapshot.docs.map(doc => ({ ...doc.data(), firestoreId: doc.id }));
      setOrders(ords);
    });

    // Banners & Offers
    const qBanners = query(collection(db, "banners"));
    const unsubscribeBanners = onSnapshot(qBanners, (snapshot) => {
      const b = snapshot.docs.map(doc => ({ ...doc.data(), firestoreId: doc.id }));
      setBanners(b.length > 0 ? b : [{ image: 'https://images.unsplash.com/photo-1542838132-92c53300491e', title: 'Premium Groceries' }]);
    });

    const qOffers = query(collection(db, "offers"));
    const unsubscribeOffers = onSnapshot(qOffers, (snapshot) => {
      const o = snapshot.docs.map(doc => ({ ...doc.data(), firestoreId: doc.id }));
      setOffers(o.length > 0 ? o : [{ title: "Snack O'Clock!", desc: "Get flat 20% off", category: 'Snacks' }]);
      setLoading(false);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeCategories();
      unsubscribeOrders();
      unsubscribeBanners();
      unsubscribeOffers();
    };
  }, []);


  useEffect(() => {
    localStorage.setItem('wishlist_v2', JSON.stringify(wishlist));
  }, [wishlist]);

  // Product Methods
  const addProduct = async (product) => {
    try {
      await addDoc(collection(db, "products"), { ...product, id: Date.now() });
    } catch (error) {
      console.error("Error adding product: ", error);
    }
  };

  const bulkAddProducts = async (productList) => {
    try {
      // In a real world app, we should use writeBatch for better performance
      for (const product of productList) {
        await addDoc(collection(db, "products"), { ...product, id: Date.now() + Math.random() });
      }
    } catch (error) {
      console.error("Error bulk adding products: ", error);
    }
  };


  const updateProduct = async (updatedProduct) => {
    try {
      const productRef = doc(db, "products", updatedProduct.firestoreId);
      await updateDoc(productRef, updatedProduct);
    } catch (error) {
      console.error("Error updating product: ", error);
    }
  };

  const deleteProduct = async (firestoreId) => {
    try {
      await deleteDoc(doc(db, "products", firestoreId));
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };

  // Category Methods
  const addCategory = async (categoryName) => {
    try {
      if (!categories.includes(categoryName)) {
        await addDoc(collection(db, "categories"), { name: categoryName });
      }
    } catch (error) {
      console.error("Error adding category: ", error);
    }
  };

  const deleteCategory = async (categoryName) => {
    // Note: This logic assumes unique category names as IDs or finding them by name
    const q = query(collection(db, "categories"));
    const snapshot = await getDocs(q);
    snapshot.forEach(async (document) => {
      if (document.data().name === categoryName) {
        await deleteDoc(doc(db, "categories", document.id));
      }
    });
  };

  // Order Methods
  const addOrder = async (order) => {
    try {
      await addDoc(collection(db, "orders"), { ...order, date: new Date().toISOString() });
    } catch (error) {
      console.error("Error adding order: ", error);
    }
  };
  
  const updateOrderStatus = async (orderId, status) => {
    try {
      // Correctly find the order by its firestoreId (passed as orderId here)
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status });
    } catch (error) {
      console.error("Error updating order status: ", error);
    }
  };

  // Wishlist Methods
  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  // Banner & Offer Methods
  const addBanner = async (banner) => {
    try {
      await addDoc(collection(db, "banners"), banner);
    } catch (error) {
       console.error("Error adding banner:", error);
    }
  };

  const deleteBanner = async (id) => {
    try {
      await deleteDoc(doc(db, "banners", id));
    } catch (error) {
      console.error("Error deleting banner:", error);
    }
  };

  const addOffer = async (offer) => {
    try {
      await addDoc(collection(db, "offers"), offer);
    } catch (error) {
      console.error("Error adding offer:", error);
    }
  };

  const deleteOffer = async (id) => {
    try {
      await deleteDoc(doc(db, "offers", id));
    } catch (error) {
      console.error("Error deleting offer:", error);
    }
  };

  return (
    <DataContext.Provider value={{
      products, addProduct, bulkAddProducts, updateProduct, deleteProduct,
      categories, addCategory, deleteCategory,
      orders, addOrder, updateOrderStatus,
      wishlist, toggleWishlist, loading,
      banners, addBanner, deleteBanner,
      offers, addOffer, deleteOffer
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
