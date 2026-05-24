import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Users, Clipboard, Apple, HelpCircle, LogOut, Plus, 
  Trash2, Check, Send, Award, ShieldAlert,
  Dumbbell, ChevronRight, User, Edit3, Settings, X
} from 'lucide-react';

const WORKOUT_SPLITS = [
  'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Forearm', 'Legs', 'Abs', 'Full Body',
  'Chest + Triceps', 'Back + Biceps', 'Shoulders + Forearm', 'Legs + Abs'
];

const MUSCLE_CATEGORIES = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Forearm', 'Legs', 'Abs', 'Full Body'];

const INITIAL_EXERCISE_LIBRARY = [
  { id: 'e1', name: 'Bench Press', category: 'Chest', description: 'Standard barbell press for overall chest development' },
  { id: 'e2', name: 'Incline Dumbbell Press', category: 'Chest', description: 'Focuses on the upper pectoral muscles' },
  { id: 'e3', name: 'Chest Fly', category: 'Chest', description: 'Isolation movement for chest width' },
  { id: 'e4', name: 'Push Ups', category: 'Chest', description: 'Bodyweight chest and core builder' },
  { id: 'e5', name: 'Tricep Pushdown', category: 'Triceps', description: 'Cable isolation for triceps' },
  { id: 'e6', name: 'Skull Crusher', category: 'Triceps', description: 'Lying triceps extension' },
  { id: 'e7', name: 'Dips', category: 'Triceps', description: 'Bodyweight compound for triceps and chest' },
  { id: 'e8', name: 'Overhead Extension', category: 'Triceps', description: 'Targets the long head of the triceps' },
  { id: 'e9', name: 'Lat Pulldown', category: 'Back', description: 'Vertical pulling movement for lats' },
  { id: 'e10', name: 'Deadlift', category: 'Back', description: 'Heavy compound lift for posterior chain' },
  { id: 'e11', name: 'Barbell Row', category: 'Back', description: 'Horizontal pull for mid-back thickness' },
  { id: 'e12', name: 'Pull Up', category: 'Back', description: 'Bodyweight vertical pull' },
  { id: 'e13', name: 'Seated Row', category: 'Back', description: 'Cable horizontal pull' },
  { id: 'e14', name: 'Barbell Curl', category: 'Biceps', description: 'Heavy bicep isolation' },
  { id: 'e15', name: 'Dumbbell Curl', category: 'Biceps', description: 'Unilateral bicep work' },
  { id: 'e16', name: 'Hammer Curl', category: 'Biceps', description: 'Targets brachialis and forearms' },
  { id: 'e17', name: 'Preacher Curl', category: 'Biceps', description: 'Strict bicep isolation' },
  { id: 'e18', name: 'Overhead Press', category: 'Shoulders', description: 'Vertical pushing for shoulders' },
  { id: 'e19', name: 'Lateral Raise', category: 'Shoulders', description: 'Isolation for side deltoids' },
  { id: 'e20', name: 'Front Raise', category: 'Shoulders', description: 'Isolation for front deltoids' },
  { id: 'e21', name: 'Reverse Pec Deck', category: 'Shoulders', description: 'Rear deltoid isolation' },
  { id: 'e22', name: 'Wrist Curl', category: 'Forearm', description: 'Forearm flexors isolation' },
  { id: 'e23', name: 'Reverse Wrist Curl', category: 'Forearm', description: 'Forearm extensors isolation' },
  { id: 'e24', name: 'Squats', category: 'Legs', description: 'King of all leg exercises' },
  { id: 'e25', name: 'Leg Press', category: 'Legs', description: 'Machine-based heavy leg builder' },
  { id: 'e26', name: 'Lunges', category: 'Legs', description: 'Unilateral leg movement' },
  { id: 'e27', name: 'Leg Extension', category: 'Legs', description: 'Quad isolation' },
  { id: 'e28', name: 'Hamstring Curl', category: 'Legs', description: 'Hamstring isolation' },
  { id: 'e29', name: 'Crunches', category: 'Abs', description: 'Basic abdominal flexion' },
  { id: 'e30', name: 'Plank', category: 'Abs', description: 'Core stabilization' },
  { id: 'e31', name: 'Leg Raises', category: 'Abs', description: 'Lower abdominal focus' },
  { id: 'e32', name: 'Burpees', category: 'Full Body', description: 'Full body conditioning' },
  { id: 'e33', name: 'Kettlebell Swings', category: 'Full Body', description: 'Explosive hip hinge' }
];

