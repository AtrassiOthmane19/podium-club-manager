const pool = require('../config/db');

const create = async (req, res) => {
  try {
    const { memberId, planId, startDate } = req.body;
    const [plans] = await pool.execute('SELECT * FROM subscription_plans WHERE id = ?', [planId]);
    if (plans.length === 0) return res.status(404).json({ message: 'Plan non trouvé' });

    const plan = plans[0];
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + plan.duration_months);

    const [result] = await pool.execute(
      'INSERT INTO subscriptions (member_id, plan_id, start_date, end_date, total_amount) VALUES (?, ?, ?, ?, ?)',
      [memberId, planId, startDate, endDate.toISOString().split('T')[0], plan.price]
    );

    await pool.execute('UPDATE members SET status = ? WHERE id = ?', ['active', memberId]);

    const [newSub] = await pool.execute('SELECT * FROM subscriptions WHERE id = ?', [result.insertId]);
    res.status(201).json(newSub[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const [subscriptions] = await pool.execute(
      `SELECT s.*, m.first_name, m.last_name, sp.name as plan_name 
       FROM subscriptions s 
       JOIN members m ON s.member_id = m.id 
       JOIN subscription_plans sp ON s.plan_id = sp.id 
       ORDER BY s.created_at DESC`
    );
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const getByMember = async (req, res) => {
  try {
    const [subscriptions] = await pool.execute(
      `SELECT s.*, sp.name as plan_name 
       FROM subscriptions s 
       JOIN subscription_plans sp ON s.plan_id = sp.id 
       WHERE s.member_id = ? 
       ORDER BY s.created_at DESC`,
      [req.params.memberId]
    );
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const getPlans = async (req, res) => {
  try {
    const [plans] = await pool.execute('SELECT * FROM subscription_plans');
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const renew = async (req, res) => {
  try {
    const { id } = req.params;
    const [subs] = await pool.execute('SELECT * FROM subscriptions WHERE id = ?', [id]);
    if (subs.length === 0) return res.status(404).json({ message: 'Abonnement non trouvé' });

    const oldSub = subs[0];
    const [plans] = await pool.execute('SELECT * FROM subscription_plans WHERE id = ?', [oldSub.plan_id]);
    const plan = plans[0];

    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + plan.duration_months);

    const [result] = await pool.execute(
      'INSERT INTO subscriptions (member_id, plan_id, start_date, end_date, total_amount) VALUES (?, ?, ?, ?, ?)',
      [oldSub.member_id, oldSub.plan_id, startDate, endDate.toISOString().split('T')[0], plan.price]
    );

    await pool.execute('UPDATE members SET status = ? WHERE id = ?', ['active', oldSub.member_id]);

    const [newSub] = await pool.execute('SELECT * FROM subscriptions WHERE id = ?', [result.insertId]);
    res.status(201).json({ message: 'Abonnement renouvelé', subscription: newSub[0] });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = { create, getAll, getByMember, getPlans, renew };