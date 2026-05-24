import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
// Recharts removed
import { 
  Users, UserCheck, DollarSign, Activity, HelpCircle, LogOut, Search, Plus, 
  Trash2, Edit2, ShieldAlert, Shield, Check, UserPlus, Ban
} from 'lucide-react';

const AdminDashboard = () => {
  const { admin, logoutAdmin, getAuthHeaders } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [fees, setFees] = useState([]);
  const [queries, setQueries] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [showTrainerModal, setShowTrainerModal] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [showFeeModal, setShowFeeModal] = useState(false);

  const [memberForm, setMemberForm] = useState({
    name: '', age: '', phone: '', email: '', password: '',
    category: 'General', goal: 'General Fitness', trainer_id: '',
    plan_id: '', membership_start: new Date().toISOString().split('T')[0],
    payment_status: 'pending', payment_method: 'cash'
  });

  const [trainerForm, setTrainerForm] = useState({
    name: '', email: '', phone: '', specialization: 'Bodybuilding',
    bio: '', password: ''
  });

  const [feeForm, setFeeForm] = useState({
    member_id: '', plan_id: '', amount: '',
    paid_on: new Date().toISOString().split('T')[0], payment_method: 'cash'
  });

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const headers = getAuthHeaders('admin');
      const plansRes = await axios.get(`${import.meta.env.VITE_API_URL}/plans`);
      setPlans(plansRes.data);

      const [membersRes, trainersRes, feesRes, queriesRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/members`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL}/trainers`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL}/fees`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL}/support`, { headers })
      ]);

      setMembers(membersRes.data);
      setTrainers(trainersRes.data);
      setFees(feesRes.data);
      setQueries(queriesRes.data);
    } catch (err) {
      setError('Could not load data from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [admin]);



  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
  };

  const saveMember = async (e) => {
    e.preventDefault();
    try {
      const headers = getAuthHeaders('admin');
      if (editingMember) {
        const res = await axios.put(`${import.meta.env.VITE_API_URL}/members/${editingMember.id}`, memberForm, { headers });
        setMembers(members.map(m => m.id === editingMember.id ? { ...m, ...res.data } : m));
      } else {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/members`, memberForm, { headers });
        setMembers([res.data, ...members]);
      }
      setShowMemberModal(false);
      setEditingMember(null);
      resetMemberForm();
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving member');
    }
  };

  const deleteMember = async (id) => {
    if (!window.confirm('Delete this member? All client records will be deleted.')) return;
    try {
      const headers = getAuthHeaders('admin');
      await axios.delete(`${import.meta.env.VITE_API_URL}/members/${id}`, { headers });
      setMembers(members.filter(m => m.id !== id));
    } catch (err) {
      alert('Error deleting member');
    }
  };

  const toggleBlockMember = async (member) => {
    const nextStatus = member.status === 'active' ? 'blocked' : 'active';
    try {
      const headers = getAuthHeaders('admin');
      const res = await axios.patch(`${import.meta.env.VITE_API_URL}/members/${member.id}/block`, { status: nextStatus }, { headers });
      setMembers(members.map(m => m.id === member.id ? { ...m, status: res.data.status, qr_code: res.data.qr_code } : m));
    } catch (err) {
      alert('Error changing block status');
    }
  };

  const openEditMember = (member) => {
    setEditingMember(member);
    setMemberForm({
      name: member.name || '',
      age: member.age || '',
      phone: member.phone || '',
      email: member.email || '',
      password: '',
      category: member.category || 'General',
      goal: member.goal || 'General Fitness',
      trainer_id: member.trainer_id || '',
      plan_id: member.plan_id || '',
      membership_start: member.membership_start || new Date().toISOString().split('T')[0],
      payment_status: member.payment_status || 'pending',
      payment_method: 'cash'
    });
    setShowMemberModal(true);
  };

  const resetMemberForm = () => {
    setMemberForm({
      name: '', age: '', phone: '', email: '', password: '',
      category: 'General', goal: 'General Fitness', trainer_id: '',
      plan_id: '', membership_start: new Date().toISOString().split('T')[0],
      payment_status: 'pending', payment_method: 'cash'
    });
  };

  const saveTrainer = async (e) => {
    e.preventDefault();
    try {
      const headers = getAuthHeaders('admin');
      if (editingTrainer) {
        const res = await axios.put(`${import.meta.env.VITE_API_URL}/trainers/${editingTrainer.id}`, trainerForm, { headers });
        setTrainers(trainers.map(t => t.id === editingTrainer.id ? { ...t, ...res.data } : t));
      } else {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/trainers`, trainerForm, { headers });
        setTrainers([res.data, ...trainers]);
      }
      setShowTrainerModal(false);
      setEditingTrainer(null);
      resetTrainerForm();
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving trainer');
    }
  };

  const deleteTrainer = async (id) => {
    if (!window.confirm('Delete this trainer?')) return;
    try {
      const headers = getAuthHeaders('admin');
      await axios.delete(`${import.meta.env.VITE_API_URL}/trainers/${id}`, { headers });
      setTrainers(trainers.filter(t => t.id !== id));
    } catch (err) {
      alert('Error deleting trainer');
    }
  };

  const toggleTrainerStatus = async (trainer) => {
    const nextStatus = trainer.status === 'active' ? 'inactive' : 'active';
    try {
      const headers = getAuthHeaders('admin');
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/trainers/${trainer.id}`, { status: nextStatus }, { headers });
      setTrainers(trainers.map(t => t.id === trainer.id ? { ...t, status: res.data.status } : t));
    } catch (err) {
      alert('Error updating status');
    }
  };

  const openEditTrainer = (trainer) => {
    setEditingTrainer(trainer);
    setTrainerForm({
      name: trainer.name || '',
      email: trainer.email || '',
      phone: trainer.phone || '',
      specialization: trainer.specialization || 'Bodybuilding',
      bio: trainer.bio || '',
      password: ''
    });
    setShowTrainerModal(true);
  };

  const resetTrainerForm = () => {
    setTrainerForm({
      name: '', email: '', phone: '', specialization: 'Bodybuilding',
      bio: '', password: ''
    });
  };

  const logPayment = async (e) => {
    e.preventDefault();
    try {
      const headers = getAuthHeaders('admin');
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/fees`, feeForm, { headers });
      setFees([res.data, ...fees]);
      setShowFeeModal(false);
      setFeeForm({
        member_id: '', plan_id: '', amount: '',
        paid_on: new Date().toISOString().split('T')[0], payment_method: 'cash'
      });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error logging payment');
    }
  };

  const handlePlanChange = (planId) => {
    const selectedPlan = plans.find(p => p.id === planId);
    setFeeForm({
      ...feeForm,
      plan_id: planId,
      amount: selectedPlan ? selectedPlan.price : ''
    });
  };

  const resolveQuery = async (id) => {
    try {
      const headers = getAuthHeaders('admin');
      await axios.patch(`${import.meta.env.VITE_API_URL}/support/${id}/resolve`, {}, { headers });
      setQueries(queries.map(q => q.id === id ? { ...q, status: 'resolved' } : q));
    } catch (err) {
      alert('Error resolving support query');
    }
  };

  const totalRevenue = fees.reduce((acc, f) => acc + parseFloat(f.amount), 0);
  const activeMembersCount = members.filter(m => m.status === 'active').length;
  const eliteTrainersCount = trainers.length;
  const pendingPaymentsCount = members.filter(m => m.payment_status === 'pending').length;



  const filteredMembers = members.filter(m => 
    m.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.member_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTrainers = trainers.filter(t => 
    t.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.trainer_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-textPrimary overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface border-b md:border-b-0 md:border-r border-gray-800 flex flex-col shrink-0 z-30">
        <div className="p-4 md:p-6 flex justify-between items-center text-2xl font-heading font-extrabold text-white border-b border-gray-800">
          <span className="flex items-center gap-2"><span className="text-primary">⚡</span> FITCORE</span>
        </div>
        <nav className="flex-none md:flex-1 py-4 md:py-6 flex flex-row md:flex-col gap-2 px-4 overflow-x-auto no-scrollbar whitespace-nowrap">
          <button 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'overview' ? 'bg-primary/10 text-primary' : 'text-textSecondary hover:text-white hover:bg-gray-800/50'}`}
            onClick={() => { setActiveTab('overview'); setSearchQuery(''); }}
          >
            <Activity size={18} /> Overview
          </button>
          <button 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'members' ? 'bg-primary/10 text-primary' : 'text-textSecondary hover:text-white hover:bg-gray-800/50'}`}
            onClick={() => { setActiveTab('members'); setSearchQuery(''); }}
          >
            <Users size={18} /> Members
          </button>
          <button 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'trainers' ? 'bg-primary/10 text-primary' : 'text-textSecondary hover:text-white hover:bg-gray-800/50'}`}
            onClick={() => { setActiveTab('trainers'); setSearchQuery(''); }}
          >
            <UserCheck size={18} /> Trainers
          </button>
          <button 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'fees' ? 'bg-primary/10 text-primary' : 'text-textSecondary hover:text-white hover:bg-gray-800/50'}`}
            onClick={() => { setActiveTab('fees'); setSearchQuery(''); }}
          >
            <DollarSign size={18} /> Fees Management
          </button>
          <button 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'support' ? 'bg-primary/10 text-primary' : 'text-textSecondary hover:text-white hover:bg-gray-800/50'}`}
            onClick={() => { setActiveTab('support'); setSearchQuery(''); }}
          >
            <HelpCircle size={18} /> Support Queries
          </button>
          <div className="md:mt-auto ml-auto md:ml-0">
            <button className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-500 hover:bg-red-500/10 transition-all" onClick={handleLogout}>
              <LogOut size={18} /> <span className="hidden md:inline">Log Out</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
        {/* Header */}
        <header className="bg-surface border-b border-gray-800 p-6 flex justify-between items-center sticky top-0 z-20">
          <div className="flex-1">
            {(activeTab === 'members' || activeTab === 'trainers') && (
              <div className="relative w-80">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text" 
                  placeholder={`Search ${activeTab === 'members' ? 'members...' : 'trainers...'}`} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background border border-gray-700 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm font-medium"
                />
              </div>
            )}
          </div>
          <div className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-full text-sm font-bold tracking-wider flex items-center gap-2">
            <Shield size={16} /> ADMIN: {admin?.user?.name || 'System Admin'}
          </div>
        </header>

        {loading ? (
          <div className="min-h-screen flex flex-col items-center justify-center p-20">
            <span className="text-4xl text-primary animate-pulse mb-4">⚡</span>
            <p className="text-textSecondary font-heading font-bold tracking-widest text-lg uppercase">Loading System Records...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-4 rounded-lg m-8 text-center font-medium">
            {error}
          </div>
        ) : (
          <div className="p-8">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase">Dashboard Overview</h1>
                    <p className="text-sm text-textSecondary mt-1">Live performance metrics and revenue metrics.</p>
                  </div>
                  <div className="flex gap-4">
                    <button className="bg-surface border border-gray-700 text-white font-heading font-bold tracking-wider py-2.5 px-5 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2" onClick={() => setShowFeeModal(true)}>
                      <DollarSign size={16} /> LOG PAYMENT
                    </button>
                    <button className="bg-primary text-white font-heading font-bold tracking-wider py-2.5 px-5 rounded-lg hover:bg-primaryHover transition-colors flex items-center gap-2 shadow-[0_4px_14px_rgba(232,85,62,0.3)]" onClick={() => { resetMemberForm(); setShowMemberModal(true); }}>
                      <Plus size={16} /> ADD MEMBER
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-surface border border-gray-800 rounded-xl p-6 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                      <DollarSign size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-textSecondary uppercase tracking-widest mb-1">TOTAL REVENUE</p>
                      <h3 className="text-2xl font-bold text-white">₹{totalRevenue.toLocaleString('en-IN')}</h3>
                    </div>
                  </div>
                  <div className="bg-surface border border-gray-800 rounded-xl p-6 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Users size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-textSecondary uppercase tracking-widest mb-1">ACTIVE MEMBERS</p>
                      <h3 className="text-2xl font-bold text-white">{activeMembersCount}</h3>
                    </div>
                  </div>
                  <div className="bg-surface border border-gray-800 rounded-xl p-6 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                      <UserCheck size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-textSecondary uppercase tracking-widest mb-1">ELITE TRAINERS</p>
                      <h3 className="text-2xl font-bold text-white">{eliteTrainersCount}</h3>
                    </div>
                  </div>
                  <div className="bg-surface border border-gray-800 rounded-xl p-6 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center shrink-0">
                      <ShieldAlert size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-textSecondary uppercase tracking-widest mb-1">PENDING FEES</p>
                      <h3 className="text-2xl font-bold text-white">{pendingPaymentsCount}</h3>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 mb-8">
                  <div className="bg-surface border border-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wide mb-6">RECENT ACTIVITIES</h3>
                    <div className="flex flex-col gap-4">
                      {fees.slice(0, 3).map((f, idx) => (
                        <div className="flex gap-4 items-start" key={idx}>
                          <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                            <Check size={14} />
                          </div>
                          <div>
                            <p className="text-sm text-white">Payment Logged: <strong className="font-bold">₹{f.amount}</strong> paid by {f.member?.name || 'Member'}</p>
                            <span className="text-xs text-textSecondary">Paid via {f.payment_method?.toUpperCase()} on {f.paid_on}</span>
                          </div>
                        </div>
                      ))}
                      {members.slice(0, 2).map((m, idx) => (
                        <div className="flex gap-4 items-start" key={idx}>
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <UserPlus size={14} />
                          </div>
                          <div>
                            <p className="text-sm text-white">New athlete onboarded: <strong className="font-bold">{m.name}</strong> ({m.member_id})</p>
                            <span className="text-xs text-textSecondary">Assigned plan: {m.plan?.name || 'Starter'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MEMBERS TAB */}
            {activeTab === 'members' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase">MEMBER MANAGEMENT</h1>
                    <p className="text-sm text-textSecondary mt-1">Add, edit, block, and manage gym membership logs.</p>
                  </div>
                  <button className="bg-primary text-white font-heading font-bold tracking-wider py-2.5 px-5 rounded-lg hover:bg-primaryHover transition-colors flex items-center gap-2 shadow-[0_4px_14px_rgba(232,85,62,0.3)]" onClick={() => { resetMemberForm(); setShowMemberModal(true); }}>
                    <Plus size={16} /> ADD MEMBER
                  </button>
                </div>

                <div className="bg-surface border border-gray-800 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-background border-b border-gray-800 text-xs font-bold text-textSecondary uppercase tracking-widest">
                          <th className="p-4">ID</th>
                          <th className="p-4">Name</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Plan</th>
                          <th className="p-4">Payment</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {filteredMembers.map(m => (
                          <tr key={m.id} className="hover:bg-background/50 transition-colors">
                            <td className="p-4 font-bold text-white">{m.member_id}</td>
                            <td className="p-4">
                              <div className="font-bold text-white">{m.name}</div>
                              <div className="text-xs text-textSecondary">{m.email}</div>
                            </td>
                            <td className="p-4">
                              <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{m.category}</span>
                            </td>
                            <td className="p-4 text-sm text-gray-300">{m.plan?.name || 'N/A'}</td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${m.payment_status === 'paid' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                {m.payment_status}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${m.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                {m.status}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-2">
                                <button className="w-8 h-8 rounded border border-gray-700 bg-background flex items-center justify-center text-textSecondary hover:text-white hover:border-primary transition-colors" onClick={() => openEditMember(m)}>
                                  <Edit2 size={14} />
                                </button>
                                <button className={`w-8 h-8 rounded border border-gray-700 bg-background flex items-center justify-center transition-colors ${m.status === 'blocked' ? 'text-red-500 border-red-500 bg-red-500/10' : 'text-textSecondary hover:text-red-500 hover:border-red-500'}`} onClick={() => toggleBlockMember(m)}>
                                  <Ban size={14} />
                                </button>
                                <button className="w-8 h-8 rounded border border-gray-700 bg-background flex items-center justify-center text-textSecondary hover:text-red-500 hover:border-red-500 hover:bg-red-500/10 transition-colors" onClick={() => deleteMember(m.id)}>
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TRAINERS TAB */}
            {activeTab === 'trainers' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase">TRAINER MANAGEMENT</h1>
                    <p className="text-sm text-textSecondary mt-1">Register personal coaches and specialization scopes.</p>
                  </div>
                  <button className="bg-primary text-white font-heading font-bold tracking-wider py-2.5 px-5 rounded-lg hover:bg-primaryHover transition-colors flex items-center gap-2 shadow-[0_4px_14px_rgba(232,85,62,0.3)]" onClick={() => { resetTrainerForm(); setShowTrainerModal(true); }}>
                    <Plus size={16} /> ADD TRAINER
                  </button>
                </div>

                <div className="bg-surface border border-gray-800 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-background border-b border-gray-800 text-xs font-bold text-textSecondary uppercase tracking-widest">
                          <th className="p-4">Trainer ID</th>
                          <th className="p-4">Coach Name</th>
                          <th className="p-4">Specialization</th>
                          <th className="p-4">Clients</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {filteredTrainers.map(t => (
                          <tr key={t.id} className="hover:bg-background/50 transition-colors">
                            <td className="p-4 font-bold text-white">{t.trainer_id}</td>
                            <td className="p-4">
                              <div className="font-bold text-white">{t.name}</div>
                              <div className="text-xs text-textSecondary">{t.email}</div>
                            </td>
                            <td className="p-4">
                              <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{t.specialization}</span>
                            </td>
                            <td className="p-4 text-sm text-gray-300">
                              <strong className="text-white">{t.assigned_members_count}</strong> active
                            </td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${t.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                {t.status}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-2">
                                <button className="w-8 h-8 rounded border border-gray-700 bg-background flex items-center justify-center text-textSecondary hover:text-white hover:border-primary transition-colors" onClick={() => openEditTrainer(t)}>
                                  <Edit2 size={14} />
                                </button>
                                <button className={`w-8 h-8 rounded border border-gray-700 bg-background flex items-center justify-center transition-colors ${t.status === 'inactive' ? 'text-red-500 border-red-500 bg-red-500/10' : 'text-textSecondary hover:text-red-500 hover:border-red-500'}`} onClick={() => toggleTrainerStatus(t)}>
                                  <Ban size={14} />
                                </button>
                                <button className="w-8 h-8 rounded border border-gray-700 bg-background flex items-center justify-center text-textSecondary hover:text-red-500 hover:border-red-500 hover:bg-red-500/10 transition-colors" onClick={() => deleteTrainer(t.id)}>
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* FEES TAB */}
            {activeTab === 'fees' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase">FEES & FINANCIAL LEDGER</h1>
                    <p className="text-sm text-textSecondary mt-1">Log manual athlete payments and trace checkout logs.</p>
                  </div>
                  <button className="bg-primary text-white font-heading font-bold tracking-wider py-2.5 px-5 rounded-lg hover:bg-primaryHover transition-colors flex items-center gap-2 shadow-[0_4px_14px_rgba(232,85,62,0.3)]" onClick={() => setShowFeeModal(true)}>
                    <Plus size={16} /> LOG PAYMENT
                  </button>
                </div>
                <div className="bg-surface border border-gray-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-background border-b border-gray-800 text-xs font-bold text-textSecondary uppercase tracking-widest">
                        <th className="p-4">Receipt ID</th>
                        <th className="p-4">Member</th>
                        <th className="p-4">Plan</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Method</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {fees.map(f => (
                        <tr key={f.id} className="hover:bg-background/50 transition-colors">
                          <td className="p-4 font-mono text-xs text-textSecondary">{f.id}</td>
                          <td className="p-4">
                            <div className="font-bold text-white">{f.member?.name}</div>
                            <div className="text-xs text-textSecondary">{f.member?.member_id}</div>
                          </td>
                          <td className="p-4 text-sm text-gray-300">{f.plan?.name}</td>
                          <td className="p-4 font-bold text-white">₹{parseFloat(f.amount).toLocaleString()}</td>
                          <td className="p-4 text-sm text-gray-300">{f.paid_on}</td>
                          <td className="p-4">
                            <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{f.payment_method}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUPPORT TAB */}
            {activeTab === 'support' && (
              <div>
                <div className="mb-8">
                  <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase">SUPPORT TICKETS</h1>
                  <p className="text-sm text-textSecondary mt-1">Review and resolve inquiries from coaches and athletes.</p>
                </div>
                <div className="flex flex-col gap-4">
                  {queries.map(q => (
                    <div className="bg-surface border border-gray-800 rounded-xl p-6 flex flex-col md:flex-row gap-6 justify-between" key={q.id}>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${q.role === 'trainer' ? 'bg-blue-500/10 text-blue-500' : 'bg-primary/10 text-primary'}`}>
                            {q.role}
                          </span>
                          <span className="text-sm font-bold text-white">ID: {q.user_id}</span>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">{q.subject}</h4>
                        <p className="text-sm text-textSecondary leading-relaxed">{q.message}</p>
                      </div>
                      <div className="flex flex-col items-end gap-3 justify-center shrink-0">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${q.status === 'open' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                          {q.status}
                        </span>
                        {q.status === 'open' && (
                          <button className="bg-background border border-gray-700 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-md hover:border-green-500 hover:text-green-500 transition-colors" onClick={() => resolveQuery(q.id)}>
                            Mark Resolved
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* --- MODALS --- */}
      {/* 1. Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface border border-gray-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-background/50">
              <h3 className="text-xl font-extrabold text-white tracking-tight uppercase">{editingMember ? 'EDIT ATHLETE PROFILE' : 'REGISTER NEW ATHLETE'}</h3>
              <button className="text-textSecondary hover:text-white transition-colors" onClick={() => setShowMemberModal(false)}>
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={saveMember} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Personal details */}
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest">Full Name</label>
                    <input type="text" className="w-full bg-background border border-gray-700 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm" value={memberForm.name} onChange={(e) => setMemberForm({...memberForm, name: e.target.value})} required />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest">Email Address</label>
                    <input type="email" className="w-full bg-background border border-gray-700 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm" value={memberForm.email} onChange={(e) => setMemberForm({...memberForm, email: e.target.value})} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest">Age</label>
                      <input type="number" className="w-full bg-background border border-gray-700 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm" value={memberForm.age} onChange={(e) => setMemberForm({...memberForm, age: e.target.value})} required />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest">Phone</label>
                      <input type="text" className="w-full bg-background border border-gray-700 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm" value={memberForm.phone} onChange={(e) => setMemberForm({...memberForm, phone: e.target.value})} required />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest">Password {editingMember && "(Leave blank to keep)"}</label>
                    <input type="password" placeholder={editingMember ? "••••••••" : ""} className="w-full bg-background border border-gray-700 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm" value={memberForm.password} onChange={(e) => setMemberForm({...memberForm, password: e.target.value})} required={!editingMember} />
                  </div>
                </div>

                {/* Gym details */}
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest">Goal</label>
                    <select className="w-full bg-background border border-gray-700 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm" value={memberForm.goal} onChange={(e) => setMemberForm({...memberForm, goal: e.target.value})}>
                      <option value="Weight Loss">Weight Loss</option>
                      <option value="Weight Gain">Weight Gain</option>
                      <option value="Bulking">Bulking</option>
                      <option value="Cutting">Cutting</option>
                      <option value="General Fitness">General Fitness</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest">Category</label>
                    <select className="w-full bg-background border border-gray-700 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm" value={memberForm.category} onChange={(e) => setMemberForm({...memberForm, category: e.target.value})}>
                      <option value="General">General</option>
                      <option value="VIP">VIP</option>
                      <option value="Student">Student</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest">Assign Coach</label>
                    <select className="w-full bg-background border border-gray-700 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm" value={memberForm.trainer_id} onChange={(e) => setMemberForm({...memberForm, trainer_id: e.target.value})}>
                      <option value="">No Coach (Self-Guided)</option>
                      {trainers.map(t => <option key={t.id} value={t.id}>{t.name} ({t.specialization})</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest">Membership Plan</label>
                    <select className="w-full bg-background border border-gray-700 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm" value={memberForm.plan_id} onChange={(e) => setMemberForm({...memberForm, plan_id: e.target.value})} required>
                      <option value="">Select Plan...</option>
                      {plans.map(p => <option key={p.id} value={p.id}>{p.name} ({p.duration_months} mo) - ₹{p.price}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {!editingMember && (
                <div className="grid grid-cols-2 gap-4 mb-6 border-t border-gray-800 pt-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest">Payment Status</label>
                    <select className="w-full bg-background border border-gray-700 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm" value={memberForm.payment_status} onChange={(e) => setMemberForm({...memberForm, payment_status: e.target.value})}>
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>
                  {memberForm.payment_status === 'paid' && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest">Method</label>
                      <select className="w-full bg-background border border-gray-700 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm" value={memberForm.payment_method} onChange={(e) => setMemberForm({...memberForm, payment_method: e.target.value})}>
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                        <option value="upi">UPI</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-800">
                <button type="button" className="px-5 py-2.5 rounded-lg font-bold tracking-wider text-sm bg-background border border-gray-700 text-white hover:bg-gray-800 transition-colors" onClick={() => setShowMemberModal(false)}>CANCEL</button>
                <button type="submit" className="px-5 py-2.5 rounded-lg font-bold tracking-wider text-sm bg-primary text-white hover:bg-primaryHover transition-colors">SAVE ATHLETE</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Trainer Modal */}
      {showTrainerModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-background/50">
              <h3 className="text-xl font-extrabold text-white tracking-tight uppercase">{editingTrainer ? 'EDIT COACH' : 'ADD NEW COACH'}</h3>
              <button className="text-textSecondary hover:text-white transition-colors" onClick={() => setShowTrainerModal(false)}>
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={saveTrainer} className="p-6">
              <div className="space-y-4 mb-8">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest">Full Name</label>
                  <input type="text" className="w-full bg-background border border-gray-700 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm" value={trainerForm.name} onChange={(e) => setTrainerForm({...trainerForm, name: e.target.value})} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest">Email</label>
                    <input type="email" className="w-full bg-background border border-gray-700 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm" value={trainerForm.email} onChange={(e) => setTrainerForm({...trainerForm, email: e.target.value})} required />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest">Phone</label>
                    <input type="text" className="w-full bg-background border border-gray-700 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm" value={trainerForm.phone} onChange={(e) => setTrainerForm({...trainerForm, phone: e.target.value})} required />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest">Password</label>
                  <input type="password" placeholder={editingTrainer ? "••••••••" : ""} className="w-full bg-background border border-gray-700 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm" value={trainerForm.password} onChange={(e) => setTrainerForm({...trainerForm, password: e.target.value})} required={!editingTrainer} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest">Specialization</label>
                  <select className="w-full bg-background border border-gray-700 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm" value={trainerForm.specialization} onChange={(e) => setTrainerForm({...trainerForm, specialization: e.target.value})}>
                    <option value="Bodybuilding">Bodybuilding</option>
                    <option value="HIIT">HIIT & Conditioning</option>
                    <option value="Yoga">Yoga & Mobility</option>
                    <option value="Powerlifting">Powerlifting</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest">Bio</label>
                  <textarea className="w-full bg-background border border-gray-700 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm resize-none" rows="3" value={trainerForm.bio} onChange={(e) => setTrainerForm({...trainerForm, bio: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-800">
                <button type="button" className="px-5 py-2.5 rounded-lg font-bold tracking-wider text-sm bg-background border border-gray-700 text-white hover:bg-gray-800 transition-colors" onClick={() => setShowTrainerModal(false)}>CANCEL</button>
                <button type="submit" className="px-5 py-2.5 rounded-lg font-bold tracking-wider text-sm bg-primary text-white hover:bg-primaryHover transition-colors">SAVE COACH</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Fee Modal */}
      {showFeeModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-background/50">
              <h3 className="text-xl font-extrabold text-white tracking-tight uppercase">LOG PAYMENT</h3>
              <button className="text-textSecondary hover:text-white transition-colors" onClick={() => setShowFeeModal(false)}>
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={logPayment} className="p-6">
              <div className="space-y-4 mb-8">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest">Select Athlete</label>
                  <select className="w-full bg-background border border-gray-700 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm" value={feeForm.member_id} onChange={(e) => setFeeForm({...feeForm, member_id: e.target.value})} required>
                    <option value="">Select active member...</option>
                    {members.map(m => <option key={m.id} value={m.id}>{m.name} ({m.payment_status})</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest">Plan</label>
                    <select className="w-full bg-background border border-gray-700 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm" value={feeForm.plan_id} onChange={(e) => handlePlanChange(e.target.value)} required>
                      <option value="">Select Plan...</option>
                      {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest">Amount (INR)</label>
                    <input type="number" className="w-full bg-background border border-gray-700 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm" value={feeForm.amount} onChange={(e) => setFeeForm({...feeForm, amount: e.target.value})} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest">Method</label>
                    <select className="w-full bg-background border border-gray-700 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm" value={feeForm.payment_method} onChange={(e) => setFeeForm({...feeForm, payment_method: e.target.value})}>
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="upi">UPI</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-textSecondary uppercase tracking-widest">Date</label>
                    <input type="date" className="w-full bg-background border border-gray-700 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm" value={feeForm.paid_on} onChange={(e) => setFeeForm({...feeForm, paid_on: e.target.value})} required />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-800">
                <button type="button" className="px-5 py-2.5 rounded-lg font-bold tracking-wider text-sm bg-background border border-gray-700 text-white hover:bg-gray-800 transition-colors" onClick={() => setShowFeeModal(false)}>CANCEL</button>
                <button type="submit" className="px-5 py-2.5 rounded-lg font-bold tracking-wider text-sm bg-primary text-white hover:bg-primaryHover transition-colors">LOG PAYMENT</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
