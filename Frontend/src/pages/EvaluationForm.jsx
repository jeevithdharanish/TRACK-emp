import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { evaluationAPI } from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft } from 'react-icons/hi';

export default function EvaluationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    employeeId: '',
    evaluatorId: '',
    evaluationDate: new Date().toISOString().split('T')[0],
    newGainPoint: 0,
    note: '',
  });

  useEffect(() => {
    if (isEditing) {
      evaluationAPI.getById(id).then((res) => {
        const ev = res.data;
        setForm({
          employeeId: ev.employeeId || '',
          evaluatorId: ev.evaluatorId || '',
          evaluationDate: ev.evaluationDate || '',
          newGainPoint: ev.newGainPoint || 0,
          note: ev.note || '',
        });
      }).catch(() => toast.error('Failed to load evaluation'));
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === 'number' ? Number(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.note.length < 10) {
      toast.error('Note must be at least 10 characters');
      return;
    }
    setSubmitting(true);
    try {
      if (isEditing) {
        await evaluationAPI.update(id, {
          evaluationDate: form.evaluationDate,
          newGainPoint: form.newGainPoint,
          note: form.note,
        });
        toast.success('Evaluation updated');
      } else {
        await evaluationAPI.create(form);
        toast.success('Evaluation created');
      }
      navigate('/evaluations');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/evaluations" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
          <HiOutlineArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Evaluation' : 'New Evaluation'}</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
                <input name="employeeId" required value={form.employeeId} onChange={handleChange}
                  placeholder="Employee UUID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Evaluator ID *</label>
                <input name="evaluatorId" required value={form.evaluatorId} onChange={handleChange}
                  placeholder="Evaluator UUID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Evaluation Date *</label>
              <input type="date" name="evaluationDate" required value={form.evaluationDate} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Points Gained *</label>
              <input type="number" name="newGainPoint" required min="0" value={form.newGainPoint} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes * <span className="text-gray-400">(min 10 chars)</span></label>
            <textarea name="note" required rows={4} value={form.note} onChange={handleChange}
              placeholder="Write evaluation notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none" />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button type="submit" disabled={submitting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition disabled:opacity-50 cursor-pointer">
              {submitting ? 'Saving...' : isEditing ? 'Update Evaluation' : 'Create Evaluation'}
            </button>
            <Link to="/evaluations"
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
