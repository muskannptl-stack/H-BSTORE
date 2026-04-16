import React, { useCallback, useState } from 'react';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

const BulkUpload = () => {
  const { bulkAddProducts } = useData();
  const { addToast } = useToast();
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const bstr = e.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
          addToast('File is empty!', 'error');
          setUploading(false);
          return;
        }

        // Simple validation mapping
        const validatedData = data.map(item => ({
          name: item.name || item.Name || 'Unnamed Product',
          price: Number(item.price || item.Price || 0),
          category: item.category || item.Category || 'Grocery',
          image: item.image || item.Image || 'https://images.unsplash.com/photo-1542838132-92c53300491e',
          description: item.description || item.Description || '',
          sizes: item.sizes || item.Sizes || '',
          colors: item.colors || item.Colors || ''
        }));

        await bulkAddProducts(validatedData);
        addToast(`Successfully imported ${validatedData.length} products!`);
      } catch (err) {
        addToast('Failed to parse file. Check template format.', 'error');
        console.error(err);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsBinaryString(file);
  }, [bulkAddProducts, addToast]);
  
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
     onDrop,
     accept: {
       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
       'text/csv': ['.csv']
     }
  });

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        name: 'Sample Product Name',
        price: 999,
        category: categories[0] || 'Grocery',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e',
        description: 'Product description goes here',
        sizes: 'S, M, L, XL',
        colors: 'Red, Blue, Green'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "HB_Store_Bulk_Upload_Template.xlsx");
    addToast('Template downloaded! Use this format for bulk upload.', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
         <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Bulk Upload Products</h1>
            <p className="text-gray-500 text-sm">Add thousands of products instantly using Excel/CSV templates.</p>
         </div>
         <button 
           onClick={handleDownloadTemplate}
           className="bg-gray-100 text-gray-800 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-200 transition-colors text-sm shadow-sm flex items-center gap-2 border border-gray-200"
         >
           <FileSpreadsheet className="h-4 w-4" /> Download Template
         </button>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Dropzone Area */}
         <div className="lg:col-span-2">
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[300px] ${
                uploading ? 'border-gray-200 bg-gray-50 cursor-not-allowed' :
                isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} disabled={uploading} />
              
              {uploading ? (
                <div className="flex flex-col items-center">
                   <Loader2 className="h-10 w-10 text-gray-400 animate-spin mb-4" />
                   <p className="text-xl font-bold text-gray-700">Uploading & Processing...</p>
                   <p className="text-sm text-gray-400">Please wait while we sync with database.</p>
                </div>
              ) : (
                <>
                  <div className={`p-5 rounded-full mb-4 ${isDragActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                     <UploadCloud className="h-10 w-10" />
                  </div>
                  {
                    isDragActive ?
                      <p className="text-xl font-bold text-green-600">Drop the files here ...</p> :
                      <div>
                        <p className="text-xl font-bold text-gray-800 mb-2">Drag & drop your Excel or CSV file</p>
                        <p className="text-sm text-gray-500">or click to browse your computer</p>
                      </div>
                  }
                  <p className="text-xs text-gray-400 mt-6 max-w-sm">Maximum file size: 50MB. Supported formats: .xlsx, .csv. Ensure your headers exactly match the template.</p>
                </>
              )}
            </div>

         </div>

         {/* Instructions Sidebar */}
         <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-4">Guidelines</h3>
            <ul className="space-y-4">
               <li className="flex gap-3">
                  <span className="text-green-500 mt-0.5"><CheckCircle2 className="h-5 w-5" /></span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Use correct format</p>
                    <p className="text-xs text-gray-500">Dates must be YYYY-MM-DD, Prices must be numeric without symbols.</p>
                  </div>
               </li>
               <li className="flex gap-3">
                  <span className="text-green-500 mt-0.5"><CheckCircle2 className="h-5 w-5" /></span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Variants & Sizes</p>
                    <p className="text-xs text-gray-500">Separate multiple variants using commas (e.g., S,M,L,XL).</p>
                  </div>
               </li>
               <li className="flex gap-3">
                  <span className="text-orange-500 mt-0.5"><AlertCircle className="h-5 w-5" /></span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Image URLs</p>
                    <p className="text-xs text-gray-500">Provide direct public HTTPS links for all product images.</p>
                  </div>
               </li>
            </ul>
         </div>
      </div>
    </div>
  );
};

export default BulkUpload;
