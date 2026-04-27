import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton, CategorySkeleton } from '../components/Skeleton';
import { ShoppingBag, Clock, Percent, ShieldCheck, Store } from 'lucide-react';

const Home = () => {
  const { products, categories, loading, banners, offers, recentlyViewed } = useData();
  
  // Dynamic Content from Admin
  const mainBanner = banners[0] || { 
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e', 
    title: 'Premium Groceries Delivered Instantly',
    desc: 'Experience the finest selection of daily essentials with blazing fast delivery.' 
  };
  
  const promoOffer = offers[0] || {
    title: "Snack O'Clock!",
    desc: "Get flat 20% off on all snacks this weekend.",
    category: 'Snacks',
    color: 'orange'
  };

  const featuredProducts = products.slice(0, 8);


  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-900 via-green-700 to-green-500 py-20 px-4">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-1/2 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-overlay filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/2 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 rounded-[2.5rem] bg-white/10 backdrop-blur-md border border-white/20 p-8 md:p-14 text-center md:text-left flex flex-col md:flex-row items-center gap-10 shadow-2xl">
          <div className="flex-1">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]"
            >
              {mainBanner.title || 'Premium Groceries Delivered'}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-lg md:text-xl text-green-50 mb-10 max-w-lg mx-auto md:mx-0 font-medium opacity-90"
            >
              {mainBanner.desc || 'Experience the finest selection with blazing fast delivery.'}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/products" className="group bg-white text-green-800 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-yellow-300 hover:text-green-900 transition-all duration-300 inline-flex items-center gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(253,224,71,0.4)] active:scale-95">
                <ShoppingBag className="h-6 w-6 group-hover:scale-110 transition-transform" /> Start Shopping
              </Link>
            </motion.div>
          </div>
          <div className="flex-1 hidden md:flex justify-center relative">
             <div className="grid grid-cols-2 gap-5 relative z-10">
               {products.slice(13, 17).map((p, i) => (
                 <motion.img 
                   key={p.id}
                   initial={{ opacity: 0, scale: 0.8, y: 20 }}
                   animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
                   transition={{ delay: 0.2 + (i * 0.1), y: { repeat: Infinity, duration: 4 + i, ease: "easeInOut" } }}
                   src={p.image} 
                   alt={p.name}
                   className="w-36 h-36 rounded-3xl object-cover border-[6px] border-white/80 shadow-2xl hover:rotate-6 hover:scale-110 transition-all duration-300"
                 />
               ))}
             </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Clock, title: "Superfast Delivery", desc: "Order delivered in minutes" },
            { icon: Percent, title: "Best Offers", desc: "Cheaper than your local market" },
            { icon: ShieldCheck, title: "Fresh Quality", desc: "We ensure top quality items" },
            { icon: Store, title: "Wide Assortment", desc: "Everything you need everyday" },
          ].map((feat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center"
            >
              <div className="bg-green-50 p-3 rounded-full text-green-600 mb-3">
                <feat.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">{feat.title}</h3>
              <p className="text-xs text-gray-500">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Shop by Category</h2>
          <Link to="/products" className="text-green-600 font-medium hover:text-green-700 text-sm">See all</Link>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {loading ? (
             Array(8).fill(0).map((_, i) => <CategorySkeleton key={i} />)
          ) : (
            categories.map((category, index) => {
              const catName = typeof category === 'object' ? category.name : category;
              const catImg = products.find(p => p.category === catName)?.image;
              return (
                <Link 
                  key={index} 
                  to={`/products?category=${catName}`}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className="w-full aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-2 group-hover:shadow-md transition-shadow">
                    <img src={catImg} alt={catName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-green-600 transition-colors text-sm">{catName}</span>
                </Link>
              )
            })
          )}
        </div>
      </section>

      {/* Deal of the Day */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden shadow-2xl shadow-orange-200">
           {/* Decorative elements */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
           
           <div className="flex-1 text-center md:text-left z-10">
              <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-white text-xs font-bold uppercase tracking-widest mb-6">Limited Time Offer</div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">Deal of the Day</h2>
              <p className="text-orange-50 text-lg mb-8 max-w-md">Grab our freshest seasonal fruits at unbeatable prices. Only for the next few hours!</p>
              
              <div className="flex items-center justify-center md:justify-start gap-4 mb-8">
                 {[
                   { label: 'Hrs', val: '08' },
                   { label: 'Min', val: '45' },
                   { label: 'Sec', val: '12' }
                 ].map((t, i) => (
                   <div key={i} className="flex flex-col items-center">
                      <div className="bg-white rounded-2xl w-16 h-16 flex items-center justify-center text-2xl font-black text-orange-600 shadow-lg">{t.val}</div>
                      <span className="text-[10px] font-bold text-white uppercase mt-2 tracking-widest">{t.label}</span>
                   </div>
                 ))}
              </div>
              
              <Link to="/products?category=Fruits" className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-black text-lg hover:bg-orange-50 transition-all shadow-xl active:scale-95 inline-block">Claim Offer Now</Link>
           </div>
           
           <div className="flex-1 relative z-10">
              <motion.img 
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                src="https://images.unsplash.com/photo-1610832958506-aa56368176cf" 
                alt="Fresh Fruits" 
                className="w-full h-80 object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]" 
              />
           </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-10">
         <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Best Sellers</h2>
        </div>
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {loading ? (
            Array(5).fill(0).map((_, i) => <ProductSkeleton key={i} />)
          ) : (
            featuredProducts.map(product => (
              <motion.div key={product.id} variants={item}>
                <ProductCard product={product} />
              </motion.div>
            ))
          )}
        </motion.div>
      </section>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Recently Viewed</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recentlyViewed.map(id => {
              const p = products.find(prod => prod.id === id);
              return p ? <ProductCard key={p.id} product={p} /> : null;
            })}
          </div>
        </section>
      )}
      
      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className={`bg-${promoOffer.color || 'orange'}-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between border border-${promoOffer.color || 'orange'}-200`}>
          <div>
            <h2 className={`text-3xl font-bold text-${promoOffer.color || 'orange'}-900 mb-2`}>{promoOffer.title}</h2>
            <p className={`text-${promoOffer.color || 'orange'}-800 mb-4`}>{promoOffer.desc}</p>
            <Link to={`/products?category=${promoOffer.category}`} className={`bg-${promoOffer.color || 'orange'}-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-${promoOffer.color || 'orange'}-600 transition-colors inline-block`}>Shop Now</Link>
          </div>
          <div className="mt-6 md:mt-0 flex gap-4">
             {products.filter(p => p.category === 'Snacks').slice(0, 2).map((p, i) => (
                <img key={p.id} src={p.image} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" alt={p.name} />
             ))}
          </div>
        </div>
      </section>
      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-gray-900 rounded-[3.5rem] p-8 md:p-20 text-center relative overflow-hidden">
           {/* Abstract shapes */}
           <div className="absolute top-0 left-0 w-64 h-64 bg-green-500 rounded-full blur-[120px] opacity-20 -ml-32 -mt-32"></div>
           <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[120px] opacity-20 -mr-32 -mb-32"></div>
           
           <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Join the Freshness!</h2>
              <p className="text-gray-400 text-lg mb-10">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
              
              <form className="flex flex-col sm:flex-row gap-4">
                 <input 
                   type="email" 
                   placeholder="Enter your email address" 
                   className="flex-1 bg-white/10 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white/20 transition-all font-medium"
                 />
                 <button className="bg-green-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-green-600 transition-all shadow-xl shadow-green-900/20 active:scale-95">
                    Subscribe Now
                 </button>
              </form>
              <p className="text-gray-500 text-xs mt-6">We respect your privacy. Unsubscribe at any time.</p>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
