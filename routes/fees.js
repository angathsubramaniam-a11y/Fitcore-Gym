const express = require('express');
const router = express.Router();
const supabase = require('../supabaseAdmin');
const { verifyToken } = require('../middleware/authMiddleware');

// GET all fee records (Admin only)
router.get('/', verifyToken(['admin']), async (req, res) => {
  try {
    const { data: fees, error } = await supabase
      .from('fee_records')
      .select('*, member:members(id, name, member_id, email, phone), plan:membership_plans(id, name, price)')
      .order('paid_on', { ascending: false });

    if (error) {
      return res.status(500).json({ message: 'Error fetching fee records', error: error.message });
    }

    res.json(fees);
  } catch (err) {
    console.error('Fetch fees error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST log a new payment (Admin only)
router.post('/', verifyToken(['admin']), async (req, res) => {
  const { member_id, plan_id, amount, paid_on, payment_method } = req.body;

  if (!member_id || !plan_id || !amount || !paid_on || !payment_method) {
    return res.status(400).json({ message: 'Member ID, plan ID, amount, payment date, and method are required' });
  }

  try {
    // 1. Insert fee record
    const { data: newFee, error: feeError } = await supabase
      .from('fee_records')
      .insert([
        {
          member_id,
          plan_id,
          amount: parseFloat(amount),
          paid_on,
          payment_method
        }
      ])
      .select()
      .single();

    if (feeError) {
      return res.status(500).json({ message: 'Error logging fee record', error: feeError.message });
    }

    // 2. Update member's payment status to 'paid'
    // Also, if the membership dates need extending, calculate:
    const { data: plan } = await supabase
      .from('membership_plans')
      .select('duration_months')
      .eq('id', plan_id)
      .single();

    if (plan) {
      const startDate = new Date(paid_on);
      const endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + plan.duration_months);

      await supabase
        .from('members')
        .update({
          payment_status: 'paid',
          plan_id,
          membership_start: startDate.toISOString().split('T')[0],
          membership_end: endDate.toISOString().split('T')[0]
        })
        .eq('id', member_id);
    } else {
      await supabase
        .from('members')
        .update({ payment_status: 'paid' })
        .eq('id', member_id);
    }

    res.status(201).json(newFee);
  } catch (err) {
    console.error('Log payment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
