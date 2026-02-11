import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { employeeAPI } from '../services/api';
import toast from 'react-hot-toast';
import { HiOutlinePencil, HiOutlineArrowLeft, HiOutlineTrash } from 'react-icons/hi';

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    employeeAPI
      .getById(id)
      .then((res) => setEmployee(res.data))
      .catch(() => toast.error('Failed to load employee'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this employee?')) return;
    try {
      await employeeAPI.delete(id);
      toast.success('Employee deleted');
      navigate('/employees');
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Loading...</div>;
  if (!employee) return <div className="p-12 text-center text-gray-500">Employee not found</div>;

  const fields = [
    { label: 'Full Name', value: employee.fullName },
    { label: 'First Name', value: employee.firstName },
    { label: 'Middle Name', value: employee.middleName },
    { label: 'Last Name', value: employee.lastName },
    { label: 'CNP', value: employee.cnp },
    { label: 'Gender', value: employee.gender },
    { label: 'General Level', value: employee.generalLevel },
    { label: 'Education', value: employee.educationalStage },
    { label: 'Address', value: employee.address },
    { label: 'Birth Date', value: employee.birthDate },
    { label: 'Start Date', value: employee.startWorkDate },
    { label: 'End Date', value: employee.endWorkDate },
    { label: 'Department', value: employee.department },
    { label: 'Position', value: employee.position },
    { label: 'Company', value: employee.company },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/employees" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
            <HiOutlineArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{employee.fullName}</h1>
            <p className="text-gray-500 text-sm">{employee.position} &middot; {employee.department}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/employees/${id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
          >
            <HiOutlinePencil className="w-4 h-4" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition cursor-pointer"
          >
            <HiOutlineTrash className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Employee Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fields.map((f) => (
            <div key={f.label}>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{f.label}</p>
              <p className="mt-1 text-gray-900 font-medium">{f.value || '-'}</p>
            </div>
          ))}
        </div>

        {employee.skills && employee.skills.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {employee.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
