import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const ProductForm = () => {
  const { products, categories, addProduct, updateProduct } = useData();
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToast } = useToast();
  
  const isSetup = id ? true : false;
  // Look for firestoreId first as that's what we use in our cloud-backed context
  const existingProduct = isSetup ? products.find(p => (p.firestoreId === id || p.id === parseInt(id))) : null;

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: categories[0] || '',
    image: '',
    description: '',
  });

  useEffect(() => {
    if (existingProduct) {
      setFormData(existingProduct);
    }
  }, [existingProduct]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      price: Number(formData.price)
    };

    // Duplicate Check
    const isDuplicate = products.some(p => 
      p.name.toLowerCase().trim() === submitData.name.toLowerCase().trim() &&
      p.id !== existingProduct?.id
    );

    if (isDuplicate) {
      addToast('A product with this name already exists!', 'error');
      return;
    }

    if (existingProduct) {
      updateProduct({ ...submitData, firestoreId: existingProduct.firestoreId, id: existingProduct.id });
      addToast('Product updated successfully');
    } else {
      addProduct(submitData);
      addToast('Product created successfully');
    }
    navigate('/admin/products');
  };

  return (
    <div className="max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h2 className="text-xl font-bold text-gray-900">{existingProduct ? 'Edit Product' : 'Add New Product'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
            <input required type="number" min="0" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none" />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
             <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none bg-white">
               {categories.map(c => <option key={c} value={c}>{c}</option>)}
             </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input required type="url" name="image" value={formData.image} onChange={handleChange} placeholder="https://images.unsplash.com/..." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none" />
          {formData.image && (
            <div className="mt-3 w-20 h-20 bg-gray-50 border rounded-lg overflow-hidden">
               <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Variants (Sizes)</label>
              <input type="text" name="sizes" value={formData.sizes || ''} onChange={handleChange} placeholder="S, M, L, XL" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none" />
              <p className="text-[10px] text-gray-400 mt-1">Comma separated.</p>
           </div>
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Variants (Colors)</label>
              <input type="text" name="colors" value={formData.colors || ''} onChange={handleChange} placeholder="Red, Blue, Green" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none" />
              <p className="text-[10px] text-gray-400 mt-1">Comma separated.</p>
           </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
           <textarea required name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none resize-none"></textarea>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-black transition-colors w-full sm:w-auto">
            {existingProduct ? 'Update Product' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
