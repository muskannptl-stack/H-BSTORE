import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Categories = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useData();
  const [newCat, setNewCat] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editVal, setEditVal] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if(newCat.trim()) {
      addCategory(newCat.trim());
      setNewCat('');
    }
  };

  const handleSaveEdit = (oldCat) => {
    if(editVal.trim() && editVal !== oldCat) {
      updateCategory(oldCat, editVal.trim());
    }
    setEditingId(null);
  };

  const handleDelete = (cat) => {
    if(window.confirm(`Delete category "${cat}"? Products under this category might lose their grouping.`)) {
      deleteCategory(cat);
    }
  }

  return (
    <div className="max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Manage Categories</h2>
      
      <form onSubmit={handleAdd} className="flex gap-3 mb-8">
        <input 
          type="text" 
          value={newCat} 
          onChange={(e) => setNewCat(e.target.value)} 
          placeholder="New category name..." 
          className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none"
        />
        <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-xl hover:bg-black transition-colors font-medium flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add
        </button>
      </form>

      <div className="space-y-3">
        {categories.map((cat, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
            {editingId === cat ? (
              <input 
                type="text" 
                value={editVal} 
                onChange={(e) => setEditVal(e.target.value)} 
                className="px-3 py-1 border border-gray-300 rounded focus:outline-none"
                autoFocus
                onBlur={() => handleSaveEdit(cat)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(cat)}
              />
            ) : (
              <span className="font-semibold text-gray-800">{cat}</span>
            )}
            
            <div className="flex gap-2">
               {editingId !== cat && (
                  <button onClick={() => { setEditingId(cat); setEditVal(cat); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 className="h-4 w-4" />
                  </button>
               )}
               <button onClick={() => handleDelete(cat)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                 <Trash2 className="h-4 w-4" />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
