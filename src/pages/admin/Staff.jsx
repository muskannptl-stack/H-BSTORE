import React, { useState } from 'react';
import { UserPlus, Shield, Mail, Trash2, Key, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Staff = () => {
  const [staff, setStaff] = useState([
    { id: 1, name: 'Vikram Singh', email: 'vikram@hbstore.com', role: 'Manager', status: 'Active', access: ['Inventory', 'Orders'] },
    { id: 2, name: 'Sonal Verma', email: 'sonal@hbstore.com', role: 'Support', status: 'Active', access: ['Orders', 'Customers'] },
    { id: 3, name: 'Rahul Das', email: 'rahul@hbstore.com', role: 'Editor', status: 'Suspended', access: ['SEO', 'Products'] },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
         <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Staff Management</h1>
            <p className="text-gray-500 text-sm">Grant system access to your employees and define roles.</p>
         </div>
         <button className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-black transition-all shadow-lg flex items-center gap-2 text-sm">
           <UserPlus className="h-4 w-4" /> Add Team Member
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {staff.map((member, i) => (
           <motion.div 
             key={member.id}
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: i * 0.1 }}
             className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col relative overflow-hidden group"
           >
              {member.status === 'Active' ? (
                <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-1 rounded-bl-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                   <CheckCircle2 className="h-3 w-3" /> Active
                </div>
              ) : (
                <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-1 rounded-bl-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                   Suspended
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                 <div className="h-14 w-14 rounded-2xl bg-gray-900 flex items-center justify-center text-white text-xl font-black">
                    {member.name.charAt(0)}
                 </div>
                 <div>
                    <h3 className="font-extrabold text-gray-900">{member.name}</h3>
                    <p className="text-xs text-gray-400 font-medium flex items-center gap-1"><Mail className="h-3 w-3" /> {member.email}</p>
                 </div>
              </div>

              <div className="space-y-4 flex-1">
                 <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Designation</p>
                    <div className="bg-gray-50 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 border border-gray-100 flex items-center gap-2">
                       <Shield className="h-3.5 w-3.5 text-blue-500" /> {member.role}
                    </div>
                 </div>

                 <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Permissions</p>
                    <div className="flex flex-wrap gap-1.5">
                       {member.access.map(perm => (
                         <span key={perm} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold border border-gray-200">
                           {perm}
                         </span>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <button className="text-gray-400 hover:text-blue-500 font-bold text-xs flex items-center gap-1.5 transition-colors">
                    <Key className="h-3.5 w-3.5" /> Reset Pass
                 </button>
                 <button className="text-gray-400 hover:text-red-500 font-bold text-xs flex items-center gap-1.5 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                 </button>
              </div>
           </motion.div>
         ))}
      </div>
    </div>
  );
};

export default Staff;