const TrainerDashboard = () => {
  const { trainer, logoutTrainer, getAuthHeaders } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [clients, setClients] = useState([]);
  const [supportQueries, setSupportQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedClient, setSelectedClient] = useState(null);
  const [clientWorkouts, setClientWorkouts] = useState([]);
  const [clientDiets, setClientDiets] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Advanced Workout Form State
  const [workoutDraft, setWorkoutDraft] = useState({
    day_of_week: 'Monday',
    split: 'Chest + Triceps',
    selected_exercises: {} // { exId: { sets: '3', reps: '10-12', notes: '' } }
  });

  // Exercise Library State
  const [exerciseLibrary, setExerciseLibrary] = useState(() => {
    const saved = localStorage.getItem('fitcore_exercise_library');
    return saved ? JSON.parse(saved) : INITIAL_EXERCISE_LIBRARY;
  });

  const [showExerciseManager, setShowExerciseManager] = useState(false);
  const [editingEx, setEditingEx] = useState(null);
  const [exForm, setExForm] = useState({ name: '', category: 'Chest', description: '' });

  const [showInlineForm, setShowInlineForm] = useState(false);
  const [inlineExForm, setInlineExForm] = useState({ 
    id: '', name: '', category: '', sets: '', reps: '', notes: '' 
  });

  // Add Diet Form State
  const [dietForm, setDietForm] = useState({
    meal_time: 'Breakfast', meal_description: '', calories: '', protein_g: ''
  });

  const [supportForm, setSupportForm] = useState({ subject: '', message: '' });

  async function fetchDashboardData() {
    setLoading(true);
    setError('');
    try {
      const headers = getAuthHeaders('trainer');
      const [clientsRes, queriesRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/trainers/me/members`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL}/support/trainer/me`, { headers })
      ]);

      setClients(clientsRes.data);
      setSupportQueries(queriesRes.data);
    } catch (err) {
      setError('Failed to fetch data from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!trainer) {
      navigate('/trainer/login');
      return;
    }
    fetchDashboardData();
  }, [trainer]);

  useEffect(() => {
    localStorage.setItem('fitcore_exercise_library', JSON.stringify(exerciseLibrary));
  }, [exerciseLibrary]);



  const handleSelectClient = async (client) => {
    setSelectedClient(client);
    setLoadingDetails(true);
    try {
      const headers = getAuthHeaders('trainer');
      const [workoutsRes, dietsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/workout/member/${client.id}`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL}/diet/member/${client.id}`, { headers })
      ]);
      setClientWorkouts(workoutsRes.data);
      setClientDiets(dietsRes.data);
    } catch (err) {
      alert('Error fetching client details');
    } finally {
      setLoadingDetails(false);
    }
  };

  // ------------------- WORKOUT DRAFT LOGIC -------------------

  const handleToggleDraftExercise = (exId) => {
    const newSelected = { ...workoutDraft.selected_exercises };
    if (newSelected[exId]) {
      delete newSelected[exId];
    } else {
      const ex = exerciseLibrary.find(e => e.id === exId) || {};
      newSelected[exId] = { sets: ex.sets || '3', reps: ex.reps || '10-12', notes: ex.notes || '' };
    }
    setWorkoutDraft({ ...workoutDraft, selected_exercises: newSelected });
  };

  const handleDraftFieldChange = (exId, field, value) => {
    setWorkoutDraft({
      ...workoutDraft,
      selected_exercises: {
        ...workoutDraft.selected_exercises,
        [exId]: { ...workoutDraft.selected_exercises[exId], [field]: value }
      }
    });
  };

  const submitDraftWorkout = async (e) => {
    e.preventDefault();
    if (!selectedClient) return;
    const exIds = Object.keys(workoutDraft.selected_exercises);
    if (exIds.length === 0) return alert('Please select at least one exercise to assign.');

    try {
      const headers = getAuthHeaders('trainer');
      const newWorkouts = [];
      
      for (const exId of exIds) {
        const exDef = exerciseLibrary.find(e => e.id === exId);
        const details = workoutDraft.selected_exercises[exId];
        
        const payload = {
          day_of_week: workoutDraft.day_of_week,
          muscle_group: workoutDraft.split,
          exercise_name: exDef.name,
          sets: details.sets,
          reps: details.reps,
          notes: details.notes
        };

        const res = await axios.post(`${import.meta.env.VITE_API_URL}/workout/member/${selectedClient.id}`, payload, { headers });
        newWorkouts.push(res.data);
      }
      
      setClientWorkouts([...clientWorkouts, ...newWorkouts]);
      setWorkoutDraft({ ...workoutDraft, selected_exercises: {} });
    } catch (err) {
      alert('Error assigning workout plan');
    }
  };

  const deleteWorkout = async (id) => {
    if (!window.confirm('Delete this exercise from plan?')) return;
    try {
      const headers = getAuthHeaders('trainer');
      await axios.delete(`${import.meta.env.VITE_API_URL}/workout/${id}`, { headers });
      setClientWorkouts(clientWorkouts.filter(w => w.id !== id));
    } catch (err) {
      alert('Error deleting workout');
    }
  };

  // ------------------- EXERCISE MANAGER LOGIC -------------------

  const saveExercise = () => {
    if (!exForm.name || !exForm.category) return;
    
    if (editingEx) {
      setExerciseLibrary(exerciseLibrary.map(e => e.id === editingEx.id ? { ...e, ...exForm } : e));
    } else {
      setExerciseLibrary([...exerciseLibrary, { id: 'ex_'+Date.now(), ...exForm }]);
    }
    setEditingEx(null);
    setExForm({ name: '', category: 'Chest', description: '' });
  };

  const deleteExercise = (id) => {
    if (!window.confirm('Delete this exercise from library?')) return;
    setExerciseLibrary(exerciseLibrary.filter(e => e.id !== id));
  };

  const editExercise = (ex) => {
    setEditingEx(ex);
    setExForm({ name: ex.name, category: ex.category, description: ex.description || '' });
  };

  const handleSaveInlineExercise = () => {
    if (!inlineExForm.name || !inlineExForm.category) return;
    if (inlineExForm.id) {
      setExerciseLibrary(exerciseLibrary.map(e => e.id === inlineExForm.id ? { ...inlineExForm } : e));
    } else {
      setExerciseLibrary([...exerciseLibrary, { ...inlineExForm, id: 'ex_' + Date.now() }]);
    }
    setShowInlineForm(false);
  };

  // ------------------- DIET & SUPPORT LOGIC -------------------

  const addDiet = async (e) => {
    e.preventDefault();
    if (!selectedClient) return;
    try {
      const headers = getAuthHeaders('trainer');
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/diet/member/${selectedClient.id}`, dietForm, { headers });
      setClientDiets([...clientDiets, res.data]);
      setDietForm({ meal_time: dietForm.meal_time, meal_description: '', calories: '', protein_g: '' });
    } catch (err) {
      alert('Error logging meal');
    }
  };

  const deleteDiet = async (id) => {
    if (!window.confirm('Delete this meal from protocol?')) return;
    try {
      const headers = getAuthHeaders('trainer');
      await axios.delete(`${import.meta.env.VITE_API_URL}/diet/${id}`, { headers });
      setClientDiets(clientDiets.filter(d => d.id !== id));
    } catch (err) {
      alert('Error deleting meal');
    }
  };

  const submitQuery = async (e) => {
    e.preventDefault();
    try {
      const headers = getAuthHeaders('trainer');
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/support`, supportForm, { headers });
      setSupportQueries([res.data, ...supportQueries]);
      setSupportForm({ subject: '', message: '' });
    } catch (err) {
      alert('Error submitting query');
    }
  };

  const handleLogout = () => {
    logoutTrainer();
    navigate('/trainer/login');
  };

  const groupedWorkouts = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const grouped = {};
    days.forEach(d => grouped[d] = []);
    (clientWorkouts || []).forEach(w => {
      if (w && w.day_of_week && grouped[w.day_of_week]) {
        grouped[w.day_of_week].push(w);
      }
    });
    return grouped;
  };

  // ------------------- RENDER HELPERS -------------------

  // Filter exercises based on current selected split
  const currentSplitCategories = (workoutDraft.split || '').split(' + ');
  const availableExercises = (exerciseLibrary || []).filter(ex => currentSplitCategories.includes(ex.category));

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-textPrimary overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface border-b md:border-b-0 md:border-r border-gray-800 flex flex-col z-10 shrink-0">
        <div className="p-4 md:p-6 flex justify-between items-center text-2xl font-heading font-extrabold text-white border-b border-gray-800">
          <span className="flex items-center gap-2"><span className="text-primary">⚡</span> FITCORE</span>
        </div>
        <nav className="flex-none md:flex-1 py-4 md:py-6 flex flex-row md:flex-col gap-2 px-4 overflow-x-auto no-scrollbar whitespace-nowrap">
          <button 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'overview' ? 'bg-primary/10 text-primary' : 'text-textSecondary hover:text-white hover:bg-gray-800/50'}`}
            onClick={() => setActiveTab('overview')}
          >
            <Award size={18} /> Overview
          </button>
          <button 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'clients' ? 'bg-primary/10 text-primary' : 'text-textSecondary hover:text-white hover:bg-gray-800/50'}`}
            onClick={() => setActiveTab('clients')}
          >
            <Users size={18} /> My Athletes
          </button>
          <button 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'support' ? 'bg-primary/10 text-primary' : 'text-textSecondary hover:text-white hover:bg-gray-800/50'}`}
            onClick={() => setActiveTab('support')}
          >
            <HelpCircle size={18} /> Support HQ
          </button>
          <div className="md:mt-auto ml-auto md:ml-0">
            <button className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-500 hover:bg-red-500/10 transition-all" onClick={handleLogout}>
              <LogOut size={18} /> <span className="hidden md:inline">Log Out</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative z-0">
        <header className="bg-surface border-b border-gray-800 p-6 flex justify-between items-center sticky top-0 z-20 shadow-md">
          <h2 className="text-xl font-bold text-white tracking-widest uppercase">COACH PORTAL</h2>
          <div className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-full text-sm font-bold tracking-wider flex items-center gap-2">
            <ShieldAlert size={16} /> COACH: {trainer?.user?.name || 'Authorized Access'}
          </div>
        </header>

        {loading ? (
          <div className="min-h-screen flex flex-col items-center justify-center p-20">
            <span className="text-4xl text-primary animate-pulse mb-4">⚡</span>
            <p className="text-textSecondary font-heading font-bold tracking-widest text-lg uppercase">Syncing Roster...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-4 rounded-lg m-8 text-center font-medium">
            {error}
          </div>
        ) : (
          <div className="p-8">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-surface to-gray-900 border border-gray-800 rounded-xl p-8 mb-6">
                  <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase mb-2">WELCOME BACK, COACH {trainer?.user?.name?.split(' ')[0]}!</h1>
                  <p className="text-textSecondary">Manage your assigned athletes, design highly optimized protocols, and track progression.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-surface border border-gray-800 rounded-xl p-6 flex items-center gap-5 cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setActiveTab('clients')}>
                    <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Users size={28} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-textSecondary uppercase tracking-widest mb-1">TOTAL ATHLETES</p>
                      <h3 className="text-3xl font-bold text-white">{clients.length}</h3>
                    </div>
                  </div>
                </div>

                <div className="bg-surface border border-gray-800 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6 uppercase">RECENTLY ASSIGNED ATHLETES</h3>
                  <div className="space-y-3">
                    {clients.slice(0, 5).map(c => (
                      <div className="flex items-center justify-between p-4 bg-background border border-gray-800 rounded-lg hover:border-gray-600 transition-colors cursor-pointer" key={c.id} onClick={() => { setActiveTab('clients'); handleSelectClient(c); }}>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-heading font-bold text-xl">
                            {(c.name || 'U').charAt(0)}
                          </div>
                          <div>
                            <strong className="text-white block">{c.name || 'Unknown'}</strong>
                            <span className="text-xs text-textSecondary font-medium">{c.goal || 'General'} • {c.category || 'Member'}</span>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-gray-500" />
                      </div>
                    ))}
                    {clients.length === 0 && (
                      <p className="text-textSecondary text-sm text-center py-6">No athletes currently assigned to your roster.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* CLIENTS TAB */}
            {activeTab === 'clients' && (
              <div className="flex flex-col lg:flex-row gap-8 lg:h-[calc(100vh-160px)]">
                
                {/* Roster List */}
                <div className="w-full lg:w-1/3 flex flex-col bg-surface border border-gray-800 rounded-xl overflow-hidden">
                  <div className="p-5 border-b border-gray-800 bg-gray-900/50">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
                      <Clipboard size={18} className="text-primary" />
                      Athletes Roster
                    </h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                          {clients.map(c => (
                      <div 
                        key={c.id} 
                        className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${selectedClient?.id === c.id ? 'bg-primary/5 border-primary' : 'bg-background border-gray-800 hover:border-gray-600'}`}
                        onClick={() => handleSelectClient(c)}
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-heading font-bold text-xl shrink-0">
                          {(c.name || 'U').charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                          <strong className={`block truncate ${selectedClient?.id === c.id ? 'text-primary' : 'text-white'}`}>{c.name || 'Unknown'}</strong>
                          <span className="text-xs text-textSecondary truncate block">{c.goal || 'General Fitness'}</span>
                        </div>
                      </div>
                    ))}
                    {clients.length === 0 && (
                      <p className="text-textSecondary text-sm text-center py-6">Roster is empty.</p>
                    )}
                  </div>
                </div>

                {/* Client Details & Protocol Editor */}
                <div className="w-full lg:w-2/3 flex flex-col bg-surface border border-gray-800 rounded-xl overflow-hidden relative">
                  {!selectedClient ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-textSecondary p-10 text-center">
                      <User size={64} className="mb-6 opacity-20" />
                      <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-2">No Athlete Selected</h3>
                      <p className="text-sm max-w-xs mx-auto">Select an athlete from your roster to view details and assign training and diet protocols.</p>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
                      {/* Athlete Header */}
                      <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-surface sticky top-0 z-10">
                        <div className="flex justify-between items-start">
                          <div>
                            <h2 className="text-2xl font-extrabold text-white tracking-tight uppercase mb-1">{selectedClient.name}</h2>
                            <p className="text-sm text-textSecondary">
                              Goal Focus: <span className="text-primary font-bold">{selectedClient.goal}</span> | Member Class: <strong className="text-gray-300">{selectedClient.category}</strong>
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase block">Plan: {selectedClient.plan?.name || 'Active'}</span>
                            <p className="text-xs text-textSecondary mt-2">Ends on {selectedClient.membership_end}</p>
                          </div>
                        </div>
                      </div>

                      {loadingDetails ? (
                        <div className="bg-surface border border-gray-800 rounded-xl p-12 flex flex-col items-center justify-center">
                          <span className="text-3xl text-primary animate-pulse mb-3">⚡</span>
                          <p className="text-textSecondary font-bold tracking-widest text-sm">RETRIEVING CLIENT PLANS...</p>
                        </div>
                      ) : (
                        <div className="p-6 space-y-8">

                          {/* ------------------- ADVANCED WORKOUT SPLIT MODULE ------------------- */}
                          <div className="bg-background border border-gray-800 rounded-xl overflow-hidden shadow-lg">
                            <div className="flex items-center justify-between p-5 border-b border-gray-800 bg-surface">
                              <div className="flex items-center gap-3">
                                <Dumbbell size={20} className="text-primary" />
                                <h3 className="text-lg font-bold text-white uppercase tracking-wide">Workout Split</h3>
                              </div>
                              <button 
                                onClick={() => setShowExerciseManager(true)}
                                className="bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-2 tracking-wider"
                              >
                                <Settings size={14} /> MANAGE EXERCISES
                              </button>
                            </div>

                            {/* Existing Workout Schedule */}
                            <div className="p-6 border-b border-gray-800">
                              <h4 className="text-xs font-bold text-textSecondary tracking-widest uppercase mb-4">Assigned Exercises</h4>
                              {clientWorkouts.length > 0 ? (
                                <div className="space-y-4">
                                  {Object.entries(groupedWorkouts()).filter(([, list]) => list.length > 0).map(([day, list]) => (
                                    <div key={day} className="bg-surface rounded-lg border border-gray-800 p-4">
                                      <h5 className="text-primary font-bold mb-3 uppercase tracking-wider">{day}</h5>
                                      <div className="space-y-2">
                                        {list.map(w => (
                                          <div className="flex items-center justify-between bg-background border border-gray-800 rounded p-3" key={w.id}>
                                            <div className="flex-1">
                                              <div className="flex items-center gap-2 mb-1">
                                                <strong className="text-white font-bold">{w.exercise_name}</strong>
                                                {w.muscle_group && <span className="bg-gray-800 text-gray-400 text-[10px] px-2 py-0.5 rounded uppercase tracking-widest font-bold">{w.muscle_group}</span>}
                                              </div>
                                              <div className="text-xs text-textSecondary flex items-center gap-4">
                                                <span><strong className="text-white">{w.sets}</strong> Sets</span>
                                                <span><strong className="text-white">{w.reps}</strong> Reps</span>
                                              </div>
                                              {w.notes && (
                                                <p className="text-xs text-gray-500 mt-1.5 italic">Note: {w.notes}</p>
                                              )}
                                            </div>
                                            <button className="text-gray-600 hover:text-red-500 p-2 rounded transition-colors ml-4" onClick={() => deleteWorkout(w.id)}>
                                              <Trash2 size={16} />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-6 bg-surface border border-gray-800 border-dashed rounded-lg">
                                  <p className="text-sm text-textSecondary">No exercises prescribed yet.</p>
                                </div>
                              )}
                            </div>

                            {/* New Workout Assignment Flow */}
                            <div className="p-6 bg-surface">
                              <h4 className="text-xs font-bold text-textSecondary tracking-widest uppercase mb-4">Assign New Exercises</h4>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-xs font-bold text-textSecondary uppercase tracking-widest">Day</label>
                                  <select 
                                    className="bg-background border border-gray-700 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                    value={workoutDraft.day_of_week}
                                    onChange={(e) => setWorkoutDraft({ ...workoutDraft, day_of_week: e.target.value })}
                                  >
                                    {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => <option key={d} value={d}>{d}</option>)}
                                  </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-xs font-bold text-textSecondary uppercase tracking-widest">Workout Split</label>
                                  <select 
                                    className="bg-background border border-gray-700 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                    value={workoutDraft.split}
                                    onChange={(e) => setWorkoutDraft({ ...workoutDraft, split: e.target.value, selected_exercises: {} })}
                                  >
                                    {WORKOUT_SPLITS.map(split => <option key={split} value={split}>{split}</option>)}
                                  </select>
                                </div>
                              </div>

                              <div className="border border-gray-800 rounded-lg overflow-hidden bg-background">
                                <div className="p-3 bg-gray-900 border-b border-gray-800 flex justify-between items-center">
                                  <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Available Exercises ({workoutDraft.split})</span>
                                  <button 
                                    onClick={() => {
                                      setInlineExForm({ id: '', name: '', category: currentSplitCategories[0] || 'Chest', sets: '', reps: '', notes: '' });
                                      setShowInlineForm(!showInlineForm);
                                    }}
                                    className="text-primary hover:text-primaryHover text-xs font-bold flex items-center gap-1 uppercase tracking-widest"
                                  >
                                    <Plus size={14} /> Add Exercise
                                  </button>
                                </div>
                                {showInlineForm && (
                                  <div className="p-4 bg-surface border-b border-gray-800">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                      <div className="flex flex-col gap-1 col-span-2">
                                        <label className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">Exercise Name</label>
                                        <input type="text" className="bg-background border border-gray-700 text-white px-2 py-1.5 rounded focus:outline-none focus:border-primary text-xs" value={inlineExForm.name} onChange={(e) => setInlineExForm({...inlineExForm, name: e.target.value})} placeholder="e.g. Bench Press" />
                                      </div>
                                      <div className="flex flex-col gap-1 col-span-2">
                                        <label className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">Muscle Group</label>
                                        <select className="bg-background border border-gray-700 text-white px-2 py-1.5 rounded focus:outline-none focus:border-primary text-xs" value={inlineExForm.category} onChange={(e) => setInlineExForm({...inlineExForm, category: e.target.value})}>
                                          {MUSCLE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                      </div>
                                      <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">Sets</label>
                                        <input type="number" className="bg-background border border-gray-700 text-white px-2 py-1.5 rounded focus:outline-none focus:border-primary text-xs" value={inlineExForm.sets} onChange={(e) => setInlineExForm({...inlineExForm, sets: e.target.value})} placeholder="e.g. 4" />
                                      </div>
                                      <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">Reps</label>
                                        <input type="text" className="bg-background border border-gray-700 text-white px-2 py-1.5 rounded focus:outline-none focus:border-primary text-xs" value={inlineExForm.reps} onChange={(e) => setInlineExForm({...inlineExForm, reps: e.target.value})} placeholder="e.g. 8-12" />
                                      </div>
                                      <div className="flex flex-col gap-1 col-span-2">
                                        <label className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">Notes</label>
                                        <input type="text" className="bg-background border border-gray-700 text-white px-2 py-1.5 rounded focus:outline-none focus:border-primary text-xs placeholder-gray-600" value={inlineExForm.notes} onChange={(e) => setInlineExForm({...inlineExForm, notes: e.target.value})} placeholder="Optional notes" />
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <button onClick={() => handleSaveInlineExercise()} className="bg-primary text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded hover:bg-primaryHover transition-colors">Save Exercise</button>
                                      <button onClick={() => setShowInlineForm(false)} className="bg-gray-700 text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded hover:bg-gray-600 transition-colors">Cancel</button>
                                    </div>
                                  </div>
                                )}
                                <div className="max-h-64 overflow-y-auto no-scrollbar p-2 space-y-2">
                                  {availableExercises.map(ex => {
                                    const isSelected = !!workoutDraft.selected_exercises[ex.id];
                                    return (
                                      <div key={ex.id} className={`border rounded-lg p-3 transition-colors ${isSelected ? 'border-primary bg-primary/5' : 'border-gray-800 bg-surface'}`}>
                                        <div className="flex justify-between items-start">
                                          <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => handleToggleDraftExercise(ex.id)}>
                                            <div className={`w-5 h-5 rounded flex items-center justify-center border ${isSelected ? 'bg-primary border-primary text-white' : 'border-gray-600'}`}>
                                              {isSelected && <Check size={14} />}
                                            </div>
                                            <div>
                                              <strong className="text-white text-sm">{ex.name}</strong>
                                              <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">{ex.category}</div>
                                            </div>
                                          </div>
                                          <div className="flex gap-1 shrink-0 ml-4">
                                            <button 
                                              onClick={(e) => { e.stopPropagation(); setInlineExForm({ id: ex.id, name: ex.name, category: ex.category, sets: ex.sets || '', reps: ex.reps || '', notes: ex.notes || '' }); setShowInlineForm(true); }}
                                              className="text-blue-400 hover:bg-blue-400/10 p-1.5 rounded transition-colors"
                                              title="Edit Exercise"
                                            >
                                              <Edit3 size={14} />
                                            </button>
                                            <button 
                                              onClick={(e) => { e.stopPropagation(); deleteExercise(ex.id); }}
                                              className="text-red-500 hover:bg-red-500/10 p-1.5 rounded transition-colors"
                                              title="Delete Exercise"
                                            >
                                              <Trash2 size={14} />
                                            </button>
                                          </div>
                                        </div>
                                        
                                        {isSelected && (
                                          <div className="mt-4 pt-3 border-t border-gray-800 grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <div className="flex flex-col gap-1">
                                              <label className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">Sets</label>
                                              <input 
                                                type="number" 
                                                className="bg-background border border-gray-700 text-white px-2 py-1.5 rounded focus:outline-none focus:border-primary text-xs"
                                                value={workoutDraft.selected_exercises[ex.id].sets}
                                                onChange={(e) => handleDraftFieldChange(ex.id, 'sets', e.target.value)}
                                                placeholder="e.g. 4"
                                              />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                              <label className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">Reps</label>
                                              <input 
                                                type="text" 
                                                className="bg-background border border-gray-700 text-white px-2 py-1.5 rounded focus:outline-none focus:border-primary text-xs"
                                                value={workoutDraft.selected_exercises[ex.id].reps}
                                                onChange={(e) => handleDraftFieldChange(ex.id, 'reps', e.target.value)}
                                                placeholder="e.g. 8-12"
                                              />
                                            </div>
                                            <div className="flex flex-col gap-1 col-span-2">
                                              <label className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">Notes</label>
                                              <input 
                                                type="text" 
                                                className="bg-background border border-gray-700 text-white px-2 py-1.5 rounded focus:outline-none focus:border-primary text-xs placeholder-gray-600"
                                                value={workoutDraft.selected_exercises[ex.id].notes}
                                                onChange={(e) => handleDraftFieldChange(ex.id, 'notes', e.target.value)}
                                                placeholder="Optional notes"
                                              />
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                  {availableExercises.length === 0 && (
                                    <div className="text-center py-6 text-sm text-textSecondary">
                                      No exercises found for this split. Use 'Manage Exercises' to add some.
                                    </div>
                                  )}
                                </div>
                              </div>

                              <button 
                                onClick={submitDraftWorkout}
                                className="w-full mt-4 bg-primary text-white font-heading font-bold tracking-wider py-3.5 rounded-lg hover:bg-primaryHover transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(232,85,62,0.3)] disabled:opacity-50"
                                disabled={Object.keys(workoutDraft.selected_exercises).length === 0}
                              >
                                <Plus size={18} /> SAVE WORKOUT PLAN
                              </button>
                            </div>
                          </div>

                          {/* Diet Designer */}
                          <div className="bg-surface border border-gray-800 rounded-xl p-6 flex flex-col shadow-lg">
                            <div className="flex items-center gap-2 mb-6 border-b border-gray-800 pb-4">
                              <Apple size={20} className="text-primary" />
                              <h3 className="text-lg font-bold text-white uppercase tracking-wide">Meal Protocol</h3>
                            </div>

                            <div className="flex-1 overflow-y-auto no-scrollbar max-h-64 mb-6 pr-2 space-y-3">
                              {clientDiets.map(d => (
                                <div className="flex items-center justify-between bg-background border border-gray-800 rounded-lg p-3" key={d.id}>
                                  <div>
                                    <span className="bg-blue-500/10 text-blue-500 text-xs font-bold px-2 py-1 rounded uppercase mr-3">{d.meal_time}</span>
                                    <strong className="text-white text-sm">{d.meal_description}</strong>
                                    <div className="text-xs text-textSecondary mt-1">{d.calories} kcal • {d.protein_g}g Protein</div>
                                  </div>
                                  <button className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-md transition-colors" onClick={() => deleteDiet(d.id)}>
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              ))}
                              {clientDiets.length === 0 && (
                                <p className="text-textSecondary text-sm text-center py-6">No meal guidelines logged.</p>
                              )}
                            </div>

                            <form onSubmit={addDiet} className="mt-auto border-t border-gray-800 pt-6">
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-xs font-bold text-textSecondary uppercase tracking-widest">Period</label>
                                  <select 
                                    className="bg-background border border-gray-700 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
                                    value={dietForm.meal_time}
                                    onChange={(e) => setDietForm({ ...dietForm, meal_time: e.target.value })}
                                  >
                                    {['Breakfast','Lunch','Dinner','Snack'].map(p => (
                                      <option key={p} value={p}>{p}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-xs font-bold text-textSecondary uppercase tracking-widest">Food</label>
                                  <input 
                                    type="text" 
                                    className="bg-background border border-gray-700 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
                                    placeholder="Oatmeal + Egg whites" 
                                    value={dietForm.meal_description}
                                    onChange={(e) => setDietForm({ ...dietForm, meal_description: e.target.value })}
                                    required 
                                  />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-xs font-bold text-textSecondary uppercase tracking-widest">Calories</label>
                                  <input 
                                    type="number" 
                                    className="bg-background border border-gray-700 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
                                    placeholder="350" 
                                    value={dietForm.calories}
                                    onChange={(e) => setDietForm({ ...dietForm, calories: e.target.value })}
                                    required 
                                  />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-xs font-bold text-textSecondary uppercase tracking-widest">Protein (g)</label>
                                  <input 
                                    type="number" 
                                    className="bg-background border border-gray-700 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
                                    placeholder="30" 
                                    value={dietForm.protein_g}
                                    onChange={(e) => setDietForm({ ...dietForm, protein_g: e.target.value })}
                                    required 
                                  />
                                </div>
                              </div>
                              <button type="submit" className="w-full bg-blue-600 text-white font-heading font-bold tracking-wider py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                <Plus size={16} /> LOG MEAL
                              </button>
                            </form>
                          </div>

                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SUPPORT TAB */}
            {activeTab === 'support' && (
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-surface border border-gray-800 rounded-xl p-8 shadow-lg">
                  <h2 className="text-2xl font-extrabold text-white tracking-tight uppercase mb-6 flex items-center gap-3">
                    <Send size={24} className="text-primary" /> Create Support Query
                  </h2>
                  <form onSubmit={submitQuery} className="space-y-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-textSecondary uppercase tracking-widest">Subject</label>
                      <input 
                        type="text" 
                        className="bg-background border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary font-medium"
                        placeholder="E.g. Issue with logging member attendance" 
                        value={supportForm.subject}
                        onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                        required 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-textSecondary uppercase tracking-widest">Message</label>
                      <textarea 
                        className="bg-background border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary font-medium min-h-[120px] resize-y"
                        placeholder="Detail the problem..." 
                        value={supportForm.message}
                        onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                        required 
                      ></textarea>
                    </div>
                    <button type="submit" className="bg-primary text-white font-heading font-bold tracking-wider py-3.5 px-8 rounded-lg hover:bg-primaryHover transition-all flex items-center gap-2 shadow-[0_4px_14px_rgba(232,85,62,0.3)]">
                      <Send size={18} /> SUBMIT QUERY
                    </button>
                  </form>
                </div>

                <div className="bg-surface border border-gray-800 rounded-xl p-8 shadow-lg">
                  <h3 className="text-xl font-bold text-white mb-6 uppercase">My Support History</h3>
                  <div className="space-y-4">
                    {supportQueries.map(q => (
                      <div className="bg-background border border-gray-800 p-5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4" key={q.id}>
                        <div>
                          <h4 className="text-white font-bold text-lg mb-1">{q.subject}</h4>
                          <p className="text-textSecondary text-sm">{q.message}</p>
                          <span className="text-xs text-gray-500 mt-2 block">{new Date(q.created_at).toLocaleString()}</span>
                        </div>
                        <div className="shrink-0">
                          <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase ${q.status === 'resolved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                            {q.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {supportQueries.length === 0 && (
                      <p className="text-textSecondary text-center py-8">No past support requests.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* EXERCISE MANAGER MODAL */}
      {showExerciseManager && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-surface border border-gray-800 w-full max-w-3xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gray-900/50">
              <h2 className="text-xl font-extrabold text-white uppercase tracking-widest flex items-center gap-3">
                <Settings size={20} className="text-primary" /> EXERCISE MANAGEMENT
              </h2>
              <button className="text-gray-500 hover:text-white transition-colors" onClick={() => setShowExerciseManager(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
              {/* Form Section */}
              <div className="w-full md:w-1/3 p-6 border-b md:border-b-0 md:border-r border-gray-800 bg-surface flex flex-col">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">{editingEx ? 'Edit Exercise' : 'Create Custom Exercise'}</h3>
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-textSecondary uppercase tracking-widest">Exercise Name</label>
                    <input 
                      type="text" 
                      className="bg-background border border-gray-700 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                      placeholder="e.g. Hex Press" 
                      value={exForm.name}
                      onChange={(e) => setExForm({ ...exForm, name: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-textSecondary uppercase tracking-widest">Muscle Group</label>
                    <select 
                      className="bg-background border border-gray-700 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                      value={exForm.category}
                      onChange={(e) => setExForm({ ...exForm, category: e.target.value })}
                    >
                      {MUSCLE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-textSecondary uppercase tracking-widest">Description (Optional)</label>
                    <textarea 
                      className="bg-background border border-gray-700 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm min-h-[80px]"
                      placeholder="e.g. Press dumbbells together to activate inner chest" 
                      value={exForm.description}
                      onChange={(e) => setExForm({ ...exForm, description: e.target.value })}
                    ></textarea>
                  </div>
                  
                  <div className="pt-2 flex gap-3">
                    <button 
                      onClick={saveExercise}
                      className="flex-1 bg-primary text-white font-bold text-xs py-3 rounded-lg hover:bg-primaryHover transition-colors uppercase tracking-widest disabled:opacity-50"
                      disabled={!exForm.name}
                    >
                      {editingEx ? 'Update' : 'Add'}
                    </button>
                    {editingEx && (
                      <button 
                        onClick={() => { setEditingEx(null); setExForm({ name: '', category: 'Chest', description: '' }); }}
                        className="flex-1 bg-gray-800 text-white font-bold text-xs py-3 rounded-lg hover:bg-gray-700 transition-colors uppercase tracking-widest"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Library Section */}
              <div className="w-full md:w-2/3 flex flex-col bg-background">
                <div className="p-4 border-b border-gray-800 bg-surface">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">Exercise Library ({exerciseLibrary.length})</h3>
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3 max-h-[50vh] md:max-h-full">
                  {exerciseLibrary.map(ex => (
                    <div key={ex.id} className="flex justify-between items-center bg-surface border border-gray-800 p-4 rounded-lg hover:border-gray-600 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <strong className="text-white font-bold">{ex.name}</strong>
                          <span className="bg-gray-800 text-gray-400 text-[10px] px-2 py-0.5 rounded uppercase tracking-widest font-bold">{ex.category}</span>
                        </div>
                        {ex.description && <p className="text-xs text-textSecondary">{ex.description}</p>}
                      </div>
                      <div className="flex gap-2">
                        <button className="text-blue-400 hover:bg-blue-400/10 p-2 rounded transition-colors" onClick={() => editExercise(ex)}>
                          <Edit3 size={16} />
                        </button>
                        <button className="text-red-500 hover:bg-red-500/10 p-2 rounded transition-colors" onClick={() => deleteExercise(ex.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TrainerDashboard;
