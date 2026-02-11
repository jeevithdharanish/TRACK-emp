import { useState, useEffect } from 'react';
import { reportAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line,
} from 'recharts';
import { HiOutlineTrendingUp, HiOutlineUserGroup, HiOutlineOfficeBuilding } from 'react-icons/hi';

export default function Reports() {
  const [topPerformers, setTopPerformers] = useState([]);
  const [deptPerformance, setDeptPerformance] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [topRes, deptRes, trendRes] = await Promise.all([
        reportAPI.topPerformers(10, startDate || undefined, endDate || undefined),
        reportAPI.departmentPerformance(startDate || undefined, endDate || undefined),
        reportAPI.performanceTrends(startDate || undefined, endDate || undefined),
      ]);
      setTopPerformers(topRes.data || []);
      setDeptPerformance(deptRes.data || []);
      setTrends(
        (trendRes.data || []).map((t) => ({
          ...t,
          label: `${t.year}-${String(t.month).padStart(2, '0')}`,
        }))
      );
    } catch {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  if (loading) return <div className="p-12 text-center text-gray-500">Loading reports...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 text-sm mt-1">Performance analytics and insights</p>
        </div>
      </div>

      {/* Date filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
          </div>
          <button onClick={fetchReports}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition cursor-pointer">
            Apply Filters
          </button>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <HiOutlineUserGroup className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Top Performers</h2>
        </div>
        {topPerformers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No data available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Rank</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Employee</th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Total Score</th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Avg Efficiency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topPerformers.map((p, i) => (
                  <tr key={p.employeeId} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${
                        i === 0 ? 'bg-yellow-100 text-yellow-700' :
                        i === 1 ? 'bg-gray-100 text-gray-700' :
                        i === 2 ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-50 text-gray-500'
                      }`}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{p.employeeName}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">{p.totalScore}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-medium text-green-600">{p.averageEfficiency?.toFixed(1)}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Department Performance Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <HiOutlineOfficeBuilding className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Department Performance</h2>
          </div>
          {deptPerformance.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deptPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="departmentName" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="averageScore" fill="#6366f1" name="Avg Score" radius={[4, 4, 0, 0]} />
                <Bar dataKey="averageEfficiency" fill="#22c55e" name="Avg Efficiency %" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Performance Trends Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <HiOutlineTrendingUp className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Performance Trends</h2>
          </div>
          {trends.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="averageScore" stroke="#6366f1" name="Avg Score" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="evaluationsCount" stroke="#f59e0b" name="Evaluations" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
