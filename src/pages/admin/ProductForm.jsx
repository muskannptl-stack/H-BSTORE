import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, Upload, X, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const ProductForm = () => {
  const { products, categories, addProduct, updateProduct } = useData();
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);
  
  const isSetup = id ? true : false;
  const existingProduct = isSetup ? products.find(p => (p.firestoreId === id || p.id === parseInt(id))) : null;

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: categories[0] || '',
    image: '',
    description: '',
    sizes: '',
    colors: '',
    stock: 50
  });

  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    if (existingProduct) {
      setFormData({
        ...existingProduct,
        sizes: Array.isArray(existingProduct.sizes) ? existingProduct.sizes.join(', ') : existingProduct.sizes || '',
        colors: Array.isArray(existingProduct.colors) ? existingProduct.colors.join(', ') : existingProduct.colors || '',
      });
    }
  }, [existingProduct]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
        setUploadLoading(false);
        addToast('Image selected successfully', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const [isSaving, setIsSaving] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const submitData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        sizes: typeof formData.sizes === 'string' ? formData.sizes.split(',').map(s => s.trim()) : formData.sizes,
        colors: typeof formData.colors === 'string' ? formData.colors.split(',').map(c => c.trim()) : formData.colors,
      };

      if (existingProduct) {
        await updateProduct({ ...submitData, firestoreId: existingProduct.firestoreId, id: existingProduct.id });
        addToast('Product updated successfully', 'success');
      } else {
        await addProduct(submitData);
        addToast('Product created successfully', 'success');
      }
      navigate('/admin/products');
    } catch (error) {
      console.error("Error saving product:", error);
      addToast('Failed to save product. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="p-3 bg-white hover:bg-gray-50 rounded-2xl shadow-sm border border-gray-100 transition-all active:scale-95"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-black text-gray-900">{existingProduct ? 'Edit Product' : 'Create New Product'}</h2>
          <p className="text-gray-500 text-sm font-medium">Add details for your awesome product</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Product Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
              <input 
                required type="text" name="name" 
                value={formData.name} onChange={handleChange} 
                placeholder="Ex: Premium Cotton Kurta"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold" 
              />
            </div>

            <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
               <textarea 
                 required name="description" 
                 value={formData.description} onChange={handleChange} 
                 rows="4" 
                 placeholder="Describe the product quality, fabric, fit etc."
                 className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium resize-none"
               ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Price (₹)</label>
                <input 
                  required type="number" min="0" name="price" 
                  value={formData.price} onChange={handleChange} 
                  placeholder="999"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all font-black text-lg" 
                />
              </div>
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                 <select 
                   name="category" value={formData.category} onChange={handleChange} 
                   className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold appearance-none"
                 >
                   {categories.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
             <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" /> Inventory & Variants
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Sizes (CSV)</label>
                   <input 
                     type="text" name="sizes" 
                     value={formData.sizes || ''} onChange={handleChange} 
                     placeholder="S, M, L, XL" 
                     className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" 
                   />
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Colors (CSV)</label>
                   <input 
                     type="text" name="colors" 
                     value={formData.colors || ''} onChange={handleChange} 
                     placeholder="Red, White, Blue" 
                     className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" 
                   />
                </div>
             </div>
          </div>
        </div>

        {/* Right: Media & Submit */}
        <div className="space-y-6">
           <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 text-center">
              <label className="block text-sm font-bold text-gray-700 mb-4 text-left">Product Image</label>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative group cursor-pointer border-2 border-dashed border-gray-200 rounded-[1.5rem] overflow-hidden transition-all hover:border-blue-500 aspect-square flex flex-col items-center justify-center bg-gray-50 ${formData.image ? 'p-0' : 'p-6'}`}
              >
                 {formData.image ? (
                   <>
                     <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload className="text-white h-8 w-8" />
                     </div>
                   </>
                 ) : (
                   <>
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                         <Upload className="h-8 w-8 text-blue-500" />
                      </div>
                      <p className="text-sm font-bold text-gray-900">Upload Photo</p>
                      <p className="text-xs text-gray-500 mt-1">Select from Gallery</p>
                   </>
                 )}
                 <input 
                   type="file" 
                   accept="image/*" 
                   ref={fileInputRef} 
                   onChange={handleFileSelect} 
                   className="hidden" 
                 />
              </div>

              <div className="mt-6">
                 <p className="text-xs text-gray-400 font-medium mb-4">Or use an External Link</p>
                 <input 
                   type="url" name="image" 
                   value={formData.image.startsWith('data:') ? '' : formData.image} 
                   onChange={handleChange} 
                   placeholder="Paste Image URL..." 
                   className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none" 
                 />
              </div>
           </div>

           <button 
             type="submit" 
             disabled={isSaving}
             className={`w-full text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-3 ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
           >
             {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
             ) : (
                existingProduct ? 'Update Listing' : 'Publish Product'
             )}
           </button>
           
           <button 
             type="button"
             onClick={() => navigate('/admin/products')}
             className="w-full bg-white hover:bg-gray-50 text-gray-600 py-4 rounded-[1.5rem] font-bold text-sm border border-gray-100 transition-all"
           >
             Discard Changes
           </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;

