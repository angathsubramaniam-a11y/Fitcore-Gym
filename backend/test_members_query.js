const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function check() {
  const { data, error } = await supabase
      .from('members')
      .select('*, trainer:trainers(id, name, email, phone, specialization, bio), plan:membership_plans(id, name, price, duration_months, features)')
      .limit(1);
  console.log('Error:', error);
}

check();
