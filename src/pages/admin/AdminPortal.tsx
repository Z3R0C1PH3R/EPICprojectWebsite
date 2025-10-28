import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const backend_url = import.meta.env.VITE_BACKEND_URL;

export default function AdminPortal() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('authToken') !== null;
  });
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('password', password);
      const response = await fetch(backend_url + '/handle_login', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.status === 202) {
        localStorage.setItem('authToken', data.token);
        setIsAuthenticated(true);
      } else if (response.status === 401) {
        alert('Invalid password');
      } else if (response.status === 429) {
        alert(data.error || 'Too many login attempts. Please try again later.');
      }
    } catch (error) {
      alert('Error logging in, issue: ' + (error as Error).message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white backdrop-blur-md rounded-lg p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Lock className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Admin Access</h1>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors"
            >
              Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Admin Portal</h1>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300"
            >
              Logout
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg transition-colors"
              onClick={() => navigate('/admin/case-studies')}
            >
              Case Studies
            </button>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg transition-colors"
              onClick={() => navigate('/admin/resources')}
            >
              Resources
            </button>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg transition-colors"
              onClick={() => navigate('/admin/gallery')}
            >
              Gallery
            </button>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg transition-colors"
              onClick={() => navigate('/admin/team')}
            >
              Team
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}