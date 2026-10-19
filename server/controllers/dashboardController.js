const pool = require('../config/db');

exports.getStats = async (req, res) => {
  try {
    const [totalMembers] = await pool.execute(
      'SELECT COUNT(*) as count FROM members'
    );

    const [activeSubscriptions] = await pool.execute(
      'SELECT COUNT(*) as count FROM subscriptions WHERE status = "active"'
    );

    const [expiredSubscriptions] = await pool.execute(
      'SELECT COUNT(*) as count FROM subscriptions WHERE status = "expired"'
    );

    const [monthlyRevenue] = await pool.execute(
      `SELECT COALESCE(SUM(amount), 0) as total 
       FROM payments 
       WHERE MONTH(payment_date) = MONTH(CURRENT_DATE()) 
       AND YEAR(payment_date) = YEAR(CURRENT_DATE())`
    );

    const [membersByMonth] = await pool.execute(
      `SELECT DATE_FORMAT(registration_date, '%Y-%m') as month, COUNT(*) as count 
       FROM members 
       WHERE registration_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH) 
       GROUP BY month 
       ORDER BY month ASC`
    );

    const [expiringSoon] = await pool.execute(
      `SELECT m.first_name, m.last_name, s.end_date
       FROM subscriptions s
       JOIN members m ON s.member_id = m.id
       WHERE s.status = 'active'
       AND s.end_date BETWEEN CURRENT_DATE() AND DATE_ADD(CURRENT_DATE(), INTERVAL 7 DAY)
       ORDER BY s.end_date ASC
       LIMIT 5`
    );

    const [revenueByMonth] = await pool.execute(
      `SELECT DATE_FORMAT(payment_date, '%Y-%m') as month,
              DATE_FORMAT(payment_date, '%b %Y') as label,
              COALESCE(SUM(amount), 0) as total
       FROM payments
       WHERE payment_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
       GROUP BY month, label
       ORDER BY month ASC`
    );

    const [subscriptionsByPlan] = await pool.execute(
      `SELECT p.name, COUNT(s.id) as count
       FROM subscriptions s
       JOIN subscription_plans p ON s.plan_id = p.id
       WHERE s.status = 'active'
       GROUP BY p.id, p.name
       ORDER BY count DESC`
    );

    res.json({
      totalMembers: totalMembers[0].count,
      activeSubscriptions: activeSubscriptions[0].count,
      expiredSubscriptions: expiredSubscriptions[0].count,
      monthlyRevenue: monthlyRevenue[0].total,
      membersByMonth,
      revenueByMonth,
      subscriptionsByPlan,
      expiringSoon
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};