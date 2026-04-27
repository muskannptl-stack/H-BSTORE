import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase/config';
import { products as defaultProducts } from '../data/products';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [banners, setBanners] = useState([]);
  const [offers, setOffers] = useState([]);
  const [users, setUsers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); } catch { return []; }
  });
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [myLocalOrders, setMyLocalOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('myOrders') || '[]'); } catch { return []; }
  });
  const [loading, setLoading] = useState(true);

  // ─── FETCH ALL DATA ───────────────────────────────────────────────────────
  const fetchData = React.useCallback(async () => {
    try {
      const fetchWithFallback = async (table, select = '*', order = null) => {
        let query = supabase.from(table).select(select);
        if (order) query = query.order(order.column, { ascending: order.ascending });
        const { data, error } = await query;
        if (error) {
          console.warn(`Fetch error for ${table}:`, error.message);
          return [];
        }
        return data || [];
      };

      const [p, c, o, b, u] = await Promise.all([
        fetchWithFallback('products'),
        fetchWithFallback('categories'),
        fetchWithFallback('orders', '*', { column: 'created_at', ascending: false }),
        fetchWithFallback('banners'),
        fetchWithFallback('profiles')
      ]);

      const merged = [
        ...p,
        ...defaultProducts.filter(dp => !p.some(pdb => pdb.name === dp.name))
      ];
      setProducts(merged);

      const cats = c.length > 0 ? c : [
        { id: 1, name: 'Grocery' }, { id: 2, name: 'Drinks' },
        { id: 3, name: 'Snacks' }, { id: 4, name: 'Fruits' },
        { id: 5, name: 'Vegetables' }, { id: 6, name: 'Dairy' },
        { id: 7, name: 'Bakery' }, { id: 8, name: 'Personal Care' }
      ];
      setCategories(cats);
      setOrders(o);
      setBanners(b.length > 0 ? b : [
        { id: 1, title: 'Fresh Groceries Delivered', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80' }
      ]);
      setOffers([{ id: 1, title: "Snack O'Clock!", desc: 'Get flat 20% off on all snacks', category: 'Snacks', color: 'orange' }]);
      setUsers(u);
      setStaff(u.filter(usr => usr.role === 'admin' || usr.role === 'staff'));
    } catch (e) {
      console.error('DataContext fetchData fatal error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Subscribe to specific tables to avoid infinite loops and redundant fetches
    const channel = supabase.channel('realtime-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'banners' }, fetchData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  // ─── WISHLIST ─────────────────────────────────────────────────────────────
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const updated = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem('wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  // ─── RECENTLY VIEWED ─────────────────────────────────────────────────────
  const addToRecentlyViewed = (product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 10);
    });
  };

  // ─── PRODUCTS ─────────────────────────────────────────────────────────────
  const addProduct = async (productData) => {
    const { error } = await supabase.from('products').insert([productData]);
    if (!error) fetchData();
    return { error };
  };

  const updateProduct = async (productData) => {
    const { id, ...data } = productData;
    const { error } = await supabase.from('products').update(data).eq('id', id);
    if (!error) fetchData();
    return { error };
  };

  const deleteProduct = async (id) => {
    await supabase.from('products').delete().eq('id', id);
    fetchData();
  };

  const bulkAddProducts = async (productsArray) => {
    const { error } = await supabase.from('products').insert(productsArray);
    if (!error) fetchData();
    return { error };
  };

  // ─── CATEGORIES ───────────────────────────────────────────────────────────
  const addCategory = async (name) => {
    const { error } = await supabase.from('categories').insert([{ name }]);
    if (!error) fetchData();
    return { error };
  };

  const deleteCategory = async (id) => {
    await supabase.from('categories').delete().eq('id', id);
    fetchData();
  };

  // ─── ORDERS ───────────────────────────────────────────────────────────────
  const addOrder = async (orderData) => {
    const { data, error } = await supabase.from('orders').insert([orderData]).select();
    if (!error) {
      const newOrder = data[0];
      setMyLocalOrders(prev => {
        const updated = [newOrder, ...prev];
        localStorage.setItem('myOrders', JSON.stringify(updated));
        return updated;
      });
      fetchData();
    }
    return { data, error };
  };

  const updateOrderStatus = async (id, status) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    fetchData();
  };

  const deleteOrder = async (id) => {
    await supabase.from('orders').delete().eq('id', id);
    fetchData();
  };

  // ─── BANNERS & OFFERS ─────────────────────────────────────────────────────
  const addBanner = async (bannerData) => {
    const { error } = await supabase.from('banners').insert([bannerData]);
    if (!error) fetchData();
    return { error };
  };

  const deleteBanner = async (id) => {
    await supabase.from('banners').delete().eq('id', id);
    fetchData();
  };

  const addOffer = (offer) => setOffers(prev => [...prev, { ...offer, id: Date.now() }]);
  const deleteOffer = (id) => setOffers(prev => prev.filter(o => o.id !== id));

  // ─── COUPONS ──────────────────────────────────────────────────────────────
  const addCoupon = (coupon) => setCoupons(prev => [...prev, { ...coupon, id: Date.now() }]);
  const deleteCoupon = (id) => setCoupons(prev => prev.filter(c => c.id !== id));

  // ─── STAFF ────────────────────────────────────────────────────────────────
  const addStaff = async (staffData) => {
    const { error } = await supabase.from('profiles').update({ role: 'staff' }).eq('id', staffData.id);
    if (!error) fetchData();
    return { error };
  };

  const deleteStaff = async (id) => {
    await supabase.from('profiles').update({ role: 'user' }).eq('id', id);
    fetchData();
  };

  const updateStaffStatus = async (id, status) => {
    await supabase.from('profiles').update({ status }).eq('id', id);
    fetchData();
  };

  return (
    <DataContext.Provider value={{
      // State
      products, categories, orders, banners, offers, users, staff,
      coupons, wishlist, recentlyViewed, myLocalOrders, loading,
      // Actions
      fetchData,
      toggleWishlist, addToRecentlyViewed,
      addProduct, updateProduct, deleteProduct, bulkAddProducts,
      addCategory, deleteCategory,
      addOrder, updateOrderStatus, deleteOrder,
      addBanner, deleteBanner, addOffer, deleteOffer,
      addCoupon, deleteCoupon,
      addStaff, deleteStaff, updateStaffStatus,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
