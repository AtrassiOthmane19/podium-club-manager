import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Users, CreditCard, AlertCircle, DollarSign, TrendingUp, Clock } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import API from '../services/api';

const PLAN_COLORS = ['#E30613', '#22C55E', '#F59E0B', '#3B82F6'];

function CustomTooltipRevenue({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-dark-card border border-dark-border rounded-lg px-4 py-2 text-sm">
      <p className="text-text-muted mb-1">{label}</p>
      <p className="text-primary font-bold">{Number(payload[0].value).toLocaleString('fr-FR')} MAD</p>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    API.get('/dashboard/stats')
      .then((res) => setStats(res.data))
      .catch(() => setError('Erreur lors du chargement du tableau de bord.'))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Total Membres', value: stats?.totalMembers ?? '-', icon: Users, color: '#E30613' },
    { label: 'Abonnements Actifs', value: stats?.activeSubscriptions ?? '-', icon: CreditCard, color: '#22C55E' },
    { label: 'Abonnements Expirés', value: stats?.expiredSubscriptions ?? '-', icon: AlertCircle, color: '#F59E0B' },
    { label: 'Revenus du Mois', value: stats ? `${Number(stats.monthlyRevenue).toLocaleString('fr-FR')} MAD` : '-', icon: DollarSign, color: '#E30613' },
  ];

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
            <p className="text-text-muted mt-1">Vue d'ensemble de votre salle de sport</p>
          </div>
          <div className="flex items-center gap-2 bg-dark-card border border-dark-border rounded-lg px-4 py-2">
            <TrendingUp size={18} className="text-success" />
            <span className="text-text-secondary text-sm">En direct</span>
          </div>
        </div>

        {error && (
          <div className="bg-error/10 border border-error text-error rounded-lg p-3 mb-6 text-sm">{error}</div>
        )}

        {/* KPI Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-dark-card border border-dark-border rounded-2xl p-6 animate-pulse">
                <div className="h-12 w-12 bg-dark-light rounded-xl mb-4" />
                <div className="h-3 bg-dark-light rounded w-24 mb-2" />
                <div className="h-8 bg-dark-light rounded w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, i) => (
              <div key={i} className="bg-dark-card border border-dark-border rounded-2xl p-6 hover:border-primary/30 transition">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl" style={{ backgroundColor: card.color + '15' }}>
                    <card.icon size={24} style={{ color: card.color }} />
                  </div>
                </div>
                <p className="text-text-muted text-sm">{card.label}</p>
                <p className="text-3xl font-bold text-text-primary mt-1">{card.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Charts */}
        {!loading && stats && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue chart */}
            <div className="lg:col-span-2 bg-dark-card border border-dark-border rounded-2xl p-6">
              <h2 className="text-text-primary font-semibold mb-6">Revenus des 6 derniers mois</h2>
              {stats.revenueByMonth?.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={stats.revenueByMonth} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E30613" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#E30613" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                    <XAxis dataKey="label" tick={{ fill: '#A0A0A0', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#A0A0A0', fontSize: 12 }} axisLine={false} tickLine={false}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltipRevenue />} />
                    <Area type="monotone" dataKey="total" stroke="#E30613" strokeWidth={2}
                      fill="url(#revGrad)" dot={{ fill: '#E30613', r: 4 }} activeDot={{ r: 6 }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-52 flex items-center justify-center text-text-muted text-sm">Aucune donnée</div>
              )}
            </div>

            {/* Subscriptions by plan pie chart */}
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
              <h2 className="text-text-primary font-semibold mb-6">Abonnements actifs par plan</h2>
              {stats.subscriptionsByPlan?.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={stats.subscriptionsByPlan} dataKey="count" nameKey="name"
                      cx="50%" cy="45%" outerRadius={75} innerRadius={40}>
                      {stats.subscriptionsByPlan.map((_, i) => (
                        <Cell key={i} fill={PLAN_COLORS[i % PLAN_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v, n) => [`${v} abonnements`, n]}
                      contentStyle={{ background: '#111111', border: '1px solid #2A2A2A', borderRadius: 8 }}
                      labelStyle={{ color: '#F5F5F5' }} itemStyle={{ color: '#A0A0A0' }} />
                    <Legend iconType="circle" iconSize={8}
                      formatter={(v) => <span style={{ color: '#A0A0A0', fontSize: 12 }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-52 flex items-center justify-center text-text-muted text-sm">Aucune donnée</div>
              )}
            </div>
          </div>
        )}

        {/* Expiring soon */}
        {stats?.expiringSoon?.length > 0 && (
          <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 p-5 border-b border-dark-border">
              <Clock size={18} className="text-warning" />
              <h2 className="text-text-primary font-semibold">Abonnements expirant dans 7 jours</h2>
              <span className="ml-auto bg-warning/10 text-warning text-xs font-medium px-2 py-1 rounded-full">
                {stats.expiringSoon.length}
              </span>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left p-4 text-text-muted text-sm">Membre</th>
                  <th className="text-left p-4 text-text-muted text-sm">Date d'expiration</th>
                  <th className="text-left p-4 text-text-muted text-sm">Jours restants</th>
                </tr>
              </thead>
              <tbody>
                {stats.expiringSoon.map((item, i) => {
                  const expiry = new Date(item.end_date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
                  return (
                    <tr key={i} className="border-b border-dark-border last:border-0 hover:bg-dark-light">
                      <td className="p-4 text-text-primary">{item.first_name} {item.last_name}</td>
                      <td className="p-4 text-text-secondary">{expiry.toLocaleDateString('fr-FR')}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${diffDays <= 2 ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'}`}>
                          {diffDays <= 0 ? "Aujourd'hui" : `${diffDays}j`}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
