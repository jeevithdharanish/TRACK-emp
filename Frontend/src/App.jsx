import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EmployeeDetail from './pages/EmployeeDetail';
import EmployeeForm from './pages/EmployeeForm';
import Evaluations from './pages/Evaluations';
import EvaluationForm from './pages/EvaluationForm';
import Roles from './pages/Roles';
import SkillLevelStages from './pages/SkillLevelStages';
import Reports from './pages/Reports';

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="text-lg text-gray-500">Loading...</div></div>;
  return token ? children : <Navigate to="/login" />;
}

function GuestRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return null;
  return token ? <Navigate to="/" /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="employees/new" element={<EmployeeForm />} />
        <Route path="employees/:id" element={<EmployeeDetail />} />
        <Route path="employees/:id/edit" element={<EmployeeForm />} />
        <Route path="evaluations" element={<Evaluations />} />
        <Route path="evaluations/new" element={<EvaluationForm />} />
        <Route path="evaluations/:id/edit" element={<EvaluationForm />} />
        <Route path="roles" element={<Roles />} />
        <Route path="skill-level-stages" element={<SkillLevelStages />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}
