import React, { useState } from 'react';
import { UserPlus, Shield, Mail, Trash2, Key, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../context/DataContext';

const Staff = () => {
  const { staff, addStaff, deleteStaff, updateStaffStatus } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'Manager',
    access: ['Orders']
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addStaff(newMember);
    setShowAddModal(false);
    setNewMember({ name: '', email: '', role: 'Manager', access: ['Orders'] });
  };

  const toggleAccess = (perm) => {
    const access = newMember.access.includes(perm)
      ? newMember.access.filter(p => p !== perm)
      : [...newMember.access, perm];
    setNewMember({ ...newMember, access });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
         <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Staff Management</h1>
            <p className="text-gray-500 text-sm">Grant system access to your employees.</p>
         </div>
         <button 
           onClick={() => setShowAddModal(true)}
           className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-black transition-all shadow-lg flex items-center gap-2 text-sm"
         >
           <UserPlus className="h-4 w-4" /> Add Team Member
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <AnimatePresence>
            {staff.map((member, i) => (
              <motion.div 
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col relative overflow-hidden group"
              >
                 <div className={`absolute top-0 right-0 px-4 py-1 rounded-bl-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 text-white ${member.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {member.status === 'Active' ? <CheckCircle2 className="h-3 w-3" /> : <X className="h-3 w-3" />} {member.status}
                 </div>

                 <div className="flex items-center gap-4 mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-gray-900 flex items-center justify-center text-white text-xl font-black italic">
                       {member.name.charAt(0)}
                    </div>
                    <div>
                       <h3 className="font-extrabold text-gray-900">{member.name}</h3>
                       <p className="text-xs text-gray-400 font-medium truncate max-w-[150px]">{member.email}</p>
                    </div>
                 </div>

                 <div className="space-y-4 flex-1">
                    <div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Role</p>
                       <div className="bg-gray-50 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 border border-gray-100 flex items-center gap-2 w-fit">
                          <Shield className="h-3.5 w-3.5 text-blue-500" /> {member.role}
                       </div>
                    </div>

                    <div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Access</p>
                       <div className="flex flex-wrap gap-1.5">
                          {member.access.map(perm => (
                            <span key={perm} className="px-2 py-1 bg-white text-gray-600 rounded-lg text-[10px] font-bold border border-gray-100 shadow-sm">
                              {perm}
                            </span>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="mt-8 pt-4 border-t border-gray-50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => updateStaffStatus(member.id, member.status === 'Active' ? 'Suspended' : 'Active')}
                      className="text-gray-400 hover:text-blue-500 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                       <Key className="h-3.5 w-3.5" /> {member.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                    <button 
                      onClick={() => deleteStaff(member.id)}
                      className="text-gray-400 hover:text-red-500 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                       <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                 </div>
              </motion.div>
            ))}
         </AnimatePresence>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl"
           >
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-black text-gray-900">Add Team Member</h2>
                 <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="h-5 w-5" />
                 </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Member Name</label>
                    <input 
                      required type="text" 
                      value={newMember.name}
                      onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none font-bold"
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email Address</label>
                    <input 
                      required type="email" 
                      value={newMember.email}
                      onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none font-bold"
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Role</label>
                    <select 
                      value={newMember.role}
                      onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none font-bold bg-white"
                    >
                       <option>Manager</option>
                       <option>Support</option>
                       <option>Editor</option>
                       <option>Delivery</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Section Access</label>
                    <div className="flex flex-wrap gap-2">
                       {['Products', 'Orders', 'Customers', 'SEO', 'Coupons'].map(perm => (
                         <button
                           key={perm}
                           type="button"
                           onClick={() => toggleAccess(perm)}
                           className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${newMember.access.includes(perm) ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-100'}`}
                         >
                           {perm}
                         </button>
                       ))}
                    </div>
                 </div>

                 <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black mt-4 hover:shadow-xl transition-all active:scale-95">
                    Save Member Details
                 </button>
              </form>
           </motion.div>
        </div>
      )}
    </div>
  );
};

export default Staff;
