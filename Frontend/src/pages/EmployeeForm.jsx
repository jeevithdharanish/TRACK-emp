import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { employeeAPI } from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft } from 'react-icons/hi';

const GENDERS = ['MALE', 'FEMALE', 'NOT_ANSWER'];
const LEVELS = ['JUNIOR', 'MIDDLE', 'SENIOR'];
const EDUCATION = ['NONE', 'PRIMARY', 'BACHELOR', 'MASTER', 'DOCTORATE'];

export default function EmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    cnp: '',
    generalLevel: 'JUNIOR',
    address: '',
    gender: 'NOT_ANSWER',
    educationalStage: 'NONE',
    birthDate: '',
    startWorkDate: '',
    endWorkDate: '',
    departmentId: '',
    companyId: '',
    positionId: '',
  });

  useEffect(() => {
    if (isEditing) {
      employeeAPI.getById(id).then((res) => {
        const emp = res.data;
        setForm({
          firstName: emp.firstName || '',
          middleName: emp.middleName || '',
          lastName: emp.lastName || '',
          cnp: emp.cnp || '',
          generalLevel: emp.generalLevel || 'JUNIOR',
          address: emp.address || '',
          gender: emp.gender || 'NOT_ANSWER',
          educationalStage: emp.educationalStage || 'NONE',
          birthDate: emp.birthDate || '',
          startWorkDate: emp.startWorkDate || '',
          endWorkDate: emp.endWorkDate || '',
          departmentId: '',
          companyId: '',
          positionId: '',
        });
      }).catch(() => toast.error('Failed to load employee'));
    }
  }, [id, isEditing]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditing) {
        await employeeAPI.update(id, {
          address: form.address,
          generalLevel: form.generalLevel,
          educationalStage: form.educationalStage,
          endWorkDate: form.endWorkDate || null,
          positionId: form.positionId || null,
          departmentId: form.departmentId || null,
        });
        toast.success('Employee updated');
      } else {
        await employeeAPI.create(form);
        toast.success('Employee created');
      }
      navigate('/employees');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/employees" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
          <HiOutlineArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Employee' : 'Add Employee'}</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input name="firstName" required value={form.firstName} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                <input name="middleName" value={form.middleName} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input name="lastName" required value={form.lastName} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
            </div>
          )}

          {!isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CNP *</label>
                <input name="cnp" required value={form.cnp} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                  {GENDERS.map((g) => <option key={g} value={g}>{g.replace('_', ' ')}</option>)}
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">General Level</label>
              <select name="generalLevel" value={form.generalLevel} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
              <select name="educationalStage" value={form.educationalStage} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                {EDUCATION.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input name="address" value={form.address} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
          </div>

          {!isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Work Date *</label>
                <input type="date" name="startWorkDate" required value={form.startWorkDate} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
            </div>
          )}

          {isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Work Date</label>
              <input type="date" name="endWorkDate" value={form.endWorkDate} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
          )}

          {!isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department ID</label>
                <input name="departmentId" value={form.departmentId} onChange={handleChange} placeholder="UUID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company ID</label>
                <input name="companyId" value={form.companyId} onChange={handleChange} placeholder="UUID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position ID</label>
                <input name="positionId" value={form.positionId} onChange={handleChange} placeholder="UUID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button type="submit" disabled={submitting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition disabled:opacity-50 cursor-pointer">
              {submitting ? 'Saving...' : isEditing ? 'Update Employee' : 'Create Employee'}
            </button>
            <Link to="/employees"
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
