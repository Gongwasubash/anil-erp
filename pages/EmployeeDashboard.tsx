import React from 'react';
import { User, Calendar, Clock, Award } from 'lucide-react';

const EmployeeDashboard: React.FC<{ user: any }> = ({ user }) => {
  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-3xl font-bold">
            {user.username[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.username}</h1>
            <p className="text-gray-500 text-lg mt-1">{user.role}</p>
            <div className="flex gap-4 mt-3">
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-semibold">
                {user.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <Calendar size={24} />
            </div>
            <h3 className="font-bold text-gray-900">Today's Date</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-green-50 text-green-600">
              <Clock size={24} />
            </div>
            <h3 className="font-bold text-gray-900">Current Time</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
              <Award size={24} />
            </div>
            <h3 className="font-bold text-gray-900">Your Role</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{user.role}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Assigned Modules</h2>
        {user.assigned_modules && user.assigned_modules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {user.assigned_modules.map((module: string, i: number) => (
              <div key={i} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <span className="text-sm font-semibold text-gray-700 capitalize">
                  {module.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No modules assigned yet. Contact administrator.</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
