import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Package, Tags, ShoppingBag, LogOut, Store, UserCircle, Ticket, Megaphone, UploadCloud, Shield } from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user || user.email !== 'mrsunil') {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { name: 'Analytics', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Tags },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', path: '/admin/users', icon: UserCircle },
    { name: 'Coupons', path: '/admin/coupons', icon: Ticket },
    { name: 'Banners & SEO', path: '/admin/seo', icon: Megaphone },
    { name: 'Bulk Upload', path: '/admin/bulk', icon: UploadCloud },
    { name: 'Staff Management', path: '/admin/staff', icon: Shield },
  ];




  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 fixed h-full flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gray-900 p-1.5 rounded-lg">
              <Store className="text-white h-5 w-5" />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">Admin <span className="text-gray-500">Panel</span></span>
          </Link>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.name} 
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${isActive ? 'bg-gray-900 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium text-sm"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-gray-200 flex items-center px-8 justify-between sticky top-0 z-10">
          <h1 className="text-xl font-bold text-gray-800">
            {navItems.find(i => location.pathname === i.path || (i.path !== '/admin' && location.pathname.startsWith(i.path)))?.name || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-6 text-sm">
             <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
               <span className="text-[10px] font-extrabold uppercase tracking-wider">Live Sync Active</span>
             </div>
             <div className="flex items-center gap-3">
               <span className="font-medium text-gray-700">Administrator</span>
               <div className="h-8 w-8 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm">
                 A
               </div>
             </div>
          </div>
        </header>
        
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
