
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { User } from '../types';
import { formatCurrency } from '../constants';
import { supabaseService } from '../lib/supabase';

const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  const [schoolData, setSchoolData] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    monthlyCollection: 0,
    pendingFees: 0,
    totalExpenses: 0
  });

  useEffect(() => {
    fetchSchoolData();
    fetchDashboardStats();
    fetchChartData();
  }, []);

  const fetchSchoolData = async () => {
    try {
      if (user.role === 'Super Admin') {
        setSchoolData({ school_name: 'System Admin' });
        return;
      }
      if (!user.school_id) {
        setSchoolData(null);
        return;
      }
      const { data, error } = await supabaseService.supabase
        .from('schools')
        .select('*')
        .eq('id', user.school_id)
        .single();
      
      if (error) throw error;
      setSchoolData(data);
    } catch (e) {
      console.error('Error fetching school data:', e);
    }
  };

  const fetchChartData = async () => {
    try {
      if (!user.school_id) {
        setChartData([]);
        return;
      }

      // Fetch current year data
      const currentYear = new Date().getFullYear();
      const startOfYear = `${currentYear}-01-01`;
      const endOfYear = `${currentYear}-12-31`;

      const { data: payments } = await supabaseService.supabase
        .from('fee_payments')
        .select('amount, created_at')
        .eq('school_id', user.school_id)
        .gte('created_at', startOfYear)
        .lte('created_at', endOfYear);

      const { data: expenses } = await supabaseService.supabase
        .from('expenses')
        .select('amount, created_at')
        .eq('school_id', user.school_id)
        .gte('created_at', startOfYear)
        .lte('created_at', endOfYear);

      // Group by month
      const monthlyData: { [key: string]: { collection: number; expenses: number } } = {};
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      // Initialize all 12 months
      months.forEach(month => {
        monthlyData[month] = { collection: 0, expenses: 0 };
      });

      // Aggregate payments
      payments?.forEach(payment => {
        const date = new Date(payment.created_at);
        const monthKey = months[date.getMonth()];
        monthlyData[monthKey].collection += parseFloat(payment.amount || '0');
      });

      // Aggregate expenses
      expenses?.forEach(expense => {
        const date = new Date(expense.created_at);
        const monthKey = months[date.getMonth()];
        monthlyData[monthKey].expenses += parseFloat(expense.amount || '0');
      });

      // Convert to chart format
      const chartData = months.map(month => ({
        name: month,
        collection: monthlyData[month].collection,
        expenses: monthlyData[month].expenses
      }));

      setChartData(chartData);
    } catch (e) {
      console.error('Error fetching chart data:', e);
      setChartData([]);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      if (user.role === 'Super Admin' || !user.school_id) {
        setStats({ totalStudents: 0, monthlyCollection: 0, pendingFees: 0, totalExpenses: 0 });
        return;
      }
      
      // Fetch total students for this school
      const { data: students, error: studentsError } = await supabaseService.supabase
        .from('students')
        .select('id', { count: 'exact' })
        .eq('school_id', user.school_id);
      
      // Fetch monthly collection from fee_payments for this school
      const currentMonth = new Date().toISOString().slice(0, 7);
      const { data: payments, error: paymentsError } = await supabaseService.supabase
        .from('fee_payments')
        .select('amount')
        .eq('school_id', user.school_id)
        .gte('created_at', currentMonth + '-01')
        .lt('created_at', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString());
      
      // Fetch pending fees for this school
      const { data: pending, error: pendingError } = await supabaseService.supabase
        .from('fee_payments')
        .select('remaining_amount')
        .eq('school_id', user.school_id)
        .gt('remaining_amount', 0);
      
      // Fetch monthly expenses for this school
      const { data: expenses, error: expensesError } = await supabaseService.supabase
        .from('expenses')
        .select('amount')
        .eq('school_id', user.school_id)
        .gte('created_at', currentMonth + '-01')
        .lt('created_at', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString());
      
      const monthlyCollection = payments?.reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0) || 0;
      const pendingFees = pending?.reduce((sum, p) => sum + parseFloat(p.remaining_amount || '0'), 0) || 0;
      const totalExpenses = expenses?.reduce((sum, e) => sum + parseFloat(e.amount || '0'), 0) || 0;
      
      setStats({
        totalStudents: students?.length || 0,
        monthlyCollection,
        pendingFees,
        totalExpenses
      });
    } catch (e) {
      console.error('Error fetching dashboard stats:', e);
    }
  };
  const statsData = [
    { title: 'Total Students', value: stats.totalStudents.toString(), icon: Users, color: 'blue', change: '+12%' },
    { title: 'Monthly Collection', value: formatCurrency(stats.monthlyCollection), icon: CreditCard, color: 'green', change: '+8.5%' },
    { title: 'Pending Fees', value: formatCurrency(stats.pendingFees), icon: AlertCircle, color: 'red', change: '-2.4%' },
    { title: 'Total Expenses', value: formatCurrency(stats.totalExpenses), icon: TrendingUp, color: 'orange', change: '+15%' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to {schoolData?.school_name || 'School'}, {user.username}!</h1>
          <p className="text-gray-500">Here's an overview of the school performance today.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm">
            Export Report
          </button>
          <button className="px-4 py-2 bg-blue-600 rounded-xl text-sm font-semibold text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20">
            Generate Bills
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-xs font-bold flex items-center gap-0.5 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
                {stat.change.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Income vs Expenses</h2>
            <select className="text-sm border-none bg-gray-50 rounded-lg px-3 py-1 font-medium text-gray-600 focus:ring-0 cursor-pointer">
              <option>Current Year ({new Date().getFullYear()})</option>
              <option>Last Year ({new Date().getFullYear() - 1})</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.length > 0 ? chartData : [{ name: 'No Data', collection: 0, expenses: 0 }]}>
                <defs>
                  <linearGradient id="colorColl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                />
                <Area type="monotone" dataKey="collection" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorColl)" />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activities</h2>
          <div className="space-y-6">
            {[
              { type: 'payment', desc: 'Fee collected from Ram Kumar', time: '5 mins ago', amount: 'Rs. 12,000' },
              { type: 'expense', desc: 'Electricity bill paid', time: '2 hours ago', amount: 'Rs. 8,500' },
              { type: 'admission', desc: 'New admission: Sita Thapa', time: '5 hours ago', amount: 'Grade 8' },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'payment' ? 'bg-green-500' : 
                  activity.type === 'expense' ? 'bg-red-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{activity.desc}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-400">{activity.time}</span>
                    <span className="text-xs font-bold text-gray-600">{activity.amount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-2 text-sm font-semibold text-blue-600 border border-blue-50 bg-blue-50/50 rounded-xl hover:bg-blue-100 transition-colors">
            View All Audit Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
