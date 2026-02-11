import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { employeeAPI, evaluationAPI, roleAPI, reportAPI } from '../services/api';
import { HiOutlineUserGroup, HiOutlineClipboardCheck, HiOutlineShieldCheck, HiOutlineTrendingUp, HiOutlineArrowRight } from 'react-icons/hi';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ employees: 0, evaluations: 0, roles: 0 });
  const [topPerformers, setTopPerformers] = useState([]);
  const [recentEvaluations, setRecentEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const results = await Promise.allSettled([
          employeeAPI.getAll(0, 1),
          evaluationAPI.getAll({ page: 0, size: 5 }),
          roleAPI.getAll(),
          reportAPI.topPerformers(5),
        ]);

        setStats({
          employees: results[0].status === 'fulfilled' ? results[0].value.data.totalElements || 0 : 0,
          evaluations: results[1].status === 'fulfilled' ? results[1].value.data.totalElements || 0 : 0,
          roles: results[2].status === 'fulfilled' ? results[2].value.data.length || 0 : 0,
        });

        if (results[1].status === 'fulfilled') {
          setRecentEvaluations(results[1].value.data.content || []);
        }
        if (results[3].status === 'fulfilled') {
          setTopPerformers(results[3].value.data || []);
        }
      } catch {
        // silently fail partial loads
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const statCards = [
    { label: 'Total Employees', value: stats.employees, icon: HiOutlineUserGroup, color: 'bg-blue-50 text-blue-600', link: '/employees' },
    { label: 'Evaluations', value: stats.evaluations, icon: HiOutlineClipboardCheck, color: 'bg-green-50 text-green-600', link: '/evaluations' },
    { label: 'Roles', value: stats.roles, icon: HiOutlineShieldCheck, color: 'bg-purple-50 text-purple-600', link: '/roles' },
  ];

  if (loading) return <div className="p-12 text-center text-gray-500">Loading dashboard...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
        </h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your team.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => (
          <Link key={card.label} to={card.link}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition">
              View all <HiOutlineArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HiOutlineTrendingUp className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">Top Performers</h2>
            </div>
            <Link to="/reports" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View all
            </Link>
          </div>
          {topPerformers.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No data yet</p>
          ) : (
            <div className="space-y-3">
              {topPerformers.map((p, i) => (
                <div key={p.employeeId} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                    i === 0 ? 'bg-yellow-100 text-yellow-700' :
                    i === 1 ? 'bg-gray-100 text-gray-700' :
                    i === 2 ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-50 text-gray-500'
                  }`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{p.employeeName}</p>
                    <p className="text-sm text-gray-500">Score: {p.totalScore}</p>
                  </div>
                  <span className="text-sm font-medium text-green-600">{p.averageEfficiency?.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Evaluations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HiOutlineClipboardCheck className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">Recent Evaluations</h2>
            </div>
            <Link to="/evaluations" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View all
            </Link>
          </div>
          {recentEvaluations.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No evaluations yet</p>
          ) : (
            <div className="space-y-3">
              {recentEvaluations.map((ev) => (
                <div key={ev.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm">
                    {ev.employeeName?.[0] || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{ev.employeeName}</p>
                    <p className="text-sm text-gray-500">{ev.evaluationDate}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex px-2 py-0.5 text-sm font-medium rounded-full bg-green-50 text-green-700">
                      +{ev.newGainPoint}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
