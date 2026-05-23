const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const supabase = require('../supabaseAdmin');
const { verifyToken } = require('../middleware/authMiddleware');
const { generateTrainerID } = require('../utils/idGenerator');

// GET all trainers (Admin only)
router.get('/', verifyToken(['admin']), async (req, res) => {
  try {
    const { data: trainers, error } = await supabase
      .from('trainers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ message: 'Error fetching trainers', error: error.message });
    }

    // For each trainer, get their assigned members count
    const { data: members, error: mError } = await supabase
      .from('members')
      .select('trainer_id');

    if (!mError && members) {
      const countMap = {};
      members.forEach(m => {
        if (m.trainer_id) {
          countMap[m.trainer_id] = (countMap[m.trainer_id] || 0) + 1;
        }
      });
      trainers.forEach(t => {
        t.assigned_members_count = countMap[t.id] || 0;
      });
    } else {
      trainers.forEach(t => {
        t.assigned_members_count = 0;
      });
    }

    res.json(trainers);
  } catch (err) {
    console.error('Fetch trainers error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create trainer (Admin only)
router.post('/', verifyToken(['admin']), async (req, res) => {
  const { name, email, phone, specialization, bio, password } = req.body;
  if (!name || !email || !phone || !specialization || !password) {
    return res.status(400).json({ message: 'Name, email, phone, specialization, and password are required' });
  }

  try {
    const trainer_id = await generateTrainerID();
    const password_hash = bcrypt.hashSync(password, 10);

    const { data: newTrainer, error } = await supabase
      .from('trainers')
      .insert([
        {
          trainer_id,
          name,
          email,
          phone,
          password_hash,
          specialization,
          bio: bio || '',
          status: 'active'
        }
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ message: 'Trainer with this email already exists' });
      }
      return res.status(500).json({ message: 'Error creating trainer', error: error.message });
    }

    res.status(201).json(newTrainer);
  } catch (err) {
    console.error('Create trainer error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update trainer (Admin only)
router.put('/:id', verifyToken(['admin']), async (req, res) => {
  const { name, email, phone, specialization, bio, status, password } = req.body;
  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (phone !== undefined) updateData.phone = phone;
  if (specialization !== undefined) updateData.specialization = specialization;
  if (bio !== undefined) updateData.bio = bio;
  if (status !== undefined) updateData.status = status;
  if (password) {
    updateData.password_hash = bcrypt.hashSync(password, 10);
  }

  try {
    const { data: updatedTrainer, error } = await supabase
      .from('trainers')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Error updating trainer', error: error.message });
    }

    res.json(updatedTrainer);
  } catch (err) {
    console.error('Update trainer error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE trainer (Admin only)
router.delete('/:id', verifyToken(['admin']), async (req, res) => {
  try {
    const { error } = await supabase
      .from('trainers')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(500).json({ message: 'Error deleting trainer', error: error.message });
    }

    res.json({ message: 'Trainer deleted successfully' });
  } catch (err) {
    console.error('Delete trainer error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET trainer's assigned clients (Trainer only)
router.get('/me/members', verifyToken(['trainer']), async (req, res) => {
  try {
    const { data: clients, error } = await supabase
      .from('members')
      .select('*, plan:membership_plans(name)')
      .eq('trainer_id', req.user.id);

    if (error) {
      return res.status(500).json({ message: 'Error fetching client roster', error: error.message });
    }

    res.json(clients);
  } catch (err) {
    console.error('Fetch trainer clients error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
