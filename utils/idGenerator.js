const supabase = require('../supabaseAdmin');

async function generateMemberID() {
  const year = new Date().getFullYear();
  
  // We can query the total number of members in the database for the current year
  const { data, error } = await supabase
    .from('members')
    .select('member_id');

  if (error) {
    console.error("Error fetching members for ID generation:", error);
    return `MBR-${year}-001`;
  }

  // Filter IDs that match MBR-YYYY-
  const prefix = `MBR-${year}-`;
  const matchingMembers = data.filter(m => m.member_id && m.member_id.startsWith(prefix));
  
  let maxSeq = 0;
  matchingMembers.forEach(m => {
    const parts = m.member_id.split('-');
    if (parts.length === 3) {
      const seq = parseInt(parts[2], 10);
      if (!isNaN(seq) && seq > maxSeq) {
        maxSeq = seq;
      }
    }
  });

  const nextNum = maxSeq + 1;
  return `MBR-${year}-${String(nextNum).padStart(3, '0')}`;
}

async function generateTrainerID() {
  const { data, error } = await supabase
    .from('trainers')
    .select('trainer_id');

  if (error) {
    console.error("Error fetching trainers for ID generation:", error);
    return `TRN-001`;
  }

  let maxSeq = 0;
  data.forEach(t => {
    if (t.trainer_id && t.trainer_id.startsWith('TRN-')) {
      const seq = parseInt(t.trainer_id.replace('TRN-', ''), 10);
      if (!isNaN(seq) && seq > maxSeq) {
        maxSeq = seq;
      }
    }
  });

  const nextNum = maxSeq + 1;
  return `TRN-${String(nextNum).padStart(3, '0')}`;
}

module.exports = {
  generateMemberID,
  generateTrainerID
};
