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
  const [users, setUsers] = useState([]);
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist_v2');
    return saved ? JSON.parse(saved) : [];
  });
  const [banners, setBanners] = useState([]);
  const [offers, setOffers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myOrderIds, setMyOrderIds] = useState(() => {
    const saved = localStorage.getItem('my_orders_v2');
    return saved ? JSON.parse(saved) : [];
  });


  // Sync with Firestore on mount
  useEffect(() => {
    let activeListeners = 0;
    const totalRequired = 8;
    
    const decrementLoading = () => {
      activeListeners++;
      if (activeListeners >= totalRequired) {
        setLoading(false);
      }
    };

    // Safety timeout: Never stay on loading more than 4 seconds
    const timeout = setTimeout(() => setLoading(false), 4000);

    const handleError = (error) => {
        console.error("Firestore Listener Error:", error);
        decrementLoading();
    };

    // Products
    const qProducts = query(collection(db, "products"));
    const unsubscribeProducts = onSnapshot(qProducts, (snapshot) => {
      const dbProds = snapshot.docs.map(doc => ({ ...doc.data(), firestoreId: doc.id }));
      
      // Merge: Take all from Firestore, and add defaults that don't exist in Firestore by name
      const merged = [
        ...dbProds,
        ...defaultProducts.filter(dp => !dbProds.some(p => p.name === dp.name))
      ];
      
      // Sort: Newest manually added at the top
      setProducts(merged.sort((a, b) => (b.id || 0) - (a.id || 0)));
      decrementLoading();
    }, handleError);

    // Categories
    const qCategories = query(collection(db, "categories"));
    const unsubscribeCategories = onSnapshot(qCategories, (snapshot) => {
      const dbCats = snapshot.docs.map(doc => doc.data().name).filter(Boolean);
      const defaults = ["Grocery", "Fruits", "Vegetables", "Drinks", "Snacks", "Dairy", "Bakery", "Personal Care", "Household"];
      // Merge unique categories
      setCategories([...new Set([...dbCats, ...defaults])]);
      decrementLoading();
    }, handleError);

    // Orders
    const qOrders = query(collection(db, "orders"), orderBy("date", "desc"));
    const unsubscribeOrders = onSnapshot(qOrders, (snapshot) => {
      const ords = snapshot.docs.map(doc => ({ ...doc.data(), firestoreId: doc.id }));
      setOrders(ords);
      decrementLoading();
    }, handleError);

    // Users
    const qUsers = query(collection(db, "users"), orderBy("joined", "desc"));
    const unsubscribeUsers = onSnapshot(qUsers, (snapshot) => {
      const u = snapshot.docs.map(doc => ({ ...doc.data(), firestoreId: doc.id }));
      setUsers(u);
      decrementLoading();
    }, handleError);

    // Banners
    const qBanners = query(collection(db, "banners"));
    const unsubscribeBanners = onSnapshot(qBanners, (snapshot) => {
      const dbBanners = snapshot.docs.map(doc => ({ ...doc.data(), firestoreId: doc.id }));
      const defaultBanners = [{ image: 'https://images.unsplash.com/photo-1542838132-92c53300491e', title: 'Premium Groceries' }];
      setBanners([...dbBanners, ...defaultBanners.filter(db => !dbBanners.some(b => b.title === db.title))]);
      decrementLoading();
    }, handleError);

    // Offers
    const qOffers = query(collection(db, "offers"));
    const unsubscribeOffers = onSnapshot(qOffers, (snapshot) => {
      const dbOffers = snapshot.docs.map(doc => ({ ...doc.data(), firestoreId: doc.id }));
      const defaultOffers = [{ title: "Snack O'Clock!", desc: "Get flat 20% off", category: 'Snacks' }];
      setOffers([...dbOffers, ...defaultOffers.filter(doff => !dbOffers.some(o => o.title === doff.title))]);
      decrementLoading();
    }, handleError);

    // Staff
    const qStaff = query(collection(db, "staff"));
    const unsubscribeStaff = onSnapshot(qStaff, (snapshot) => {
      const s = snapshot.docs.map(doc => ({ ...doc.data(), firestoreId: doc.id }));
      setStaff(s);
      decrementLoading();
    }, handleError);

    // Coupons
    const qCoupons = query(collection(db, "coupons"));
    const unsubscribeCoupons = onSnapshot(qCoupons, (snapshot) => {
      const c = snapshot.docs.map(doc => ({ ...doc.data(), firestoreId: doc.id }));
      setCoupons(c);
      decrementLoading();
    }, handleError);

    return () => {
      clearTimeout(timeout);
      unsubscribeProducts();
      unsubscribeCategories();
      unsubscribeOrders();
      unsubscribeUsers();
      unsubscribeBanners();
      unsubscribeOffers();
      unsubscribeStaff();
      unsubscribeCoupons();
    };
  }, []);


  useEffect(() => {
    localStorage.setItem('wishlist_v2', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('my_orders_v2', JSON.stringify(myOrderIds));
  }, [myOrderIds]);

  // Product Methods
  const addProduct = async (product) => {
    try {
      const docRef = await addDoc(collection(db, "products"), { ...product, id: Date.now() });
      return docRef;
    } catch (error) {
      console.error("Error adding product: ", error);
      throw error;
    }
  };

  const bulkAddProducts = async (productList) => {
    try {
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

  // Staff Methods
  const addStaff = async (member) => {
    try {
      await addDoc(collection(db, "staff"), { ...member, id: Date.now(), status: 'Active' });
    } catch (error) {
      console.error("Error adding staff:", error);
    }
  };

  const deleteStaff = async (id) => {
    try {
      await deleteDoc(doc(db, "staff", id));
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  const updateStaffStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "staff", id), { status });
    } catch (error) {
      console.error("Error updating staff status:", error);
    }
  };

  // Coupon Methods
  const addCoupon = async (coupon) => {
    try {
      await addDoc(collection(db, "coupons"), { ...coupon, id: Date.now(), active: true });
    } catch (error) {
      console.error("Error adding coupon:", error);
    }
  };

  const deleteCoupon = async (id) => {
    try {
      await deleteDoc(doc(db, "coupons", id));
    } catch (error) {
      console.error("Error deleting coupon:", error);
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
    // We'll wrap the Firestore call in a Promise with a timeout
    const firestorePromise = addDoc(collection(db, "orders"), { 
      ...order, 
      date: new Date().toISOString(),
      timestamp: new Date() // Store as actual date object too
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 7000)
    );

    try {
      await Promise.race([firestorePromise, timeoutPromise]);
      setMyOrderIds(prev => [...prev, order.id]);
    } catch (error) {
      console.warn("Order save to Firebase failed or timed out, saving locally only:", error);
      // We still update local state so the user sees it in their dashboard
      setMyOrderIds(prev => [...prev, order.id]);
      // We don't throw here so the UI can proceed
    }
  };
  
  const updateOrderStatus = async (orderId, status) => {
    try {
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
      offers, addOffer, deleteOffer,
      staff, addStaff, deleteStaff, updateStaffStatus,
      coupons, addCoupon, deleteCoupon,
      users, myOrderIds
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
