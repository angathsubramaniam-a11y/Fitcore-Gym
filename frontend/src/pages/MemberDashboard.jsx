import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import { 
  User, Dumbbell, Apple, LogOut, ShieldAlert, Award, 
  Mail, Phone, Calendar, Check, AlertTriangle, HelpCircle, Edit3
} from 'lucide-react';

const MemberDashboard = () => {
  const { member, logoutMember, getAuthHeaders } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Member's custom plan states
  const [profile, setProfile] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [diets, setDiets] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!member) {
      navigate('/member/login');
      return;
    }
    fetchMemberData();
  }, [member]);

  const fetchMemberData = async () => {
    setLoading(true);
    setError('');
    try {
      const headers = getAuthHeaders('member');
      
      const profileRes = await axios.get(`${import.meta.env.VITE_API_URL}/members/me`, { headers });
      setProfile(profileRes.data);

      const [workoutsRes, dietsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/workout/member/me`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL}/diet/member/me`, { headers })
      ]);

      setWorkouts(workoutsRes.data);
      setDiets(dietsRes.data);
    } catch (err) {
      console.error('Error fetching member profile:', err);
      setError('Could not establish connection to retrieve profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutMember();
    navigate('/');
  };

  const groupedWorkouts = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const grouped = {};
    days.forEach(d => grouped[d] = []);
    workouts.forEach(w => {
      if (grouped[w.day_of_week]) {
        grouped[w.day_of_week].push(w);
      }
    });
    return grouped;
  };

  const dietTotals = () => {
    let calories = 0;
    let protein = 0;
    diets.forEach(d => {
      calories += parseFloat(d.calories || 0);
      protein += parseFloat(d.protein_g || 0);
    });
    return { calories, protein };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <span className="text-4xl text-primary animate-pulse mb-4">⚡</span>
        <p className="text-textSecondary font-heading font-bold tracking-widest text-lg">SYNCHRONIZING PERFORMANCE DATA...</p>
      </div>
    );
  }

  const isBlocked = profile?.status === 'blocked';

  return (
    <div className="flex h-screen bg-background text-textPrimary">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-gray-800 flex flex-col">
        <div className="p-6 flex items-center gap-2 text-2xl font-heading font-extrabold text-white border-b border-gray-800">
          <span className="text-primary">⚡</span> FITCORE
        </div>
        <nav className="flex-1 py-6 flex flex-col gap-2 px-4">
          <button 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'overview' ? 'bg-primary/10 text-primary' : 'text-textSecondary hover:text-white hover:bg-gray-800/50'}`}
            onClick={() => setActiveTab('overview')}
            disabled={isBlocked}
          >
            <User size={18} /> Profile Hub
          </button>
          <button 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'workout' ? 'bg-primary/10 text-primary' : 'text-textSecondary hover:text-white hover:bg-gray-800/50'}`}
            onClick={() => setActiveTab('workout')}
            disabled={isBlocked}
          >
            <Dumbbell size={18} /> Workout split
          </button>
          <button 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'diet' ? 'bg-primary/10 text-primary' : 'text-textSecondary hover:text-white hover:bg-gray-800/50'}`}
            onClick={() => setActiveTab('diet')}
            disabled={isBlocked}
          >
            <Apple size={18} /> Meal guideline
          </button>
          <div className="mt-auto">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-500 hover:bg-red-500/10 transition-all" onClick={handleLogout}>
              <LogOut size={18} /> Log Out
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
        {/* Header */}
        <header className="bg-surface border-b border-gray-800 p-6 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-extrabold font-heading tracking-wide text-white">ATHLETE PORTAL</h1>
          <div className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-full text-sm font-bold tracking-wider flex items-center gap-2">
            <User size={16} /> MEMBER ID: {profile?.member_id}
          </div>
        </header>

        <div className="p-8">
          {isBlocked ? (
            /* SUSPENDED SCREEN */
            <div className="border border-red-500 bg-red-500/5 rounded-xl text-center p-16 flex flex-col items-center gap-4">
              <AlertTriangle size={64} className="text-red-500 animate-pulse" />
              <h2 className="text-3xl font-extrabold text-white tracking-tight">🚨 ACCESS SUSPENDED 🚨</h2>
              <p className="text-lg text-white max-w-xl">
                Your FitCore member QR-access gateway has been deactivated by the administration.
              </p>
              <div className="bg-surface border border-gray-800 rounded-lg p-6 mt-4 text-sm text-textSecondary max-w-lg mx-auto">
                <p>Reason: Payment Default / Account Review Pending</p>
                <p className="mt-2">Please report to the front desk reception or contact administrative support to resolve billing issues.</p>
              </div>
            </div>
          ) : (
            <>
              {/* -------------------- OVERVIEW TAB -------------------- */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-surface to-gray-900 border border-gray-800 rounded-xl p-8">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2 uppercase">WELCOME BACK, {profile?.name}!</h2>
                    <p className="text-textSecondary">Check in below and view your customized body composition guidelines.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: QR Code Check-in */}
                    <div className="bg-surface border border-gray-800 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                      <h3 className="text-xl font-bold text-white mb-2 uppercase">GATEWAY ACCESS QR</h3>
                      <p className="text-xs text-textSecondary mb-6">Scan at reception scanner to register attendance.</p>
                      <div className="p-4 bg-white rounded-xl inline-flex shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-gray-200">
                        {profile?.qr_code ? (
                          <img 
                            src={profile.qr_code} 
                            alt="Gateway QR Code"
                            style={{ width: '180px', height: '180px' }}
                            className="rounded-lg"
                          />
                        ) : (
                          <div className="text-textSecondary w-[180px] h-[180px] flex items-center justify-center">Generating...</div>
                        )}
                      </div>
                      <span className="mt-6 text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1">
                        ⚡ SCAN CODE TO ENTER
                      </span>
                    </div>

                    {/* Middle Column: Membership Status */}
                    <div className="bg-surface border border-gray-800 rounded-xl p-8">
                      <h3 className="text-xl font-bold text-white mb-6 uppercase">MEMBERSHIP STATUS</h3>
                      <div className="space-y-6">
                        <div>
                          <span className="text-xs font-bold text-textSecondary uppercase tracking-widest block mb-1">Active Plan</span>
                          <h4 className="text-2xl font-bold text-white">{profile?.plan?.name || 'Active Package'}</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-xs font-bold text-textSecondary uppercase tracking-widest block mb-1">Start Date</span>
                            <p className="text-white font-medium">{profile?.membership_start}</p>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-textSecondary uppercase tracking-widest block mb-1">End Date</span>
                            <p className="text-white font-medium">{profile?.membership_end}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-xs font-bold text-textSecondary uppercase tracking-widest block mb-1">Category</span>
                            <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-bold tracking-wider uppercase inline-block mt-1">{profile?.category}</span>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-textSecondary uppercase tracking-widest block mb-1">Bill Status</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase inline-block mt-1 ${profile?.payment_status === 'paid' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                              {profile?.payment_status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Coach & Specialization details */}
                    <div className="bg-surface border border-gray-800 rounded-xl p-8">
                      <h3 className="text-xl font-bold text-white mb-6 uppercase">MY COACH DETAILS</h3>
                      {profile?.trainer ? (
                        <div className="space-y-5">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center font-heading text-2xl font-bold shadow-lg">
                              {profile.trainer.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-white uppercase">{profile.trainer.name}</h4>
                              <p className="text-primary text-xs font-bold tracking-widest uppercase">{profile.trainer.specialization}</p>
                            </div>
                          </div>
                          <p className="text-sm text-textSecondary italic leading-relaxed">
                            "{profile.trainer.bio || 'Your elite training partner is assigned to help you optimize nutrition and posture splits.'}"
                          </p>
                          <div className="pt-5 border-t border-gray-800 space-y-3">
                            <span className="flex items-center gap-3 text-sm text-textSecondary">
                              <Mail size={16} /> {profile.trainer.email}
                            </span>
                            <span className="flex items-center gap-3 text-sm text-textSecondary">
                              <Phone size={16} /> {profile.trainer.phone}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="py-12 text-center flex flex-col items-center justify-center text-textSecondary">
                          <Award size={48} className="mb-4 opacity-50" />
                          <p className="text-sm">No personal coach assigned.<br/>Contact admin to assign.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* -------------------- WORKOUT SPLIT TAB -------------------- */}
              {activeTab === 'workout' && (
                <div>
                  <h2 className="text-3xl font-extrabold text-white tracking-tight mb-8 uppercase">YOUR PRESCRIBED WORKOUT SCHEDULE</h2>
                  
                  <div className="space-y-6">
                    {Object.entries(groupedWorkouts()).map(([day, list]) => (
                      <div className="bg-surface border border-gray-800 rounded-xl p-6" key={day}>
                        <h3 className="text-2xl font-bold text-primary border-l-4 border-primary pl-4 mb-5 uppercase">{day}</h3>
                        <div className="space-y-3">
                          {list.map(w => (
                            <div className="bg-background border border-gray-800 rounded-lg p-4 flex items-center gap-4" key={w.id}>
                              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <Check size={16} />
                              </div>
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  {w.muscle_group && <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{w.muscle_group}</span>}
                                </div>
                                <strong className="text-lg text-white uppercase block">{w.exercise_name}</strong>
                                <span className="text-textSecondary text-sm font-medium">
                                  {w.sets} Sets &times; {w.reps} Reps
                                </span>
                                {w.notes && (
                                  <div className="mt-2 text-xs text-gray-500 bg-surface/50 p-2 rounded border border-gray-800 flex items-start gap-2 max-w-lg">
                                    <Edit3 size={12} className="mt-0.5 shrink-0" />
                                    <span>{w.notes}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          {list.length === 0 && (
                            <p className="text-textSecondary text-sm pl-4 font-medium italic">
                              Rest Day / Active Recovery
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* -------------------- DIET PLAN TAB -------------------- */}
              {activeTab === 'diet' && (
                <div>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight uppercase">DAILY MEAL PROTOCOLS</h2>
                    <div className="flex gap-4">
                      <div className="bg-surface border border-gray-800 rounded-lg px-6 py-4 flex flex-col items-start gap-1">
                        <span className="text-xs font-bold text-textSecondary uppercase tracking-widest">TOTAL CALORIES</span>
                        <h4 className="text-2xl font-bold text-primary">{dietTotals().calories} kcal</h4>
                      </div>
                      <div className="bg-surface border border-gray-800 rounded-lg px-6 py-4 flex flex-col items-start gap-1">
                        <span className="text-xs font-bold text-textSecondary uppercase tracking-widest">TOTAL PROTEIN</span>
                        <h4 className="text-2xl font-bold text-green-500">{dietTotals().protein}g</h4>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {diets.map(d => (
                      <div className="bg-surface border border-gray-800 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4" key={d.id}>
                        <div className="flex items-center gap-4">
                          <span className="bg-blue-500/10 text-blue-500 text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider">{d.meal_time}</span>
                          <strong className="text-white text-lg font-medium">{d.meal_description}</strong>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-textSecondary text-sm">Calories: <strong className="text-white">{d.calories}</strong> kcal</span>
                          <div className="w-px h-4 bg-gray-700"></div>
                          <span className="text-textSecondary text-sm">Protein: <strong className="text-white">{d.protein_g}</strong>g</span>
                        </div>
                      </div>
                    ))}
                    {diets.length === 0 && (
                      <div className="bg-surface border border-gray-800 rounded-xl p-12 text-center text-textSecondary font-medium">
                        No nutrition directives prescribed yet. Reach out to your coach.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default MemberDashboard;
