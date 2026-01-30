
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
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [schoolData, setSchoolData] = useState<any>(null);
  const location = useLocation();

  console.log('Layout user data:', user);
  console.log('User assigned_modules:', user.assigned_modules);

  useEffect(() => {
    fetchSchoolData();
    
    // Listen for school creation events
    const handleSchoolCreated = () => {
      fetchSchoolData();
    };
    
    window.addEventListener('schoolCreated', handleSchoolCreated);
    return () => window.removeEventListener('schoolCreated', handleSchoolCreated);
  }, []);

  const fetchSchoolData = async () => {
    try {
      // If user has school_id, fetch that specific school
      if (user.school_id) {
        const { data, error } = await supabaseService.supabase
          .from('schools')
          .select('*')
          .eq('id', user.school_id)
          .single();
        
        if (error) throw error;
        setSchoolData(data);
      } else {
        // For users without school_id, don't show any school data
        setSchoolData(null);
      }
    } catch (e) {
      console.error('Error fetching school data:', e);
      setSchoolData(null);
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
      roles: ['Super Admin', 'Admin', 'Accountant', 'Teacher'],
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
        { name: 'Manage Employee Type', path: '/masters/manage_employee_type', icon: Users },
        { name: 'Class/Subjects Teacher', path: '/masters/class_subjects_teacher', icon: UserCheck }
      ]
    },
    { 
      name: 'Human Resources', 
      path: '/hr', 
      icon: UserPlus, 
      roles: ['Super Admin', 'Admin'],
      subItems: [
        { name: 'Manage Employee', path: '/hr/manage_employee', icon: Users },
        { name: 'Add Employee', path: '/hr/add_employee', icon: UserPlus }
      ]
    },
    { 
      name: 'Admin Control', 
      path: '/admin', 
      icon: Settings, 
      roles: ['Super Admin', 'Admin'],
      subItems: [
        { name: 'Assign Modules', path: '/admin/assign_modules', icon: Cog },
        { name: 'Change Password', path: '/admin/change_password', icon: Settings }
      ]
    },
  ];

  // Auto-expand only the active main menu and nested dropdown on page load
  useEffect(() => {
    const currentPath = location.pathname;
    const menusToExpand: string[] = [];
    
    // Don't expand any menus for homepage or pages without submenus
    if (currentPath === '/') {
      setExpandedMenus([]);
      return;
    }
    
    // Find the active main menu
    const activeMainMenu = menuItems.find(item => 
      item.path !== '/' && (currentPath === item.path || currentPath.startsWith(item.path + '/'))
    );
    
    if (activeMainMenu && activeMainMenu.subItems) {
      const mainMenuKey = activeMainMenu.name.toLowerCase().replace(/\s+/g, '');
      menusToExpand.push(mainMenuKey);
      
      // Check if current path matches a nested dropdown item
      activeMainMenu.subItems.forEach((subItem: any) => {
        if (subItem.subItems) {
          const hasActiveChild = subItem.subItems.some((child: any) => currentPath === child.path);
          if (hasActiveChild) {
            const subMenuKey = subItem.name.toLowerCase().replace(/\s+/g, '');
            menusToExpand.push(subMenuKey);
          }
        } else if (subItem.path && currentPath === subItem.path) {
          // Direct child is active, no nested dropdown to expand
        }
      });
    }
    
    setExpandedMenus(menusToExpand);
  }, [location.pathname]);

  // Map menu paths to module IDs
  const pathToModuleMap: {[key: string]: string} = {
    '/exams/manage_grade': 'manage_grade',
    '/exams/exam_type': 'exam_type',
    '/exams/exam_name': 'exam_name',
    '/exams/add_exam_marks': 'add_exam_marks',
    '/exams/print_admit_card': 'print_admit_card',
    '/exams/add_students_marks': 'add_students_marks',
    '/exams/view_students_marks': 'view_students_marks',
    '/exams/assign_subject_teachers': 'assign_subject_teachers',
    '/students': 'manage_student',
    '/hr/manage_employee': 'manage_employee',
    '/admin/assign_modules': 'assign_modules',
    '/admin/change_password': 'change_password'
  };

  const filteredMenu = menuItems.filter(item => {
    if (!item.roles.includes(user.role)) return false;
    
    // Super Admin and Admin see everything based on role
    if (user.role === 'Super Admin' || user.role === 'Admin') return true;
    
    // For other roles, don't show Dashboard
    if (item.name === 'Dashboard') return false;
    
    // For other roles, check assigned_modules
    if (!user.assigned_modules || user.assigned_modules.length === 0) {
      return false;
    }
    
    // Filter sub-items based on assigned modules
    if (item.subItems) {
      item.subItems = item.subItems.filter((subItem: any) => {
        const moduleId = pathToModuleMap[subItem.path];
        return moduleId && user.assigned_modules?.includes(moduleId);
      });
      // Show parent menu only if it has visible sub-items
      return item.subItems.length > 0;
    }
    
    // For items without sub-items, check direct access
    const moduleId = pathToModuleMap[item.path];
    return moduleId && user.assigned_modules?.includes(moduleId);
  });

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
                {schoolData?.school_name || (user.role === 'Super Admin' ? 'School ERP' : 'EVEREST')}
              </h1>
              <p className="text-xs text-gray-500 font-medium uppercase">
                {schoolData ? 'School ERP' : (user.role === 'Super Admin' ? 'Management System' : 'School ERP')}
              </p>
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
                            ? []
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
                        <Icon size={16} />
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
                      <Icon size={16} />
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
                                  const parentMenuKey = item.name.toLowerCase().replace(/\s+/g, '');
                                  setExpandedMenus(prev => {
                                    if (prev.includes(subMenuKey)) {
                                      // Close child, keep parent
                                      return [parentMenuKey];
                                    } else {
                                      // Open child, keep parent, close other children
                                      return [parentMenuKey, subMenuKey];
                                    }
                                  });
                                }}
                                className="w-full flex items-center justify-between px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
                              >
                                <div className="flex items-center gap-2">
                                  {subItem.icon && <subItem.icon size={14} />}
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
                                        {SubIcon && <SubIcon size={12} />}
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
                              {subItem.icon && <subItem.icon size={12} />}
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
