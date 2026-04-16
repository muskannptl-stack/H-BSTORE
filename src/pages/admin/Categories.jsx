import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Edit2, Trash2, Folder, Check, X, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Categories = () => {
  const { categories, addCategory, deleteCategory } = useData();
  const [newCat, setNewCat] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if(newCat.trim()) {
      addCategory(newCat.trim());
      setNewCat('');
      setShowAdd(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Category Lab</h1>
            <p className="text-gray-500 text-sm font-medium">Organize your store for better discoverability.</p>
         </div>
         <button 
           onClick={() => setShowAdd(true)}
           className="bg-gray-900 text-white px-6 py-3 rounded-[1.2rem] font-bold hover:bg-black transition-all shadow-lg active:scale-95 flex items-center gap-2"
         >
           <Plus className="h-5 w-5" /> New Category
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <AnimatePresence>
            {categories.map((cat, i) => (
              <motion.div 
                key={cat}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 group relative overflow-hidden"
              >
                 <div className="absolute top-0 left-0 w-2 h-full bg-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 
                 <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-gray-900 group-hover:text-white transition-all">
                       <Tag className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 truncate">{cat}</h3>
                 </div>

                 <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span>Active Collection</span>
                    <button 
                      onClick={() => {
                        if(window.confirm(`Delete "${cat}"? Products in this category will become uncategorized.`)) {
                          deleteCategory(cat);
                        }
                      }}
                      className="text-red-300 hover:text-red-500 transition-colors p-2"
                    >
                       <Trash2 className="h-4 w-4" />
                    </button>
                 </div>
              </motion.div>
            ))}
         </AnimatePresence>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
         {showAdd && (
           <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl relative overflow-hidden"
              >
                 <div className="absolute top-0 left-0 w-full h-2 bg-gray-900"></div>
                 <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black text-gray-900">Add Category</h2>
                    <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                       <X className="h-6 w-6" />
                    </button>
                 </div>

                 <form onSubmit={handleAdd} className="space-y-6">
                    <div>
                       <label className="block text-xs font-black text-gray-400 uppercase mb-3 tracking-widest">Category Name</label>
                       <input 
                         required autoFocus
                         type="text" 
                         value={newCat}
                         onChange={(e) => setNewCat(e.target.value)}
                         placeholder="e.g. Winter Wear"
                         className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-gray-900/5 outline-none font-bold text-lg"
                       />
                    </div>

                    <button type="submit" className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:shadow-gray-200 transition-all active:scale-95 flex items-center justify-center gap-3">
                       <Plus className="h-6 w-6" /> Create Category
                    </button>
                 </form>
              </motion.div>
           </div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default Categories;
