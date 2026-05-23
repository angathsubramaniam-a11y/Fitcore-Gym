const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function check() {
  const { data, error } = await supabase
      .from('workout_plans')
      .select('*')
      .limit(1);
  console.log('Plan:', data[0]);
  if (data[0]) {
    console.log('Type of days:', typeof data[0].days);
  }
}

check();
