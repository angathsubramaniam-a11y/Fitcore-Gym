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

    // Format queries so AdminDashboard displays them correctly
    const formattedQueries = queries.map(q => {
      let role = 'trainer';
      let user_id = q.trainer?.trainer_id || 'Unknown';
      
      // If there's no from_trainer_id, it means it's from a member (based on our new logic)
      if (!q.from_trainer_id) {
        role = 'member';
        // Extract member ID from subject string: "[MEMBER ID -> TARGET] Subject"
        const match = q.subject.match(/\[MEMBER (.*?) ->/);
        user_id = match ? match[1] : 'Unknown Member';
      }

      return { ...q, role, user_id };
    });

    res.json(formattedQueries);
  } catch (err) {
    console.error('Fetch support queries error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET own trainer queries and incoming client queries (Trainer only)
router.get('/trainer/me', verifyToken(['trainer']), async (req, res) => {
  try {
    // 1. Fetch queries sent BY the trainer to the admin
    const { data: sentQueries, error: sentError } = await supabase
      .from('support_queries')
      .select('*')
      .eq('from_trainer_id', req.user.id)
      .order('created_at', { ascending: false });

    if (sentError) {
      return res.status(500).json({ message: 'Error fetching sent queries', error: sentError.message });
    }

    // 2. Fetch queries sent TO the trainer BY their assigned members
    // First, find all members assigned to this trainer
    const { data: members } = await supabase
      .from('members')
      .select('member_id')
      .eq('trainer_id', req.user.id);
      
    let incomingQueries = [];
    if (members && members.length > 0) {
      const memberIds = members.map(m => m.member_id);
      
      // Fetch all member queries directed to TRAINER
      const { data: memberQueries } = await supabase
        .from('support_queries')
        .select('*')
        .is('from_trainer_id', null)
        .like('subject', '%-> TRAINER]%');
        
      if (memberQueries) {
        // Filter in JS to ensure we only get queries from THIS trainer's members
        incomingQueries = memberQueries.filter(q => {
          const match = q.subject.match(/\[MEMBER (.*?) ->/);
          if (match && match[1]) {
            return memberIds.includes(match[1]);
          }
          return false;
        });
      }
    }

    // Combine and sort
    const allQueries = [...sentQueries, ...incomingQueries].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json(allQueries);
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

// POST submit a support query (Member only)
router.post('/member', verifyToken(['member']), async (req, res) => {
  const { subject, message, sendTo } = req.body; // sendTo = 'admin' | 'trainer'
  if (!subject || !message || !sendTo) {
    return res.status(400).json({ message: 'Subject, message, and target are required' });
  }

  try {
    // We prepend the sender info and intended recipient to the subject
    // This allows both Admin and Trainer to see who sent it, without altering the schema
    const fullSubject = `[MEMBER ${req.user.member_id} -> ${sendTo.toUpperCase()}] ${subject}`;

    const { data: query, error } = await supabase
      .from('support_queries')
      .insert([
        {
          subject: fullSubject,
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
