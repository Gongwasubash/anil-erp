
import React, { useState, useEffect } from 'react';
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
  Cog,
  Building,
  UserCheck,
  Globe,
  Heart,
  Briefcase,
  Award,
  UserPlus
} from 'lucide-react';
import { User } from '../types';
import { COLORS } from '../constants';
import { supabaseService } from '../lib/supabase';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['fees&billing', 'feemaster', 'masters']);
  const [schoolData, setSchoolData] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    fetchSchoolData();
  }, []);

  const fetchSchoolData = async () => {
    try {
      const { data, error } = await supabaseService.supabase
        .from('schools')
        .select('*')
        .limit(1)
        .single();
      
      if (error) throw error;
      setSchoolData(data);
    } catch (e) {
      console.error('Error fetching school data:', e);
    }
  };

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
        { 
          name: 'Fee Details', 
          icon: Receipt,
          subItems: [
            { name: 'Due Student Fee', path: '/fees/due_student_fee', icon: Users },
            { name: 'Student Fee Submit', path: '/fees/student_fee_submit', icon: CreditCard },
            { name: 'View Student Fee Details', path: '/fees/view_student_fee_details', icon: BookOpen },
            { name: 'Daily Fee Receipt Register', path: '/fees/daily_fee_receipt_register', icon: Receipt }
          ]
        }
      ]
    },
    { 
      name: 'Variable Fee Details', 
      path: '/variable-fees', 
      icon: Settings, 
      roles: ['Super Admin', 'Admin', 'Accountant'],
      subItems: [
        { name: 'Fee Head', path: '/variable-fees/fee_head', icon: Tag },
        { name: 'Manage Bill Header', path: '/variable-fees/manage_bill_header', icon: BookOpen },
        { name: 'Add Start Bill No', path: '/variable-fees/add_start_bill_no', icon: Receipt },
        { name: 'Add Student Variable Fee', path: '/variable-fees/add_student_variable_fee', icon: Users },
        { name: 'Print Pre Bill', path: '/variable-fees/print_pre_bill', icon: CreditCard },
        { name: 'Export/Import Due Amount', path: '/variable-fees/export_import_due_amount', icon: BookOpen },
        { name: 'Fee Submit', path: '/variable-fees/fee_submit', icon: CreditCard },
        { name: 'Daily Fee Receipt Register', path: '/variable-fees/daily_fee_receipt_register', icon: Receipt },
        { name: 'Student Fee Ledger', path: '/variable-fees/student_fee_ledger', icon: BookOpen }
      ]
    },
    { 
      name: 'Exams & Result', 
      path: '/exams', 
      icon: GraduationCap, 
      roles: ['Super Admin', 'Admin', 'Teacher', 'Student'],
      subItems: [
        { name: 'Manage Grade', path: '/exams/manage_grade', icon: Tag },
        { name: 'Personal Description', path: '/exams/personal_description', icon: BookOpen },
        { name: 'Show in Result', path: '/exams/show_in_result', icon: Settings },
        { name: 'Assign Subject to Teachers', path: '/exams/assign_subject_teachers', icon: Users },
        { name: 'Exam Type', path: '/exams/exam_type', icon: Tag },
        { name: 'Exam Name', path: '/exams/exam_name', icon: BookOpen },
        { name: 'Add Exam Marks', path: '/exams/add_exam_marks', icon: Percent },
        { name: 'Print Admit Card', path: '/exams/print_admit_card', icon: CreditCard },
        { name: 'Add Students Marks', path: '/exams/add_students_marks', icon: Percent },
        { name: 'Add Personal Description', path: '/exams/add_personal_description', icon: BookOpen },
        { name: 'Add Personal Description Teachers', path: '/exams/add_personal_description_teachers', icon: Users },
        { name: 'Add Working/Present Days', path: '/exams/add_working_present_days', icon: Calendar },
        { name: 'View Students Marks', path: '/exams/view_students_marks', icon: BookOpen },
        { name: 'Term Exam Name', path: '/exams/term_exam_name', icon: Tag },
        { name: 'View Students Term Marks', path: '/exams/view_students_term_marks', icon: BookOpen },
        { name: 'View Students Annual Marks', path: '/exams/view_students_annual_marks', icon: BookOpen },
        { name: 'Send Result via SMS', path: '/exams/send_result_sms', icon: Settings },
        { name: 'Publish Students Results', path: '/exams/publish_students_results', icon: Settings },
        { name: 'Publish Annual Results', path: '/exams/publish_annual_results', icon: Settings }
      ]
    },
    { 
      name: 'Masters', 
      path: '/masters', 
      icon: Settings, 
      roles: ['Super Admin', 'Admin'],
      subItems: [
        { name: 'Manage Branch', path: '/masters/manage_branch', icon: Building },
        { name: 'Manage School', path: '/masters/manage_school', icon: School },
        { name: 'Add Batch', path: '/masters/add_batch', icon: Tag },
        { name: 'Add Class', path: '/masters/add_class', icon: BookOpen },
        { name: 'Add Section', path: '/masters/add_section', icon: Tag },
        { name: 'Manage Class', path: '/masters/manage_class', icon: BookOpen },
        { name: 'Manage Section', path: '/masters/manage_section', icon: Tag },
        { name: 'Manage Religion', path: '/masters/manage_religion', icon: Heart },
        { name: 'Manage Nationality', path: '/masters/manage_nationality', icon: Globe },
        { name: 'Manage Student Cast', path: '/masters/manage_student_cast', icon: Users },
        { name: 'Subject Masters', path: '/masters/subject_masters', icon: BookOpen, 
          subItems: [
            { name: 'Add Subject', path: '/masters/subject_masters/add_subject', icon: BookOpen },
            { name: 'Manage Subject', path: '/masters/subject_masters/manage_subject', icon: Settings },
            { name: 'Manage Subject to Student', path: '/masters/subject_masters/manage_subject_to_student', icon: Users }
          ]
        },
        { name: 'Manage Calendar', path: '/masters/manage_calendar', icon: Calendar },
        { name: 'Manage SMS Template', path: '/masters/manage_sms_template', icon: Settings },
        { name: 'Manage Blood Group', path: '/masters/manage_blood_group', icon: Heart },
        { name: 'Manage Department', path: '/masters/manage_department', icon: Briefcase },
        { name: 'Manage Designation', path: '/masters/manage_designation', icon: Award },
        { name: 'Class/Subjects Teacher', path: '/masters/class_subjects_teacher', icon: UserCheck }
      ]
    },
    { 
      name: 'Human Resources', 
      path: '/hr', 
      icon: UserPlus, 
      roles: ['Super Admin', 'Admin'],
      subItems: [
        { name: 'Manage Employee', path: '/hr/manage_employee', icon: Users }
      ]
    },
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
            <div className="flex items-center justify-center">
              {schoolData?.logo_url ? (
                <img src={schoolData.logo_url} alt="School Logo" className="w-8 h-8 object-contain" />
              ) : (
                <div className="p-2 bg-blue-600 rounded-lg text-white">
                  <School size={20} />
                </div>
              )}
            </div>
            <div>
              <h1 className="font-bold text-gray-800 tracking-tight">
                {schoolData?.school_name || 'EVEREST'}
              </h1>
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
                            : [menuKey]
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
                        <span className="text-sm">{item.name}</span>
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
                                      : [subMenuKey]
                                  );
                                }}
                                className="w-full flex items-center justify-between px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
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
                                          flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all duration-200
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
                                flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all duration-200
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
