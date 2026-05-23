const express = require('express');
const router = express.Router();
const supabase = require('../supabaseAdmin');
const { verifyToken } = require('../middleware/authMiddleware');

// GET all support queries (Admin only)
router.get('/', verifyToken(['admin']), async (req, res) => {
  try {
    const { data: queries, error } = await supabase
      .from('support_queries')
      .select('*, trainer:trainers(id, name, trainer_id, email)')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ message: 'Error fetching queries', error: error.message });
    }

    res.json(queries);
  } catch (err) {
    console.error('Fetch support queries error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET own trainer queries (Trainer only)
router.get('/trainer/me', verifyToken(['trainer']), async (req, res) => {
  try {
    const { data: queries, error } = await supabase
      .from('support_queries')
      .select('*')
      .eq('from_trainer_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ message: 'Error fetching queries', error: error.message });
    }

    res.json(queries);
  } catch (err) {
    console.error('Fetch trainer support queries error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST submit a support query (Trainer only)
router.post('/', verifyToken(['trainer']), async (req, res) => {
  const { subject, message } = req.body;
  if (!subject || !message) {
    return res.status(400).json({ message: 'Subject and message are required' });
  }

  try {
    const { data: query, error } = await supabase
      .from('support_queries')
      .insert([
        {
          from_trainer_id: req.user.id,
          subject,
          message,
          status: 'open'
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Error creating support query', error: error.message });
    }

    res.status(201).json(query);
  } catch (err) {
    console.error('Submit query error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH resolve support query (Admin only)
router.patch('/:id/resolve', verifyToken(['admin']), async (req, res) => {
  try {
    const { data: query, error } = await supabase
      .from('support_queries')
      .update({ status: 'resolved' })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Error updating query status', error: error.message });
    }

    res.json(query);
  } catch (err) {
    console.error('Resolve query error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
