const bcrypt = require('bcryptjs');
const pool = require('./config/db');
require('dotenv').config();

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await pool.execute(
      'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Administrateur', 'admin@podium.ma', hashedPassword, 'admin']
    );
    
    console.log('Admin créé avec succès');
    console.log('Email: admin@podium.ma');
    console.log('Mot de passe: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error.message);
    process.exit(1);
  }
}

createAdmin();