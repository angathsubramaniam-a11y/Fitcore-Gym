const express = require('express');
const router = express.Router();
const supabase = require('../supabaseAdmin');

// Get all plans
router.get('/', async (req, res) => {
  try {
    const { data: plans, error } = await supabase
      .from('membership_plans')
      .select('*')
      .order('price', { ascending: true });

    if (error) {
      return res.status(500).json({ message: 'Error fetching plans', error: error.message });
    }

    res.json(plans);
  } catch (err) {
    console.error('Fetch plans error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
