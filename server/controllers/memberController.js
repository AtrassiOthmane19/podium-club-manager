const pool = require('../config/db');

const getAll = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = 'SELECT * FROM members';
    let params = [];
    
    if (search || status) {
      query += ' WHERE';
      if (status) {
        query += ' status = ?';
        params.push(status);
      }
      if (search) {
        if (status) query += ' AND';
        query += ' (first_name LIKE ? OR last_name LIKE ? OR phone LIKE ? OR cin LIKE ?)';
        params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
      }
    }
    query += ' ORDER BY created_at DESC';
    const [members] = await pool.execute(query, params);
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const [members] = await pool.execute('SELECT * FROM members WHERE id = ?', [req.params.id]);
    if (members.length === 0) return res.status(404).json({ message: 'Membre non trouvé' });
    res.json(members[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { firstName, lastName, phone, cin, photo } = req.body;
    const qrCode = `PODIUM-${Date.now()}`;
    const [result] = await pool.execute(
      'INSERT INTO members (first_name, last_name, phone, cin, photo, qr_code) VALUES (?, ?, ?, ?, ?, ?)',
      [firstName, lastName, phone, cin, photo || null, qrCode]
    );
    const [newMember] = await pool.execute('SELECT * FROM members WHERE id = ?', [result.insertId]);
    res.status(201).json(newMember[0]);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Ce CIN existe déjà' });
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { firstName, lastName, phone, cin, photo, status } = req.body;
    const { id } = req.params;
    await pool.execute(
      'UPDATE members SET first_name = ?, last_name = ?, phone = ?, cin = ?, photo = ?, status = ? WHERE id = ?',
      [firstName, lastName, phone, cin, photo, status, id]
    );
    const [updated] = await pool.execute('SELECT * FROM members WHERE id = ?', [id]);
    if (updated.length === 0) return res.status(404).json({ message: 'Membre non trouvé' });
    res.json(updated[0]);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Ce CIN existe déjà' });
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM members WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Membre non trouvé' });
    res.json({ message: 'Membre supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = { getAll, getById, create, update, delete: remove };