import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Plus, RefreshCw, X, Search, Filter, ChevronDown, Download } from 'lucide-react';
import API from '../services/api';

function exportCSV(data, filename) {
  const headers = ['Membre', 'Plan', 'Début', 'Fin', 'Statut', 'Total', 'Payé'];
  const rows = data.map((s) => [
    `${s.first_name} ${s.last_name}`, s.plan_name,
    new Date(s.start_date).toLocaleDateString('fr-FR'),
    new Date(s.end_date).toLocaleDateString('fr-FR'),
    s.status === 'active' ? 'Actif' : 'Expiré',
    s.total_amount, s.paid_amount,
  ]);
  const csv = [headers, ...rows].map((r) => r.map((v) => `"${v ?? ''}"`).join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function MemberSearch({ members, value, onChange }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = members.find((m) => m.id === value);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = members.filter((m) =>
    `${m.first_name} ${m.last_name}`.toLowerCase().includes(query.toLowerCase()) ||
    (m.cin && m.cin.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 20);

  const select = (m) => { onChange(m.id); setQuery(''); setOpen(false); };
  const clear = () => { onChange(''); setQuery(''); };

  return (
    <div ref={ref} className="relative">
      <div
        className="w-full flex items-center bg-dark-light border border-dark-border rounded-lg px-4 py-2.5 cursor-pointer"
        onClick={() => { setOpen(true); }}
      >
        {selected && !open ? (
          <div className="flex-1 flex items-center justify-between">
            <span className="text-text-primary">{selected.first_name} {selected.last_name}</span>
            <button type="button" onClick={(e) => { e.stopPropagation(); clear(); }}
              className="text-text-muted hover:text-text-primary">
              <X size={14} />
            </button>
          </div>
        ) : (
          <input
            autoFocus={open}
            type="text"
            placeholder="Rechercher un membre (nom, CIN)…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            className="flex-1 bg-transparent text-text-primary placeholder-text-muted outline-none"
          />
        )}
        <ChevronDown size={16} className="text-text-muted ml-2 shrink-0" />
      </div>

      {open && (
        <ul className="absolute z-50 w-full mt-1 bg-dark-card border border-dark-border rounded-lg shadow-xl max-h-52 overflow-y-auto">
          {filtered.length === 0 && (
            <li className="px-4 py-3 text-text-muted text-sm">Aucun résultat</li>
          )}
          {filtered.map((m) => (
            <li
              key={m.id}
              onMouseDown={() => select(m)}
              className="px-4 py-2.5 hover:bg-dark-light cursor-pointer flex items-center justify-between"
            >
              <span className="text-text-primary">{m.first_name} {m.last_name}</span>
              <span className="text-text-muted text-xs">{m.cin}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ memberId: '', planId: '', startDate: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlan, setFilterPlan] = useState('all');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [subsRes, plansRes, membersRes] = await Promise.all([
        API.get('/subscriptions'),
        API.get('/subscriptions/plans'),
        API.get('/members'),
      ]);
      setSubscriptions(subsRes.data);
      setPlans(plansRes.data);
      setMembers(membersRes.data);
    } catch {
      setError('Erreur lors du chargement des données.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const res = await API.get('/subscriptions');
      setSubscriptions(res.data);
    } catch {
      setError('Erreur lors du chargement des abonnements.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    try {
      await API.post('/subscriptions', form);
      setShowModal(false);
      fetchSubscriptions();
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Erreur lors de la création de l'abonnement.");
    }
  };

  const handleRenew = async (id) => {
    if (!confirm('Renouveler cet abonnement ?')) return;
    try {
      await API.post(`/subscriptions/${id}/renew`);
      fetchSubscriptions();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du renouvellement.');
    }
  };

  const openCreate = () => {
    setForm({ memberId: '', planId: '', startDate: new Date().toISOString().split('T')[0] });
    setSubmitError('');
    setShowModal(true);
  };

  const filtered = subscriptions.filter((s) => {
    const name = `${s.first_name} ${s.last_name}`.toLowerCase();
    const matchSearch =
      search === '' ||
      name.includes(search.toLowerCase()) ||
      (s.plan_name && s.plan_name.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    const matchPlan = filterPlan === 'all' || s.plan_name === filterPlan;
    return matchSearch && matchStatus && matchPlan;
  });

  const expiringSoon = subscriptions.filter((s) => {
    if (s.status !== 'active') return false;
    const diff = (new Date(s.end_date) - new Date()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  }).length;

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold text-text-primary">Abonnements</h1>
          <div className="flex gap-2">
            <button onClick={() => exportCSV(filtered, 'abonnements.csv')}
              className="flex items-center gap-2 border border-dark-border text-text-secondary hover:text-text-primary hover:border-primary px-4 py-2.5 rounded-lg font-medium transition">
              <Download size={18} />CSV
            </button>
            <button onClick={openCreate} className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-lg font-medium">
              <Plus size={18} />Nouvel abonnement
            </button>
          </div>
        </div>

        {expiringSoon > 0 && (
          <div
            className="bg-warning/10 border border-warning/40 text-warning rounded-lg px-4 py-3 mb-5 text-sm flex items-center gap-2 cursor-pointer hover:bg-warning/15"
            onClick={() => { setFilterStatus('active'); setSearch(''); setFilterPlan('all'); }}
          >
            <Filter size={15} />
            <span><strong>{expiringSoon} abonnement{expiringSoon > 1 ? 's' : ''}</strong> expire{expiringSoon > 1 ? 'nt' : ''} dans moins de 7 jours — cliquez pour filtrer les actifs.</span>
          </div>
        )}

        {error && (
          <div className="bg-error/10 border border-error text-error rounded-lg p-3 mb-4 text-sm">{error}</div>
        )}

        {/* Barre de recherche + filtres */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-52">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Rechercher par nom ou plan…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-dark-card border border-dark-border rounded-lg pl-9 pr-4 py-2.5 text-text-primary placeholder-text-muted focus:outline-none focus:border-primary text-sm"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
                <X size={14} />
              </button>
            )}
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-dark-card border border-dark-border rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary text-sm"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="expired">Expirés</option>
          </select>

          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="bg-dark-card border border-dark-border rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary text-sm"
          >
            <option value="all">Tous les plans</option>
            {plans.map((p) => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>

          {(search || filterStatus !== 'all' || filterPlan !== 'all') && (
            <button
              onClick={() => { setSearch(''); setFilterStatus('all'); setFilterPlan('all'); }}
              className="flex items-center gap-1 px-3 py-2.5 rounded-lg text-sm text-text-muted hover:text-text-primary border border-dark-border hover:border-primary transition"
            >
              <X size={14} />Réinitialiser
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mb-3">
          <p className="text-text-muted text-sm">
            {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
            {filtered.length !== subscriptions.length && ` sur ${subscriptions.length}`}
          </p>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left p-4 text-text-muted text-sm">Membre</th>
                <th className="text-left p-4 text-text-muted text-sm">Plan</th>
                <th className="text-left p-4 text-text-muted text-sm">Début</th>
                <th className="text-left p-4 text-text-muted text-sm">Fin</th>
                <th className="text-left p-4 text-text-muted text-sm">Statut</th>
                <th className="text-left p-4 text-text-muted text-sm">Payé</th>
                <th className="text-center p-4 text-text-muted text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan="7" className="p-8 text-center text-text-muted">Chargement…</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan="7" className="p-8 text-center text-text-muted">Aucun abonnement trouvé</td></tr>
              )}
              {!loading && filtered.map((s) => {
                const daysLeft = Math.ceil((new Date(s.end_date) - new Date()) / (1000 * 60 * 60 * 24));
                const expiringSoon = s.status === 'active' && daysLeft >= 0 && daysLeft <= 7;
                return (
                  <tr key={s.id} className={`border-b border-dark-border hover:bg-dark-light ${expiringSoon ? 'bg-warning/5' : ''}`}>
                    <td className="p-4 text-text-primary font-medium">{s.first_name} {s.last_name}</td>
                    <td className="p-4 text-text-secondary">{s.plan_name}</td>
                    <td className="p-4 text-text-secondary">{new Date(s.start_date).toLocaleDateString('fr-FR')}</td>
                    <td className="p-4">
                      <span className={expiringSoon ? 'text-warning font-medium' : 'text-text-secondary'}>
                        {new Date(s.end_date).toLocaleDateString('fr-FR')}
                        {expiringSoon && <span className="ml-1 text-xs">({daysLeft}j)</span>}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.status === 'active' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                        {s.status === 'active' ? 'Actif' : 'Expiré'}
                      </span>
                    </td>
                    <td className="p-4 text-text-secondary">{s.paid_amount} / {s.total_amount} MAD</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleRenew(s.id)}
                        className="inline-flex items-center gap-1 bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                      >
                        <RefreshCw size={14} />Renouveler
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-dark-card border border-dark-border rounded-2xl w-full max-w-md p-6">
              <div className="flex justify-between mb-6">
                <h2 className="text-lg font-bold text-text-primary">Nouvel abonnement</h2>
                <button onClick={() => setShowModal(false)}><X size={20} className="text-text-muted" /></button>
              </div>

              {submitError && (
                <div className="bg-error/10 border border-error text-error rounded-lg p-3 mb-4 text-sm">{submitError}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-text-secondary text-sm mb-1">Membre</label>
                  <MemberSearch
                    members={members}
                    value={form.memberId}
                    onChange={(id) => setForm({ ...form, memberId: id })}
                  />
                  <input type="hidden" value={form.memberId} required />
                </div>

                <div>
                  <label className="block text-text-secondary text-sm mb-1">Plan</label>
                  <select
                    value={form.planId}
                    onChange={(e) => setForm({ ...form, planId: e.target.value })}
                    className="w-full bg-dark-light border border-dark-border rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary"
                    required
                  >
                    <option value="">Sélectionner un plan</option>
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} — {p.price} MAD / {p.duration_months} mois</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-text-secondary text-sm mb-1">Date de début</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full bg-dark-light border border-dark-border rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={!form.memberId}
                  className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg py-2.5 font-medium"
                >
                  Créer l'abonnement
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
