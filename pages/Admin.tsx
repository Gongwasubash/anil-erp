
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  UserPlus, 
  Settings2, 
  Activity,
  UserCheck,
  UserMinus,
  Key,
  Globe,
  Save,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { User } from '../types';
import { getApiUrl, setApiUrl } from '../services/api';

const Admin: React.FC<{ user: User }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'logs' | 'config'>('users');
  const [apiUrl, setApiUrlState] = useState(getApiUrl());
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  const handleSaveConfig = () => {
    setSaveStatus('saving');
    setApiUrl(apiUrl);
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 800);
  };

  const mockUsers = [
    { id: '1', name: 'Super Admin', role: 'Super Admin', status: 'Active' },
    { id: '2', name: 'Binod Accountant', role: 'Accountant', status: 'Active' },
    { id: '3', name: 'Sunita Teacher', role: 'Teacher', status: 'Active' },
    { id: '4', name: 'Disabled User', role: 'Admin', status: 'Inactive' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Control Center</h1>
          <p className="text-gray-500">Manage users, permissions, and audit logs.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
          <UserPlus size={20} />
          Create New User
        </button>
      </div>

      <div className="flex gap-4 border-b">
         {['users', 'logs', 'config'].map((tab) => (
           <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
           >
             {tab === 'config' ? 'System Config' : tab}
           </button>
         ))}
      </div>

      {activeTab === 'users' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {mockUsers.map((u) => (
             <div key={u.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                   <div className={`p-3 rounded-xl ${u.role === 'Super Admin' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                      <ShieldCheck size={24} />
                   </div>
                   <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${u.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {u.status}
                   </span>
                </div>
                <h3 className="font-bold text-gray-900">{u.name}</h3>
                <p className="text-xs text-gray-500 font-medium mb-6">{u.role}</p>
                <div className="flex gap-2">
                   <button className="flex-1 py-2 bg-gray-50 text-gray-700 text-xs font-bold rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-center gap-1">
                      <Settings2 size={14} /> Edit
                   </button>
                   <button className="flex-1 py-2 bg-gray-50 text-gray-700 text-xs font-bold rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center justify-center gap-1">
                      <Key size={14} /> Reset
                   </button>
                   {u.status === 'Active' ? (
                     <button className="p-2 bg-gray-50 text-gray-400 hover:text-red-600 rounded-lg">
                       <UserMinus size={18} />
                     </button>
                   ) : (
                     <button className="p-2 bg-gray-50 text-gray-400 hover:text-green-600 rounded-lg">
                       <UserCheck size={18} />
                     </button>
                   )}
                </div>
             </div>
           ))}
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
           <div className="p-6 border-b flex items-center justify-between">
              <h3 className="font-bold text-gray-900">System Audit Logs</h3>
              <button className="text-xs font-bold text-blue-600 hover:underline">Download CSV</button>
           </div>
           <div className="divide-y divide-gray-100">
              {[
                { user: 'Super Admin', action: 'Created new student admission', target: 'Ram Kumar', time: '10:45 AM today' },
                { user: 'Accountant', action: 'Collected fee payment', target: 'INV-2080-045', time: '09:30 AM today' },
                { user: 'Teacher', action: 'Updated marks for Science', target: 'Grade 10', time: 'Yesterday' },
              ].map((log, i) => (
                <div key={i} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                   <div className="p-2 bg-gray-100 rounded-lg text-gray-400">
                      <Activity size={18} />
                   </div>
                   <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900">
                        <span className="text-blue-600">{log.user}</span> {log.action}
                      </p>
                      <p className="text-xs text-gray-500">Target: {log.target}</p>
                   </div>
                   <span className="text-xs text-gray-400 whitespace-nowrap font-medium">{log.time}</span>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'config' && (
        <div className="max-w-2xl mx-auto space-y-6">
           <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-4 mb-2">
                 <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <Globe size={24} />
                 </div>
                 <div>
                    <h3 className="text-lg font-bold text-gray-900">Backend Connection</h3>
                    <p className="text-sm text-gray-500">Connect your Google Apps Script Web App URL.</p>
                 </div>
              </div>

              {!apiUrl && (
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3 text-amber-700 text-sm">
                   <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                   <div>
                      <p className="font-bold">System in Demo Mode</p>
                      <p className="mt-1 opacity-80">Paste your Google Apps Script URL below to enable real database functionality.</p>
                   </div>
                </div>
              )}

              <div className="space-y-2">
                 <label className="text-sm font-bold text-gray-700 ml-1">Apps Script Web App URL</label>
                 <input 
                    type="text" 
                    value={apiUrl}
                    onChange={(e) => setApiUrlState(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-medium text-sm outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all"
                 />
                 <p className="text-[10px] text-gray-400 ml-1 font-medium">
                   Enter the deployment URL from your Apps Script project. Ensure access is set to "Anyone".
                 </p>
              </div>

              <button 
                onClick={handleSaveConfig}
                disabled={saveStatus === 'saving'}
                className={`
                  w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all
                  ${saveStatus === 'success' 
                    ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' 
                    : 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98]'}
                `}
              >
                {saveStatus === 'saving' ? (
                  <Activity className="animate-spin" size={20} />
                ) : saveStatus === 'success' ? (
                  <>
                    <CheckCircle size={20} />
                    Configuration Saved
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Configuration
                  </>
                )}
              </button>
           </div>

           <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl shadow-blue-600/20">
              <h4 className="font-bold text-lg mb-4">Setup Instructions</h4>
              <ul className="space-y-4 text-sm font-medium opacity-90">
                 <li className="flex gap-3">
                    <span className="w-6 h-6 shrink-0 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <p>Open your Spreadsheet and go to <strong>Extensions &gt; Apps Script</strong>.</p>
                 </li>
                 <li className="flex gap-3">
                    <span className="w-6 h-6 shrink-0 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <p>Paste the <code>backend.gs</code> code and run the <code>setup</code> function once.</p>
                 </li>
                 <li className="flex gap-3">
                    <span className="w-6 h-6 shrink-0 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <p>Click <strong>Deploy &gt; New Deployment</strong>. Choose "Web App", Execute as "Me", Access: "Anyone".</p>
                 </li>
                 <li className="flex gap-3">
                    <span className="w-6 h-6 shrink-0 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                    <p>Copy the resulting URL and paste it into the field above.</p>
                 </li>
              </ul>
           </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
