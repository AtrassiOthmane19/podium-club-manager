const pool = require('../config/db');

const getAll = async (req, res) => {
  try {
    const [payments] = await pool.execute(
      `SELECT p.*, m.first_name, m.last_name, sp.name as plan_name
       FROM payments p
       JOIN subscriptions s ON p.subscription_id = s.id
       JOIN members m ON s.member_id = m.id
       JOIN subscription_plans sp ON s.plan_id = sp.id
       ORDER BY p.payment_date DESC`
    );
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { subscriptionId, amount, method } = req.body;

    const [subs] = await pool.execute('SELECT * FROM subscriptions WHERE id = ?', [subscriptionId]);
    if (subs.length === 0) return res.status(404).json({ message: 'Abonnement non trouvé' });

    const sub = subs[0];
    const remaining = sub.total_amount - sub.paid_amount;

    if (parseFloat(amount) <= 0) return res.status(400).json({ message: 'Montant invalide' });
    if (parseFloat(amount) > remaining) return res.status(400).json({ message: `Montant dépasse le reste à payer (${remaining} MAD)` });

    const [result] = await pool.execute(
      'INSERT INTO payments (subscription_id, amount, method, received_by) VALUES (?, ?, ?, ?)',
      [subscriptionId, amount, method || 'cash', req.user?.id || null]
    );

    const newPaidAmount = parseFloat(sub.paid_amount) + parseFloat(amount);
    await pool.execute('UPDATE subscriptions SET paid_amount = ? WHERE id = ?', [newPaidAmount, subscriptionId]);

    const [newPayment] = await pool.execute('SELECT * FROM payments WHERE id = ?', [result.insertId]);
    res.status(201).json(newPayment[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const getByMember = async (req, res) => {
  try {
    const [payments] = await pool.execute(
      `SELECT p.*, sp.name as plan_name
       FROM payments p
       JOIN subscriptions s ON p.subscription_id = s.id
       JOIN subscription_plans sp ON s.plan_id = sp.id
       WHERE s.member_id = ?
       ORDER BY p.payment_date DESC`,
      [req.params.memberId]
    );
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = { getAll, create, getByMember };
