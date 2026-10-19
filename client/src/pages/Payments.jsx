import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Plus, Search, X } from 'lucide-react';
import API from '../services/api';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredSubs, setFilteredSubs] = useState([]);
  const [selectedSub, setSelectedSub] = useState(null);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('cash');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchAll();
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [paymentsRes, subsRes] = await Promise.all([
        API.get('/payments'),
        API.get('/subscriptions'),
      ]);
      setPayments(paymentsRes.data);
      setSubscriptions(subsRes.data);
    } catch (err) {
      setError('Erreur lors du chargement des données.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await API.get('/payments');
      setPayments(res.data);
    } catch (err) {
      setError('Erreur lors du chargement des paiements.');
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    setSelectedSub(null);
    setAmount('');
    if (value.trim() === '') {
      setFilteredSubs([]);
      setShowDropdown(false);
    } else {
      const filtered = subscriptions.filter(s =>
        `${s.first_name} ${s.last_name}`.toLowerCase().includes(value.toLowerCase()) ||
        s.plan_name?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSubs(filtered);
      setShowDropdown(true);
    }
  };

  const handleSelect = (sub) => {
    setSelectedSub(sub);
    setSearch(`${sub.first_name} ${sub.last_name} — ${sub.plan_name}`);
    setShowDropdown(false);
    const rest = parseFloat(sub.total_amount) - parseFloat(sub.paid_amount);
    setAmount(rest > 0 ? rest.toString() : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSub || !amount) return;
    setSubmitError('');
    try {
      await API.post('/payments', {
        subscriptionId: selectedSub.id,
        amount: parseFloat(amount),
        method,
      });
      setShowModal(false);
      setSearch('');
      setSelectedSub(null);
      setAmount('');
      fetchPayments();
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Erreur lors de l\'enregistrement du paiement.');
    }
  };

  const openModal = () => {
    setSearch('');
    setSelectedSub(null);
    setAmount('');
    setMethod('cash');
    setSubmitError('');
    setShowModal(true);
  };

  const remaining = selectedSub
    ? parseFloat(selectedSub.total_amount) - parseFloat(selectedSub.paid_amount)
    : 0;

  const methodLabel = (m) => {
    if (m === 'cash') return 'Espèces';
    if (m === 'card') return 'Carte';
    return 'Virement';
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex justify-between mb-8">
          <h1 className="text-2xl font-bold text-text-primary">Paiements</h1>
          <button onClick={openModal} className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-lg font-medium">
            <Plus size={18} />Nouveau paiement
          </button>
        </div>

        {error && (
          <div className="bg-error/10 border border-error text-error rounded-lg p-3 mb-4 text-sm">{error}</div>
        )}

        <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left p-4 text-text-muted text-sm">Membre</th>
                <th className="text-left p-4 text-text-muted text-sm">Montant</th>
                <th className="text-left p-4 text-text-muted text-sm">Méthode</th>
                <th className="text-left p-4 text-text-muted text-sm">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan="4" className="p-8 text-center text-text-muted">Chargement...</td></tr>
              )}
              {!loading && payments.length === 0 && (
                <tr><td colSpan="4" className="p-8 text-center text-text-muted">Aucun paiement enregistré</td></tr>
              )}
              {!loading && payments.map((p) => (
                <tr key={p.id} className="border-b border-dark-border hover:bg-dark-light">
                  <td className="p-4 text-text-primary">{p.first_name} {p.last_name}</td>
                  <td className="p-4 text-text-secondary font-medium">{p.amount} MAD</td>
                  <td className="p-4 text-text-secondary">{methodLabel(p.method)}</td>
                  <td className="p-4 text-text-secondary">{new Date(p.payment_date).toLocaleString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-dark-card border border-dark-border rounded-2xl w-full max-w-md p-6">
              <div className="flex justify-between mb-6">
                <h2 className="text-lg font-bold text-text-primary">Nouveau paiement</h2>
                <button onClick={() => setShowModal(false)}><X size={20} className="text-text-muted" /></button>
              </div>

              {submitError && (
                <div className="bg-error/10 border border-error text-error rounded-lg p-3 mb-4 text-sm">{submitError}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative" ref={dropdownRef}>
                  <label className="block text-text-secondary text-sm mb-1">Rechercher un membre</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => handleSearch(e.target.value)}
                      onFocus={() => search && setShowDropdown(true)}
                      placeholder="Tapez le nom du membre..."
                      className="w-full bg-dark-light border border-dark-border rounded-lg pl-10 pr-4 py-2.5 text-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>

                  {showDropdown && filteredSubs.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-dark-card border border-dark-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {filteredSubs.map((sub) => {
                        const rest = parseFloat(sub.total_amount) - parseFloat(sub.paid_amount);
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => handleSelect(sub)}
                            className="w-full text-left px-4 py-3 hover:bg-dark-light transition border-b border-dark-border last:border-0"
                          >
                            <p className="text-text-primary text-sm">{sub.first_name} {sub.last_name}</p>
                            <p className="text-text-muted text-xs">
                              {sub.plan_name} | Reste: <span className={rest > 0 ? 'text-warning' : 'text-success'}>{rest} MAD</span>
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {showDropdown && search && filteredSubs.length === 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-dark-card border border-dark-border rounded-lg shadow-lg p-4 text-center text-text-muted text-sm">
                      Aucun abonnement trouvé
                    </div>
                  )}
                </div>

                {selectedSub && (
                  <div className="bg-dark-light border border-dark-border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Plan</span>
                      <span className="text-text-primary">{selectedSub.plan_name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Total</span>
                      <span className="text-text-primary">{selectedSub.total_amount} MAD</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Payé</span>
                      <span className="text-success">{selectedSub.paid_amount} MAD</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold border-t border-dark-border pt-2">
                      <span className="text-text-muted">Reste à payer</span>
                      <span className={remaining > 0 ? 'text-warning' : 'text-success'}>{remaining} MAD</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-text-secondary text-sm mb-1">Montant (MAD)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Montant du paiement"
                    min="0.01"
                    step="0.01"
                    className="w-full bg-dark-light border border-dark-border rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-text-secondary text-sm mb-1">Méthode</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full bg-dark-light border border-dark-border rounded-lg px-4 py-2.5 text-text-primary"
                  >
                    <option value="cash">Espèces</option>
                    <option value="card">Carte</option>
                    <option value="transfer">Virement</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!selectedSub || !amount}
                  className="w-full bg-primary hover:bg-primary-hover text-white rounded-lg py-2.5 font-medium disabled:opacity-50 transition"
                >
                  Enregistrer le paiement
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
