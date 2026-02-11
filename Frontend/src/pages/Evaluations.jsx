import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { evaluationAPI } from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineFilter } from 'react-icons/hi';

export default function Evaluations() {
  const [evaluations, setEvaluations] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ employeeId: '', startDate: '', endDate: '' });
  const [showFilters, setShowFilters] = useState(false);

  const fetchEvaluations = async (p = 0) => {
    setLoading(true);
    try {
      const res = await evaluationAPI.getAll({ ...filters, page: p, size: 10 });
      setEvaluations(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setPage(p);
    } catch {
      toast.error('Failed to load evaluations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvaluations(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this evaluation?')) return;
    try {
      await evaluationAPI.delete(id);
      toast.success('Evaluation deleted');
      fetchEvaluations(page);
    } catch {
      toast.error('Failed to delete evaluation');
    }
  };

  const applyFilters = () => fetchEvaluations(0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Evaluations</h1>
          <p className="text-gray-500 text-sm mt-1">Track employee performance reviews</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition cursor-pointer"
          >
            <HiOutlineFilter className="w-4 h-4" />
            Filters
          </button>
          <Link
            to="/evaluations/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition"
          >
            <HiOutlinePlus className="w-4 h-4" />
            New Evaluation
          </Link>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Employee ID</label>
              <input
                value={filters.employeeId}
                onChange={(e) => setFilters({ ...filters, employeeId: e.target.value })}
                placeholder="UUID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
              <input type="date" value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
              <input type="date" value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
            <div className="flex items-end">
              <button onClick={applyFilters}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition cursor-pointer">
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading...</div>
        ) : evaluations.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg font-medium">No evaluations found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Employee</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Evaluator</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Gain</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Efficiency</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {evaluations.map((ev) => (
                    <tr key={ev.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-900">{ev.employeeName}</td>
                      <td className="px-6 py-4 text-gray-600">{ev.evaluatorName}</td>
                      <td className="px-6 py-4 text-gray-600">{ev.evaluationDate}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex px-2 py-0.5 text-sm font-medium rounded-full bg-green-50 text-green-700">
                          +{ev.newGainPoint}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-900">{ev.totalScore}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-sm font-medium ${ev.efficiencyProgress >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {ev.efficiencyProgress >= 0 ? '+' : ''}{ev.efficiencyProgress?.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/evaluations/${ev.id}/edit`}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                            <HiOutlinePencil className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleDelete(ev.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer">
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
                <span className="text-sm text-gray-500">Page {page + 1} of {totalPages}</span>
                <div className="flex gap-2">
                  <button onClick={() => fetchEvaluations(page - 1)} disabled={page === 0}
                    className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 cursor-pointer">
                    <HiOutlineChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => fetchEvaluations(page + 1)} disabled={page >= totalPages - 1}
                    className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 cursor-pointer">
                    <HiOutlineChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
