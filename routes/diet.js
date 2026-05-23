const express = require('express');
const router = express.Router();
const supabase = require('../supabaseAdmin');
const { verifyToken } = require('../middleware/authMiddleware');
const crypto = require('crypto');

// GET diet meals for a specific member
router.get('/member/:memberId', verifyToken(['trainer', 'member']), async (req, res) => {
  const memberId = req.params.memberId === 'me' ? req.user.id : req.params.memberId;
  
  if (req.user.role === 'member' && req.user.id !== memberId) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const { data: plans, error } = await supabase
      .from('diet_plans')
      .select('*')
      .eq('member_id', memberId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ message: 'Error fetching diet plans', error: error.message });
    }

    const plan = plans[0];
    res.json(plan && plan.meals ? plan.meals : []);
  } catch (err) {
    console.error('Fetch diet error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create diet meal
router.post('/member/:memberId', verifyToken(['trainer']), async (req, res) => {
  const { memberId } = req.params;
  const { meal_time, meal_description, calories, protein_g } = req.body;

  try {
    let { data: plans } = await supabase
      .from('diet_plans')
      .select('*')
      .eq('member_id', memberId)
      .order('created_at', { ascending: false })
      .limit(1);

    let plan = plans && plans.length > 0 ? plans[0] : null;

    if (!plan) {
      // Create a default plan if none exists
      const { data: newPlan, error: insertError } = await supabase
        .from('diet_plans')
        .insert([{ 
          member_id: memberId, 
          trainer_id: req.user.id, 
          goal: 'General Fitness',
          daily_calories: 2000,
          meals: [] 
        }])
        .select()
        .single();
        
      if (insertError) throw insertError;
      plan = newPlan;
    }

    const newMeal = { 
      id: crypto.randomUUID(), 
      meal_time, 
      meal_description, 
      calories: parseInt(calories, 10), 
      protein_g: parseInt(protein_g, 10) 
    };

    const updatedMeals = [...(plan.meals || []), newMeal];

    const { error: updateError } = await supabase
      .from('diet_plans')
      .update({ meals: updatedMeals })
      .eq('id', plan.id);

    if (updateError) throw updateError;

    res.status(201).json(newMeal);
  } catch (err) {
    console.error('Create diet meal error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE diet meal
router.delete('/:id', verifyToken(['trainer']), async (req, res) => {
  const { id } = req.params;

  try {
    const { data: plans, error } = await supabase
      .from('diet_plans')
      .select('*')
      .eq('trainer_id', req.user.id);

    if (error) throw error;

    let foundPlan = null;
    let updatedMeals = [];

    for (const plan of plans) {
      if (plan.meals && plan.meals.find(m => m.id === id)) {
        foundPlan = plan;
        updatedMeals = plan.meals.filter(m => m.id !== id);
        break;
      }
    }

    if (!foundPlan) {
      return res.status(404).json({ message: 'Meal not found or unauthorized' });
    }

    const { error: updateError } = await supabase
      .from('diet_plans')
      .update({ meals: updatedMeals })
      .eq('id', foundPlan.id);

    if (updateError) throw updateError;

    res.json({ message: 'Meal deleted successfully' });
  } catch (err) {
    console.error('Delete diet error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
