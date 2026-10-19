const pool = require('../config/db');

const getAll = async (req, res) => {
  try {
    const [attendances] = await pool.execute(
      `SELECT a.*, m.first_name, m.last_name
       FROM attendance a
       JOIN members m ON a.member_id = m.id
       ORDER BY a.check_in DESC
       LIMIT 100`
    );
    res.json(attendances);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const checkIn = async (req, res) => {
  try {
    const { memberId } = req.body;
    const [members] = await pool.execute('SELECT * FROM members WHERE id = ?', [memberId]);
    if (members.length === 0) return res.status(404).json({ message: 'Membre non trouvé' });

    const [result] = await pool.execute(
      'INSERT INTO attendance (member_id) VALUES (?)',
      [memberId]
    );

    const [newAttendance] = await pool.execute(
      `SELECT a.*, m.first_name, m.last_name FROM attendance a
       JOIN members m ON a.member_id = m.id WHERE a.id = ?`,
      [result.insertId]
    );
    res.status(201).json(newAttendance[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = { getAll, checkIn };
