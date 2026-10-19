const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const getAll = async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, full_name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Nom, email et mot de passe sont requis' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
      [fullName, email, hashedPassword, role || 'receptionist']
    );
    const [newUser] = await pool.execute(
      'SELECT id, full_name, email, role, created_at FROM users WHERE id = ?',
      [result.insertId]
    );
    res.status(201).json(newUser[0]);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { fullName, email, role, password } = req.body;
    const { id } = req.params;
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      await pool.execute(
        'UPDATE users SET full_name = ?, email = ?, role = ?, password = ? WHERE id = ?',
        [fullName, email, role, hashed, id]
      );
    } else {
      await pool.execute(
        'UPDATE users SET full_name = ?, email = ?, role = ? WHERE id = ?',
        [fullName, email, role, id]
      );
    }
    const [updated] = await pool.execute(
      'SELECT id, full_name, email, role, created_at FROM users WHERE id = ?',
      [id]
    );
    if (updated.length === 0) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(updated[0]);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ message: 'Impossible de supprimer votre propre compte' });
    }
    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = { getAll, create, update, delete: remove };
