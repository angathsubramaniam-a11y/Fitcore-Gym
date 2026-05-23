const supabase = require('./supabaseAdmin');
async function test() {
  const { data, error } = await supabase.from('support_queries').insert([{
    subject: 'test',
    message: 'test',
    status: 'open'
  }]);
  console.log(error);
}
test();
