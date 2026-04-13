'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfileAction, updatePasswordAction, addAdminAction, deleteAdminAction } from '@/app/action/settingService';

// 🌟 Reusable inline error component
const InlineError = ({ message }) => {
  if (!message) return null;
  return (
    <p className="text-rose-500 text-[10px] font-bold tracking-wide mt-1.5 ml-2 animate-in fade-in slide-in-from-top-1">
      {message}
    </p>
  );
};

export default function SettingsUI({ currentAdmin, initialAdmins }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isPending, startTransition] = useTransition();
  
  const [notification, setNotification] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({}); 
  const [adminsList, setAdminsList] = useState(initialAdmins || []);

  // 🌟 Password visibility states
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [showTeamPwd, setShowTeamPwd] = useState(false);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Clear errors when switching tabs
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setFieldErrors({});
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    const formData = new FormData(e.target);
    
    startTransition(async () => {
      const result = await updateProfileAction(formData);
      if (!result.success && result.errors) {
        setFieldErrors(result.errors);
      } else if (!result.success) {
        showNotification(result.message, 'error');
      } else {
        showNotification(result.message, 'success');
        router.refresh(); 
      }
    });
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    const formData = new FormData(e.target);
    const password = formData.get('password');
    const confirm = formData.get('confirm');

    // Client-side confirm check
    if (password !== confirm) {
      setFieldErrors({ confirm: "New passwords do not match." });
      return;
    }

    startTransition(async () => {
      const result = await updatePasswordAction(formData, currentAdmin.email);
      if (!result.success && result.errors) {
        setFieldErrors(result.errors);
      } else if (!result.success) {
        showNotification(result.message, 'error');
      } else {
        showNotification(result.message, 'success');
        e.target.reset();
      }
    });
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    const formData = new FormData(e.target);
    
    startTransition(async () => {
      const result = await addAdminAction(formData);
      if (!result.success && result.errors) {
        setFieldErrors(result.errors);
      } else if (!result.success) {
        showNotification(result.message, 'error');
      } else {
        showNotification(result.message, 'success');
        e.target.reset();
        router.refresh(); 
      }
    });
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!confirm("Are you sure you want to permanently revoke this admin's access?")) return;
    
    startTransition(async () => {
      const result = await deleteAdminAction(adminId);
      if (result.success) {
        setAdminsList(prev => prev.filter(admin => admin.id !== adminId));
        showNotification(result.message, 'success');
      } else {
        showNotification(result.message, 'error');
      }
    });
  };

  const getInputStyles = (fieldName) => `w-full bg-slate-50 border px-5 py-4 text-sm font-light text-slate-800 focus:outline-none focus:ring-4 transition-all rounded-2xl placeholder:text-slate-400 ${
    fieldErrors[fieldName] 
      ? 'border-rose-300 focus:bg-rose-50/50 focus:border-rose-400 focus:ring-rose-200/50 bg-rose-50/30' 
      : 'border-slate-200 focus:bg-white focus:border-[#fce3de] focus:ring-[#fce3de]/30'
  }`;
  
  const labelStyles = "block text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2 ml-1";

  // 🌟 Eye Icon SVG Helper
  const EyeIcon = ({ isVisible }) => (
    <svg className="w-5 h-5 text-slate-400 hover:text-slate-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      {isVisible ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
      ) : (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </>
      )}
    </svg>
  );

  return (
    <div className="min-h-screen p-1 md:p-8 font-sans flex flex-col items-center">
      
      {/* HEADER */}
      <div className="w-full max-w-4xl mb-8">
        <h1 className="text-3xl text-slate-950 font-normal tracking-tight font-serif">System Settings</h1>
        <p className="text-sm text-slate-500 mt-1 font-light">Manage your preferences and boutique access</p>
      </div>

      {/* NOTIFICATION TOAST */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl  border flex items-center gap-3 animate-in slide-in-from-top-5 duration-300
          ${notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
          <div className={`w-2 h-2 rounded-full ${notification.type === 'success' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
          <p className="text-xs font-bold uppercase tracking-widest">{notification.message}</p>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-4xl bg-white border border-slate-100 rounded-2xl lg:rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col md:flex-row">
        
        {/* SIDEBAR TABS */}
        <div className="w-full md:w-64 bg-[#fdfaf9] border-b md:border-b-0 md:border-r border-slate-100 p-6 flex flex-row md:flex-col gap-2 overflow-x-auto">
          {[
            { id: 'profile', name: 'My Profile' },
            { id: 'security', name: 'Security' },
            { id: 'team', name: 'Team Access' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`text-left px-5 py-3.5 rounded-xl text-xs font-medium uppercase tracking-widest transition-all duration-300 whitespace-nowrap cursor-pointer
                ${activeTab === tab.id ? 'bg-[#fce3de] text-slate-900 ' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 p-8 md:p-12 relative min-h-[500px]">
          
          {isPending && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-[2.5rem]">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#fa8791]"></div>
            </div>
          )}

          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in duration-500">
              <div className="mb-8">
                <h2 className="text-xl text-slate-900 font-serif">Profile Details</h2>
                <p className="text-xs text-slate-400 mt-1">Update your personal information.</p>
              </div>

              <form onSubmit={handleProfileUpdate} className="flex flex-col gap-6 max-w-md">
                <div>
                  <label className={labelStyles}>Email Address (Read-only)</label>
                  <input type="text" value={currentAdmin.email} disabled className={`${getInputStyles('email')} opacity-50 bg-slate-100 cursor-not-allowed`} />
                </div>
                <div>
                  <label className={labelStyles}>Display Name</label>
                  <input type="text" name="name" defaultValue={currentAdmin.name} className={getInputStyles('name')} />
                  <InlineError message={fieldErrors.name} />
                </div>
                <button type="submit" className="mt-4 bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-[#fa8791] transition-colors w-fit cursor-pointer shadow-lg shadow-black/10">
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: SECURITY */}
          {activeTab === 'security' && (
            <div className="animate-in fade-in duration-500">
              <div className="mb-8">
                <h2 className="text-xl text-slate-900 font-serif">Change Password</h2>
                <p className="text-xs text-slate-400 mt-1">Ensure your account uses a strong, secure password.</p>
              </div>

              <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-6 max-w-md">
                <div>
                  <label className={labelStyles}>Current Password</label>
                  <div className="relative">
                    <input type={showCurrentPwd ? "text" : "password"} name="currentPassword" placeholder="Enter current password" className={`${getInputStyles('currentPassword')} pr-12`} />
                    <button type="button" onClick={() => setShowCurrentPwd(!showCurrentPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 cursor-pointer outline-none">
                      <EyeIcon isVisible={showCurrentPwd} />
                    </button>
                  </div>
                  <InlineError message={fieldErrors.currentPassword} />
                </div>
                <div className="h-[1px] bg-slate-100 my-2"></div>
                <div>
                  <label className={labelStyles}>New Password</label>
                  <div className="relative">
                    <input type={showNewPwd ? "text" : "password"} name="password" placeholder="Enter new password" className={`${getInputStyles('password')} pr-12`} />
                    <button type="button" onClick={() => setShowNewPwd(!showNewPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 cursor-pointer outline-none">
                      <EyeIcon isVisible={showNewPwd} />
                    </button>
                  </div>
                  <InlineError message={fieldErrors.password} />
                </div>
                <div>
                  <label className={labelStyles}>Confirm New Password</label>
                  <div className="relative">
                    <input type={showConfirmPwd ? "text" : "password"} name="confirm" placeholder="Repeat new password" className={`${getInputStyles('confirm')} pr-12`} />
                    <button type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 cursor-pointer outline-none">
                      <EyeIcon isVisible={showConfirmPwd} />
                    </button>
                  </div>
                  <InlineError message={fieldErrors.confirm} />
                </div>
                <button type="submit" className="mt-4 bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-[#fa8791] transition-colors w-fit cursor-pointer shadow-lg shadow-black/10">
                  Update Password
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: TEAM ACCESS (SUPERADMIN) */}
          {activeTab === 'team' && (
            <div className="animate-in fade-in duration-500">
              <div className="mb-8">
                <h2 className="text-xl text-slate-900 font-serif">Team Management</h2>
                <p className="text-xs text-slate-400 mt-1">Manage who has access to your boutique's dashboard.</p>
              </div>

              {/* LIST EXISTING ADMINS */}
              <div className="mb-10">
                <h3 className={labelStyles}>Active Administrators</h3>
                <div className="flex flex-col gap-2 mt-4">
                  {adminsList.map(admin => (
                    <div key={admin.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-[#fdfaf9]">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold uppercase tracking-widest">
                          {admin.name.substring(0, 2)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-900">
                            {admin.name} {admin.id === currentAdmin.id && <span className="ml-2 text-[9px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full uppercase tracking-widest">You</span>}
                          </span>
                          <span className="text-[11px] text-slate-400">{admin.email}</span>
                        </div>
                      </div>
                      
                      {admin.id !== currentAdmin.id && (
                        <button 
                          onClick={() => handleDeleteAdmin(admin.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title="Revoke Access"
                        >
                          <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className={labelStyles}>Add New SuperAdmin</h3>
                <div className="bg-white border border-[#fce3de]/50 p-6 rounded-3xl mt-4 shadow-sm">
                  <form onSubmit={handleAddAdmin} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelStyles}>Full Name</label>
                        <input type="text" name="name" placeholder="e.g. Jane Doe" className={getInputStyles('name')} />
                        <InlineError message={fieldErrors.name} />
                      </div>
                      <div>
                        <label className={labelStyles}>Email Address</label>
                        <input type="text" name="email" placeholder="admin@asayamaison.com" className={getInputStyles('email')} />
                        <InlineError message={fieldErrors.email} />
                      </div>
                    </div>
                    <div>
                      <label className={labelStyles}>Temporary Password</label>
                      <div className="relative">
                        <input type={showTeamPwd ? "text" : "password"} name="password" placeholder="e.g. Asaya2026!" className={`${getInputStyles('password')} pr-12`} />
                        <button type="button" onClick={() => setShowTeamPwd(!showTeamPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 cursor-pointer outline-none">
                          <EyeIcon isVisible={showTeamPwd} />
                        </button>
                      </div>
                      <InlineError message={fieldErrors.password} />
                      <p className="text-[10px] text-slate-400 mt-2 italic ml-2">They can change this password after logging in.</p>
                    </div>
                    
                    <button type="submit" className="mt-2 bg-[#1a1a1a] text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer shadow-lg shadow-black/10">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                      Create Admin Account
                    </button>
                  </form>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}