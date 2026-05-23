const express = require('express');
const router = express.Router();
const supabase = require('../supabaseAdmin');
const { verifyToken } = require('../middleware/authMiddleware');
const crypto = require('crypto');

// Helper to get exercises array from a member's latest plan
router.get('/member/:memberId', verifyToken(['trainer', 'member']), async (req, res) => {
  const memberId = req.params.memberId === 'me' ? req.user.id : req.params.memberId;
  
  if (req.user.role === 'member' && req.user.id !== memberId) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const { data: plans, error } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('member_id', memberId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ message: 'Error fetching workout plans', error: error.message });
    }

    const plan = plans[0];
    res.json(plan && plan.days ? plan.days : []);
  } catch (err) {
    console.error('Fetch workout error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create workout exercise
router.post('/member/:memberId', verifyToken(['trainer']), async (req, res) => {
  const { memberId } = req.params;
  const { day_of_week, exercise_name, sets, reps, muscle_group, notes } = req.body;

  try {
    let { data: plans } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('member_id', memberId)
      .order('created_at', { ascending: false })
      .limit(1);

    let plan = plans && plans.length > 0 ? plans[0] : null;

    if (!plan) {
      // Create a default plan if none exists
      const { data: newPlan, error: insertError } = await supabase
        .from('workout_plans')
        .insert([{ 
          member_id: memberId, 
          trainer_id: req.user.id, 
          week_start: new Date().toISOString().split('T')[0], 
          goal: 'General Fitness',
          days: [] 
        }])
        .select()
        .single();
        
      if (insertError) throw insertError;
      plan = newPlan;
    }

    const newExercise = { 
      id: crypto.randomUUID(), 
      day_of_week, 
      muscle_group,
      exercise_name, 
      sets, 
      reps,
      notes
    };

    const updatedDays = [...(plan.days || []), newExercise];

    const { error: updateError } = await supabase
      .from('workout_plans')
      .update({ days: updatedDays })
      .eq('id', plan.id);

    if (updateError) throw updateError;

    res.status(201).json(newExercise);
  } catch (err) {
    console.error('Create workout error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE workout exercise
router.delete('/:id', verifyToken(['trainer']), async (req, res) => {
  const { id } = req.params;

  try {
    // Find the plan containing this exercise
    const { data: plans, error } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('trainer_id', req.user.id);

    if (error) throw error;

    let foundPlan = null;
    let updatedDays = [];

    for (const plan of plans) {
      if (plan.days && plan.days.find(e => e.id === id)) {
        foundPlan = plan;
        updatedDays = plan.days.filter(e => e.id !== id);
        break;
      }
    }

    if (!foundPlan) {
      return res.status(404).json({ message: 'Exercise not found or unauthorized' });
    }

    const { error: updateError } = await supabase
      .from('workout_plans')
      .update({ days: updatedDays })
      .eq('id', foundPlan.id);

    if (updateError) throw updateError;

    res.json({ message: 'Exercise deleted successfully' });
  } catch (err) {
    console.error('Delete workout error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
