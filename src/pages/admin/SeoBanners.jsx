import React, { useState } from 'react';
import { Megaphone, ImagePlus, Globe, Search, Save, Trash2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

const SeoBanners = () => {
  const { banners, addBanner, deleteBanner, offers, addOffer, deleteOffer } = useData();
  const { addToast } = useToast();
  
  const [newBanner, setNewBanner] = useState({ title: '', desc: '', image: '' });
  const [newOffer, setNewOffer] = useState({ title: '', desc: '', category: 'Grocery', color: 'orange' });

  const handleAddBanner = async (e) => {
    e.preventDefault();
    await addBanner(newBanner);
    setNewBanner({ title: '', desc: '', image: '' });
    addToast('Hero Banner updated successfully!');
  };

  const handleAddOffer = async (e) => {
    e.preventDefault();
    await addOffer(newOffer);
    setNewOffer({ title: '', desc: '', category: 'Grocery', color: 'orange' });
    addToast('Special Offer active now!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
         <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Marketing Control Center</h1>
            <p className="text-gray-500 text-sm">Instantly update banners, offers and SEO across the entire site.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Banner Management */}
         <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-3 mb-8">
               <ImagePlus className="h-6 w-6 text-blue-500" /> Hero Banners
            </h2>

            <form onSubmit={handleAddBanner} className="space-y-4 mb-10 bg-gray-50 p-6 rounded-3xl border border-gray-100">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Create New Banner</p>
               <input 
                 type="text" placeholder="Main Title (e.g. Fresh Mangoes)" 
                 required value={newBanner.title} onChange={e => setNewBanner({...newBanner, title: e.target.value})}
                 className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
               />
               <input 
                 type="text" placeholder="Subtitle / Description" 
                 required value={newBanner.desc} onChange={e => setNewBanner({...newBanner, desc: e.target.value})}
                 className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
               />
               <input 
                 type="url" placeholder="Image URL" 
                 required value={newBanner.image} onChange={e => setNewBanner({...newBanner, image: e.target.value})}
                 className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
               />
               <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-100">
                 <Plus className="h-4 w-4" /> Deploy Banner
               </button>
            </form>

            <div className="space-y-3">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Active Banners</p>
               {banners.map(b => (
                 <div key={b.firestoreId} className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-2xl group hover:shadow-md transition-all">
                    <img src={b.image} className="w-20 h-12 object-cover rounded-lg" alt="" />
                    <div className="flex-1 min-w-0">
                       <p className="text-sm font-bold text-gray-800 truncate">{b.title}</p>
                       <p className="text-[10px] text-gray-400 truncate">{b.desc}</p>
                    </div>
                    <button onClick={() => deleteBanner(b.firestoreId)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                       <Trash2 className="h-4 w-4" />
                    </button>
                 </div>
               ))}
            </div>
         </div>

         {/* Offers Management */}
         <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-3 mb-8">
               <Megaphone className="h-6 w-6 text-orange-500" /> Promo & Offers
            </h2>

            <form onSubmit={handleAddOffer} className="space-y-4 mb-10 bg-gray-50 p-6 rounded-3xl border border-gray-100">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Create Homepage Offer</p>
               <input 
                 type="text" placeholder="Offer Title (e.g. Winter Sale)" 
                 required value={newOffer.title} onChange={e => setNewOffer({...newOffer, title: e.target.value})}
                 className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm font-medium"
               />
               <input 
                 type="text" placeholder="Sub-text (e.g. Up to 50% Off)" 
                 required value={newOffer.desc} onChange={e => setNewOffer({...newOffer, desc: e.target.value})}
                 className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm font-medium"
               />
               <div className="grid grid-cols-2 gap-3">
                  <select 
                    value={newOffer.category} onChange={e => setNewOffer({...newOffer, category: e.target.value})}
                    className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium"
                  >
                     <option value="Grocery">Grocery</option>
                     <option value="Snacks">Snacks</option>
                     <option value="Drinks">Drinks</option>
                     <option value="Fruits">Fruits</option>
                  </select>
                  <select 
                    value={newOffer.color} onChange={e => setNewOffer({...newOffer, color: e.target.value})}
                    className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium"
                  >
                     <option value="orange">Orange Theme</option>
                     <option value="blue">Blue Theme</option>
                     <option value="green">Green Theme</option>
                     <option value="purple">Purple Theme</option>
                  </select>
               </div>
               <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-orange-100">
                 <Plus className="h-4 w-4" /> Activate Offer
               </button>
            </form>

            <div className="space-y-3">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Currently Live Offers</p>
               {offers.map(o => (
                 <div key={o.firestoreId} className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-2xl group">
                    <div className={`w-3 h-12 rounded-full bg-${o.color}-500 shadow-lg shadow-${o.color}-200`}></div>
                    <div className="flex-1">
                       <p className="text-sm font-bold text-gray-800">{o.title}</p>
                       <p className="text-xs text-gray-500 line-clamp-1">{o.desc}</p>
                    </div>
                    <button onClick={() => deleteOffer(o.firestoreId)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                       <Trash2 className="h-4 w-4" />
                    </button>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default SeoBanners;

