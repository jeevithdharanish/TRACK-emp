import { useState, useEffect } from 'react';
import { skillLevelStageAPI } from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineX } from 'react-icons/hi';

export default function SkillLevelStages() {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStage, setEditingStage] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', points: 10 });
  const [submitting, setSubmitting] = useState(false);

  const fetchStages = async () => {
    setLoading(true);
    try {
      const res = await skillLevelStageAPI.getAll();
      setStages(res.data || []);
    } catch {
      toast.error('Failed to load skill level stages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStages(); }, []);

  const openCreate = () => {
    setEditingStage(null);
    setForm({ name: '', description: '', points: 10 });
    setShowModal(true);
  };

  const openEdit = (stage) => {
    setEditingStage(stage);
    setForm({ name: stage.name, description: stage.description || '', points: stage.points || 10 });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingStage) {
        await skillLevelStageAPI.update(editingStage.id, form);
        toast.success('Skill level stage updated');
      } else {
        await skillLevelStageAPI.create(form);
        toast.success('Skill level stage created');
      }
      setShowModal(false);
      fetchStages();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this skill level stage?')) return;
    try {
      await skillLevelStageAPI.delete(id);
      toast.success('Skill level stage deleted');
      fetchStages();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Skill Level Stages</h1>
          <p className="text-gray-500 text-sm mt-1">Define skill progression stages</p>
        </div>
        <button onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition cursor-pointer">
          <HiOutlinePlus className="w-4 h-4" />
          Add Stage
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full p-12 text-center text-gray-500">Loading...</div>
        ) : stages.length === 0 ? (
          <div className="col-span-full p-12 text-center text-gray-500">No stages found</div>
        ) : (
          stages.map((stage) => (
            <div key={stage.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{stage.description || 'No description'}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(stage)}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer">
                    <HiOutlinePencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(stage.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer">
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-full">
                  {stage.points} pts
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{editingStage ? 'Edit Stage' : 'New Stage'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description * <span className="text-gray-400">(10-50 chars)</span></label>
                <textarea required rows={3} value={form.description} minLength={10} maxLength={50}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Points * <span className="text-gray-400">(min 10)</span></label>
                <input type="number" required min={10} value={form.points}
                  onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition disabled:opacity-50 cursor-pointer">
                  {submitting ? 'Saving...' : editingStage ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
