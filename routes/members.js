const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const QRCode = require('qrcode');
const supabase = require('../supabaseAdmin');
const { verifyToken } = require('../middleware/authMiddleware');
const { generateMemberID } = require('../utils/idGenerator');

// GET all members (Admin only)
router.get('/', verifyToken(['admin']), async (req, res) => {
  try {
    const { data: members, error } = await supabase
      .from('members')
      .select('*, trainer:trainers(id, name, trainer_id, specialization), plan:membership_plans(id, name, price, duration_months)')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ message: 'Error fetching members', error: error.message });
    }

    res.json(members);
  } catch (err) {
    console.error('Fetch members error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET currently logged-in member profile (Member only)
router.get('/me', verifyToken(['member']), async (req, res) => {
  try {
    const { data: member, error } = await supabase
      .from('members')
      .select('*, trainer:trainers(id, name, email, phone, specialization, bio), plan:membership_plans(id, name, price, duration_months, features)')
      .eq('id', req.user.id)
      .single();

    if (error || !member) {
      return res.status(404).json({ message: 'Member profile not found' });
    }

    res.json(member);
  } catch (err) {
    console.error('Fetch own member profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create member (Admin only)
router.post('/', verifyToken(['admin']), async (req, res) => {
  const { name, age, phone, email, password, category, goal, trainer_id, plan_id, membership_start, payment_status, payment_method } = req.body;

  if (!name || !age || !phone || !email || !password || !category || !goal || !plan_id) {
    return res.status(400).json({ message: 'Name, age, phone, email, password, category, goal, and plan are required' });
  }

  try {
    // Generate unique member ID
    const member_id = await generateMemberID();
    const password_hash = bcrypt.hashSync(password, 10);

    // Fetch plan details to calculate membership end date
    const { data: plan, error: planError } = await supabase
      .from('membership_plans')
      .select('*')
      .eq('id', plan_id)
      .single();

    if (planError || !plan) {
      return res.status(400).json({ message: 'Invalid membership plan selected' });
    }

    const startDate = membership_start ? new Date(membership_start) : new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + plan.duration_months);

    // Generate base64 QR Code string
    const qrData = JSON.stringify({
      member_id,
      name,
      email,
      status: 'active'
    });
    const qr_code = await QRCode.toDataURL(qrData);

    const { data: newMember, error: insertError } = await supabase
      .from('members')
      .insert([
        {
          member_id,
          name,
          age: parseInt(age, 10),
          phone,
          email,
          password_hash,
          category,
          goal,
          trainer_id: trainer_id || null,
          plan_id,
          membership_start: startDate.toISOString().split('T')[0],
          membership_end: endDate.toISOString().split('T')[0],
          payment_status: payment_status || 'pending',
          status: 'active',
          qr_code
        }
      ])
      .select()
      .single();

    if (insertError) {
      if (insertError.code === '23505') {
        return res.status(400).json({ message: 'Member with this email already exists' });
      }
      return res.status(500).json({ message: 'Error creating member', error: insertError.message });
    }

    // Log payment in fee_records if payment_status is 'paid'
    if (payment_status === 'paid') {
      await supabase
        .from('fee_records')
        .insert([
          {
            member_id: newMember.id,
            plan_id,
            amount: plan.price,
            paid_on: startDate.toISOString().split('T')[0],
            payment_method: payment_method || 'cash'
          }
        ]);
    }

    res.status(201).json(newMember);
  } catch (err) {
    console.error('Create member error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update member (Admin only)
router.put('/:id', verifyToken(['admin']), async (req, res) => {
  const { name, age, phone, email, password, category, goal, trainer_id, plan_id, membership_start, status, payment_status } = req.body;
  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (age !== undefined) updateData.age = parseInt(age, 10);
  if (phone !== undefined) updateData.phone = phone;
  if (email !== undefined) updateData.email = email;
  if (category !== undefined) updateData.category = category;
  if (goal !== undefined) updateData.goal = goal;
  if (trainer_id !== undefined) updateData.trainer_id = trainer_id || null;
  if (status !== undefined) updateData.status = status;
  if (payment_status !== undefined) updateData.payment_status = payment_status;
  if (password) {
    updateData.password_hash = bcrypt.hashSync(password, 10);
  }

  try {
    // If plan_id or membership_start is being updated, recalculate end date
    if (plan_id || membership_start) {
      let currentPlanId = plan_id;
      let currentStart = membership_start;

      // Fetch member's current info if not provided in req.body
      if (!currentPlanId || !currentStart) {
        const { data: member } = await supabase
          .from('members')
          .select('plan_id, membership_start')
          .eq('id', req.params.id)
          .single();
        if (member) {
          if (!currentPlanId) currentPlanId = member.plan_id;
          if (!currentStart) currentStart = member.membership_start;
        }
      }

      if (currentPlanId) {
        const { data: plan } = await supabase
          .from('membership_plans')
          .select('duration_months')
          .eq('id', currentPlanId)
          .single();

        if (plan) {
          const startDate = currentStart ? new Date(currentStart) : new Date();
          const endDate = new Date(startDate);
          endDate.setMonth(startDate.getMonth() + plan.duration_months);

          updateData.plan_id = currentPlanId;
          updateData.membership_start = startDate.toISOString().split('T')[0];
          updateData.membership_end = endDate.toISOString().split('T')[0];
        }
      }
    }

    const { data: updatedMember, error } = await supabase
      .from('members')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Error updating member', error: error.message });
    }

    res.json(updatedMember);
  } catch (err) {
    console.error('Update member error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH block/unblock member (Admin only)
router.patch('/:id/block', verifyToken(['admin']), async (req, res) => {
  const { status } = req.body; // active or blocked
  if (!status || !['active', 'blocked'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const { data: member, error: mError } = await supabase
      .from('members')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (mError || !member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Re-generate QR code based on new status
    const qrData = JSON.stringify({
      member_id: member.member_id,
      name: member.name,
      email: member.email,
      status: status
    });
    const qr_code = await QRCode.toDataURL(qrData);

    const { data: updatedMember, error } = await supabase
      .from('members')
      .update({ status, qr_code })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: 'Error updating status', error: error.message });
    }

    res.json(updatedMember);
  } catch (err) {
    console.error('Block member error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE member (Admin only)
router.delete('/:id', verifyToken(['admin']), async (req, res) => {
  try {
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(500).json({ message: 'Error deleting member', error: error.message });
    }

    res.json({ message: 'Member deleted successfully' });
  } catch (err) {
    console.error('Delete member error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
