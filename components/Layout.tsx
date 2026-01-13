
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Receipt, 
  GraduationCap, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  School,
  ChevronDown,
  ChevronRight,
  Calendar,
  BookOpen,
  Tag,
  Percent,
  CreditCard,
  Cog
} from 'lucide-react';
import { User } from '../types';
import { COLORS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['fees&billing', 'feemaster']);
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['Super Admin', 'Admin', 'Accountant', 'Teacher', 'Student'] },
    { name: 'Students', path: '/students', icon: Users, roles: ['Super Admin', 'Admin', 'Teacher'] },
    { 
      name: 'Fees & Billing', 
      path: '/fees', 
      icon: Receipt, 
      roles: ['Super Admin', 'Admin', 'Accountant'],
      subItems: [
        { 
          name: 'Fee Master', 
          icon: CreditCard,
          subItems: [
            { name: 'Financial Year', path: '/fees/fin_year', icon: Calendar },
            { name: 'Fee Book', path: '/fees/fee_book', icon: BookOpen },
            { name: 'Fee Head', path: '/fees/fee_head', icon: Tag },
            { name: 'Fee Category', path: '/fees/fee_category', icon: Tag },
            { name: 'Education Tax', path: '/fees/edu_tax', icon: Percent },
            { name: 'Month Master', path: '/fees/month_master', icon: Calendar }
          ]
        },
        { 
          name: 'Fee Management', 
          icon: Cog,
          subItems: [
            { name: 'Fee Month', path: '/fees/fee_month', icon: Calendar },
            { name: 'Fee Structure', path: '/fees/fee_structure', icon: BookOpen },
            { name: 'Fee Submit Date', path: '/fees/fee_submit_date', icon: Calendar },
            { name: 'Fine', path: '/fees/fine', icon: Percent }
          ]
        },
        { name: 'Student Fee Submit', path: '/fees/submit', icon: Receipt }
      ]
    },
    { name: 'Exams & Result', path: '/exams', icon: GraduationCap, roles: ['Super Admin', 'Admin', 'Teacher', 'Student'] },
    { name: 'Admin Control', path: '/admin', icon: Settings, roles: ['Super Admin'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar Mobile Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-white rounded-md shadow-md"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        no-print
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center gap-3 border-b">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <School size={24} />
            </div>
            <div>
              <h1 className="font-bold text-gray-800 tracking-tight">EVEREST</h1>
              <p className="text-xs text-gray-500 font-medium uppercase">School ERP</p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {filteredMenu.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExpanded = expandedMenus.includes(item.name.toLowerCase().replace(/\s+/g, ''));
              
              return (
                <div key={item.name}>
                  {hasSubItems ? (
                    <button
                      onClick={() => {
                        const menuKey = item.name.toLowerCase().replace(/\s+/g, '');
                        setExpandedMenus(prev => 
                          prev.includes(menuKey) 
                            ? prev.filter(m => m !== menuKey)
                            : [...prev, menuKey]
                        );
                      }}
                      className={`
                        w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
                        ${isActive 
                          ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={20} />
                        <span>{item.name}</span>
                      </div>
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                        ${isActive 
                          ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                      `}
                    >
                      <Icon size={20} />
                      <span>{item.name}</span>
                    </Link>
                  )}
                  
                  {hasSubItems && isExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <div key={subItem.name}>
                          {subItem.subItems ? (
                            <div>
                              <button
                                onClick={() => {
                                  const subMenuKey = subItem.name.toLowerCase().replace(/\s+/g, '');
                                  setExpandedMenus(prev => 
                                    prev.includes(subMenuKey) 
                                      ? prev.filter(m => m !== subMenuKey)
                                      : [...prev, subMenuKey]
                                  );
                                }}
                                className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
                              >
                                <div className="flex items-center gap-2">
                                  {subItem.icon && <subItem.icon size={16} />}
                                  {subItem.name}
                                </div>
                                {expandedMenus.includes(subItem.name.toLowerCase().replace(/\s+/g, '')) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                              </button>
                              {expandedMenus.includes(subItem.name.toLowerCase().replace(/\s+/g, '')) && (
                                <div className="ml-6 mt-1 space-y-1">
                                  {subItem.subItems.map((subSubItem) => {
                                    const isSubActive = location.pathname === subSubItem.path;
                                    const SubIcon = subSubItem.icon;
                                    return (
                                      <Link
                                        key={subSubItem.name}
                                        to={subSubItem.path}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`
                                          flex items-center gap-2 px-4 py-2 text-xs rounded-lg transition-all duration-200
                                          ${isSubActive 
                                            ? 'bg-blue-100 text-blue-700 font-bold' 
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                                        `}
                                      >
                                        {SubIcon && <SubIcon size={14} />}
                                        {subSubItem.name}
                                      </Link>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          ) : (
                            <Link
                              to={subItem.path}
                              onClick={() => setIsSidebarOpen(false)}
                              className={`
                                flex items-center gap-2 px-4 py-2 text-xs rounded-lg transition-all duration-200
                                ${location.pathname === subItem.path 
                                  ? 'bg-blue-100 text-blue-700 font-bold' 
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                              `}
                            >
                              {subItem.icon && <subItem.icon size={14} />}
                              {subItem.name}
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="p-4 border-t bg-gray-50/50">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm">
                {user.username[0].toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-gray-900 truncate">{user.username}</p>
                <p className="text-xs text-gray-500 truncate">{user.role}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all shadow-sm"
            >
              <LogOut size={18} />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
