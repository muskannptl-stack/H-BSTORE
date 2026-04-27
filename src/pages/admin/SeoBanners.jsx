import React, { useState, useRef } from 'react';
import { Megaphone, ImagePlus, Trash2, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { supabase } from '../../supabase/config';

const SeoBanners = () => {
  const { banners, addBanner, deleteBanner, offers, addOffer, deleteOffer } = useData();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);
  
  const [newBanner, setNewBanner] = useState({ title: '', desc: '', image: '' });
  const [newOffer, setNewOffer] = useState({ title: '', desc: '', category: 'Grocery', color: 'orange' });
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      try {
        addToast("Uploading banner to Supabase storage...", "info");
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `banners/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('banners')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('banners')
          .getPublicUrl(filePath);

        setNewBanner({ ...newBanner, image: publicUrl });
        addToast("Banner image uploaded successfully!", "success");
      } catch (error) {
        console.error("Upload failed", error);
        addToast("Failed to upload image. Ensure 'banners' bucket exists.", "error");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleAddBanner = async (e) => {
    e.preventDefault();
    if (!newBanner.image) {
        addToast('Please select an image first', 'error');
        return;
    }
    await addBanner(newBanner);
    setNewBanner({ title: '', desc: '', image: '' });
    addToast('Hero Banner deployed successfully! ✅');
  };

  const handleAddOffer = async (e) => {
    e.preventDefault();
    await addOffer(newOffer);
    setNewOffer({ title: '', desc: '', category: 'Grocery', color: 'orange' });
    addToast('New Offer is now LIVE! 🔥');
  };

  return (
    <div className="space-y-10 pb-10">
      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Marketing Studio</h1>
            <p className="text-gray-500 font-medium">Visual control center for banners and live promotions.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* Banner Management */}
         <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
               <h2 className="text-xl font-black text-gray-900 flex items-center gap-3 mb-8">
                  <ImagePlus className="h-6 w-6 text-blue-600" /> Hero Spotlight
               </h2>

               <form onSubmit={handleAddBanner} className="space-y-6">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative group cursor-pointer border-2 border-dashed border-gray-200 rounded-[2rem] aspect-[21/9] flex flex-col items-center justify-center bg-gray-50 overflow-hidden hover:border-blue-500 transition-all"
                  >
                     {newBanner.image ? (
                        <>
                           <img src={newBanner.image} className="w-full h-full object-cover" alt="Preview" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                              <Upload className="text-white h-8 w-8" />
                           </div>
                        </>
                     ) : (
                        <div className="flex flex-col items-center">
                           <div className="p-4 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                              <Upload className="h-6 w-6 text-blue-600" />
                           </div>
                           <p className="text-sm font-black text-gray-900">Upload Banner Image</p>
                           <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Recommended: 1920x800</p>
                        </div>
                     )}
                     <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
                  </div>

                  <div className="space-y-4">
                     <input 
                       type="text" placeholder="Engaging Title (e.g. 50% Off Everything)" 
                       required value={newBanner.title} onChange={e => setNewBanner({...newBanner, title: e.target.value})}
                       className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 outline-none font-bold"
                     />
                     <textarea 
                       placeholder="Short Description..." 
                       required value={newBanner.desc} onChange={e => setNewBanner({...newBanner, desc: e.target.value})}
                       className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 outline-none font-medium h-24 resize-none"
                     />
                  </div>

                  <button type="submit" className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-black transition-all active:scale-95">
                    Launch Main Banner
                  </button>
               </form>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Currently Live Banners</p>
               <div className="space-y-4">
                  <AnimatePresence>
                     {banners.map(b => (
                       <motion.div 
                         key={b.firestoreId}
                         initial={{ opacity: 0, x: -20 }}
                         animate={{ opacity: 1, x: 0 }}
                         exit={{ opacity: 0, x: 20 }}
                         className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl group border border-transparent hover:border-gray-200 transition-all"
                       >
                          <img src={b.image} className="w-24 h-14 object-cover rounded-xl shadow-sm" alt="" />
                          <div className="flex-1">
                             <p className="text-sm font-black text-gray-900">{b.title}</p>
                             <p className="text-[10px] text-gray-400 font-bold line-clamp-1">{b.desc}</p>
                          </div>
                          <button onClick={() => deleteBanner(b.id)} className="p-3 text-gray-300 hover:text-red-500 transition-colors">
                             <Trash2 className="h-5 w-5" />
                          </button>
                       </motion.div>
                     ))}
                  </AnimatePresence>
               </div>
            </div>
         </div>

         {/* Offers Management */}
         <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
               <h2 className="text-xl font-black text-gray-900 flex items-center gap-3 mb-8">
                  <Megaphone className="h-6 w-6 text-orange-500" /> Promo Alerts
               </h2>

               <form onSubmit={handleAddOffer} className="space-y-4">
                  <input 
                    type="text" placeholder="Promo Title (e.g. Free Delivery Friday)" 
                    required value={newOffer.title} onChange={e => setNewOffer({...newOffer, title: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-orange-50/30 border border-transparent focus:bg-white focus:border-orange-500 outline-none font-bold"
                  />
                  <input 
                    type="text" placeholder="Offer Sub-text..." 
                    required value={newOffer.desc} onChange={e => setNewOffer({...newOffer, desc: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-orange-50/30 border border-transparent focus:bg-white focus:border-orange-500 outline-none font-medium text-sm"
                  />
                  <div className="grid grid-cols-2 gap-4">
                     <select 
                       value={newOffer.color} onChange={e => setNewOffer({...newOffer, color: e.target.value})}
                       className="px-6 py-4 rounded-2xl bg-orange-50/30 border border-transparent focus:bg-white focus:border-orange-500 outline-none font-bold text-sm"
                     >
                        <option value="orange">Orange Theme</option>
                        <option value="blue">Blue Theme</option>
                        <option value="emerald">Green Theme</option>
                        <option value="rose">Red Theme</option>
                     </select>
                     <button type="submit" className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-orange-100 hover:bg-orange-600 active:scale-95 transition-all">
                        Post Promo
                     </button>
                  </div>
               </form>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Active Announcements</p>
               <div className="space-y-4">
                  {offers.map(o => (
                    <div key={o.id} className="flex items-center gap-4 p-5 bg-gray-50 border border-gray-100 rounded-[2rem] group transition-all">
                       <div className={`w-3 h-12 rounded-full shadow-lg ${
                         o.color === 'rose' ? 'bg-rose-500 shadow-rose-100' :
                         o.color === 'emerald' ? 'bg-emerald-500 shadow-emerald-100' :
                         o.color === 'blue' ? 'bg-blue-500 shadow-blue-100' :
                         'bg-orange-500 shadow-orange-100'
                       }`}></div>
                       <div className="flex-1">
                          <p className="text-sm font-black text-gray-900 uppercase tracking-wider">{o.title}</p>
                          <p className="text-xs text-gray-400 font-bold">{o.desc}</p>
                       </div>
                       <button onClick={() => deleteOffer(o.id)} className="p-3 text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                       </button>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SeoBanners;


