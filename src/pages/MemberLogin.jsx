import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Mail, ArrowLeft, Loader } from 'lucide-react';

const MemberLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginMember } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/member/login`, {
        email,
        password
      });

      const { token, user } = response.data;
      loginMember(token, user);
      navigate('/member/dashboard');
    } catch (err) {
      console.error('Member Login Error:', err);
      setError(err.response?.data?.message || 'Invalid credentials or connection issue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 relative">
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-textSecondary font-heading font-bold tracking-widest text-sm hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-1">
        <ArrowLeft size={16} /> BACK TO LANDING
      </Link>
      
      <div className="w-full max-w-md bg-surface p-10 shadow-2xl border border-gray-800 rounded-xl relative overflow-hidden">
        {/* Abstract design */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
        
        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center justify-center bg-primary/10 text-primary p-4 rounded-xl mb-4 shadow-[0_0_20px_rgba(232,85,62,0.15)] ring-1 ring-primary/30">
            <User size={36} />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-1">ATHLETE PORTAL</h2>
          <p className="text-xs font-bold text-textSecondary tracking-widest uppercase">Member Access</p>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-3 rounded-lg text-sm text-center mb-6 font-medium relative z-10">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-textSecondary tracking-widest uppercase">EMAIL ADDRESS</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary" />
              <input 
                type="email" 
                className="w-full bg-background border border-gray-700 text-white placeholder-gray-500 pl-11 pr-4 py-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium"
                placeholder="athlete@fitcore.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-textSecondary tracking-widest uppercase">PASSWORD</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary" />
              <input 
                type="password" 
                className="w-full bg-background border border-gray-700 text-white placeholder-gray-500 pl-11 pr-4 py-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-primary text-white font-heading text-xl font-bold tracking-wider py-4 rounded-lg hover:bg-primaryHover transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(232,85,62,0.3)] mt-4" disabled={loading}>
            {loading ? (
              <>
                <Loader size={18} className="animate-spin" /> LOGGING IN...
              </>
            ) : (
              "ACCESS DASHBOARD"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MemberLogin;
