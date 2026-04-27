import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, Check, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { supabase } from '../../supabase/config';

const ProductForm = () => {
  const { products, categories, addProduct, updateProduct } = useData();
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);
  
  const isEdit = id ? true : false;
  const existingProduct = isEdit ? products.find(p => p.id === id) : null;

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: categories[0] || '',
    image: '',
    images: [],
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
        images: existingProduct.images || [],
        sizes: Array.isArray(existingProduct.sizes) ? existingProduct.sizes.join(', ') : existingProduct.sizes || '',
        colors: Array.isArray(existingProduct.colors) ? existingProduct.colors.join(', ') : existingProduct.colors || '',
      });
    } else if (categories.length > 0 && !formData.category) {
      setFormData(prev => ({ ...prev, category: typeof categories[0] === 'object' ? categories[0].name : categories[0] }));
    }
  }, [existingProduct, categories]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileSelect = async (e, type = 'main') => {
    const file = e.target.files[0];
    if (file) {
      setUploadLoading(true);
      try {
        addToast(`Uploading ${type} image...`, 'info');
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);
        
        if (type === 'main') {
          setFormData(prev => ({ ...prev, image: publicUrl }));
        } else {
          setFormData(prev => ({ ...prev, images: [...(prev.images || []), publicUrl] }));
        }
        addToast('Image uploaded successfully', 'success');
      } catch (error) {
        console.error("Upload failed", error);
        addToast('Failed to upload image. Make sure "products" bucket exists.', 'error');
      } finally {
        setUploadLoading(false);
      }
    }
  };

  const removeImage = (url) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== url)
    }));
  };

  const [isSaving, setIsSaving] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      addToast('Product main image is required', 'error');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const parseList = (val) => {
        if (!val) return [];
        if (Array.isArray(val)) return val;
        return val.split(',').map(s => s.trim()).filter(Boolean);
      };

      const submitData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        sizes: parseList(formData.sizes),
        colors: parseList(formData.colors),
      };

      // Remove ID if adding new
      if (!isEdit) delete submitData.id;

      let result;
      if (isEdit) {
        result = await updateProduct({ ...submitData, id });
      } else {
        result = await addProduct(submitData);
      }

      if (result?.error) throw result.error;

      addToast(`Product ${isEdit ? 'updated' : 'created'} successfully`, 'success');
      navigate('/admin/products');
    } catch (error) {
      console.error("Error saving product:", error);
      addToast(error.message || 'Failed to save product. Please try again.', 'error');
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

            {/* Gallery Section */}
            <div className="pt-4">
               <label className="block text-sm font-bold text-gray-700 mb-4">Product Gallery (Multiple Images)</label>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(formData.images || []).map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 group">
                       <img src={img} className="w-full h-full object-cover" alt="" />
                       <button 
                         type="button"
                         onClick={() => removeImage(img)}
                         className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                       >
                          <X className="h-3 w-3" />
                       </button>
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => handleFileSelect(e, 'gallery');
                      input.click();
                    }}
                    className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-all text-gray-400 gap-2"
                  >
                     <Upload className="h-6 w-6" />
                     <span className="text-[10px] font-bold uppercase tracking-wider">Add More</span>
                  </button>
               </div>
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
                   value={formData.image?.startsWith('data:') ? '' : formData.image} 
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

