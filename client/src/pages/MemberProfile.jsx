import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { ArrowLeft, User, Phone, CreditCard, QrCode, CheckCircle, XCircle, Clock } from 'lucide-react';
import API from '../services/api';

const STATUS_LABELS = { active: 'Actif', expired: 'Expiré', suspended: 'Suspendu' };
const STATUS_COLORS = { active: 'bg-success/10 text-success', expired: 'bg-error/10 text-error', suspended: 'bg-warning/10 text-warning' };
const METHOD_LABELS = { cash: 'Espèces', card: 'Carte', transfer: 'Virement' };

export default function MemberProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [mRes, sRes, pRes] = await Promise.all([
          API.get(`/members/${id}`),
          API.get(`/subscriptions/member/${id}`),
          API.get(`/payments/member/${id}`),
        ]);
        setMember(mRes.data);
        setSubscriptions(sRes.data);
        setPayments(pRes.data);
      } catch {
        setError('Impossible de charger le profil.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return (
    <DashboardLayout>
      <div className="p-8 flex items-center justify-center min-h-96">
        <p className="text-text-muted">Chargement…</p>
      </div>
    </DashboardLayout>
  );

  if (error || !member) return (
    <DashboardLayout>
      <div className="p-8">
        <div className="bg-error/10 border border-error text-error rounded-lg p-4">{error || 'Membre introuvable'}</div>
      </div>
    </DashboardLayout>
  );

  const activeSub = subscriptions.find((s) => s.status === 'active');
  const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

  return (
    <DashboardLayout>
      <div className="p-8 max-w-5xl">
        <button onClick={() => navigate('/members')}
          className="flex items-center gap-2 text-text-muted hover:text-text-primary mb-6 transition">
          <ArrowLeft size={18} /> Retour aux membres
        </button>

        {/* Header card */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-6 flex flex-wrap gap-6 items-start">
          {/* Avatar / photo */}
          <div className="shrink-0">
            {member.photo ? (
              <img src={member.photo} alt={member.first_name}
                className="w-24 h-24 rounded-2xl object-cover border border-dark-border" />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-dark-light border border-dark-border flex items-center justify-center">
                <User size={36} className="text-text-muted" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-text-primary">{member.first_name} {member.last_name}</h1>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[member.status] || 'bg-dark-light text-text-muted'}`}>
                {STATUS_LABELS[member.status] || member.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-text-secondary text-sm"><Phone size={14} /> {member.phone}</span>
              <span className="flex items-center gap-1.5 text-text-secondary text-sm"><CreditCard size={14} /> {member.cin}</span>
              <span className="flex items-center gap-1.5 text-text-secondary text-sm">
                <Clock size={14} /> Inscrit le {new Date(member.registration_date).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>

          {/* QR code */}
          {member.qr_code && (
            <div className="shrink-0 text-center">
              <div className="bg-white p-3 rounded-xl inline-block">
                <QrCode size={64} className="text-dark-bg" />
              </div>
              <p className="text-text-muted text-xs mt-1">{member.qr_code}</p>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Abonnements', value: subscriptions.length },
            { label: 'Actifs', value: subscriptions.filter((s) => s.status === 'active').length, color: 'text-success' },
            { label: 'Expirés', value: subscriptions.filter((s) => s.status === 'expired').length, color: 'text-error' },
            { label: 'Total payé', value: `${totalPaid.toLocaleString('fr-FR')} MAD`, color: 'text-primary' },
          ].map((s, i) => (
            <div key={i} className="bg-dark-card border border-dark-border rounded-xl p-4">
              <p className="text-text-muted text-xs mb-1">{s.label}</p>
              <p className={`text-xl font-bold ${s.color || 'text-text-primary'}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Active subscription highlight */}
        {activeSub && (
          <div className="bg-success/5 border border-success/20 rounded-2xl p-5 mb-6 flex flex-wrap gap-4 items-center">
            <CheckCircle size={20} className="text-success shrink-0" />
            <div className="flex-1">
              <p className="text-text-primary font-semibold">Abonnement actif — {activeSub.plan_name}</p>
              <p className="text-text-secondary text-sm mt-0.5">
                Du {new Date(activeSub.start_date).toLocaleDateString('fr-FR')} au{' '}
                <span className="font-medium">{new Date(activeSub.end_date).toLocaleDateString('fr-FR')}</span>
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-text-primary font-bold">{activeSub.paid_amount} / {activeSub.total_amount} MAD</p>
              {parseFloat(activeSub.paid_amount) < parseFloat(activeSub.total_amount) && (
                <p className="text-warning text-xs mt-0.5">
                  Reste : {(activeSub.total_amount - activeSub.paid_amount).toLocaleString('fr-FR')} MAD
                </p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subscription history */}
          <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-dark-border">
              <h2 className="text-text-primary font-semibold">Historique des abonnements</h2>
            </div>
            {subscriptions.length === 0 ? (
              <p className="p-5 text-text-muted text-sm">Aucun abonnement</p>
            ) : (
              <div className="divide-y divide-dark-border">
                {subscriptions.map((s) => (
                  <div key={s.id} className="p-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-text-primary text-sm font-medium">{s.plan_name}</p>
                      <p className="text-text-muted text-xs mt-0.5">
                        {new Date(s.start_date).toLocaleDateString('fr-FR')} → {new Date(s.end_date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.status === 'active' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                        {s.status === 'active' ? 'Actif' : 'Expiré'}
                      </span>
                      <p className="text-text-muted text-xs mt-1">{s.paid_amount} / {s.total_amount} MAD</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment history */}
          <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-dark-border">
              <h2 className="text-text-primary font-semibold">Historique des paiements</h2>
            </div>
            {payments.length === 0 ? (
              <p className="p-5 text-text-muted text-sm">Aucun paiement</p>
            ) : (
              <div className="divide-y divide-dark-border">
                {payments.map((p) => (
                  <div key={p.id} className="p-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-text-primary text-sm font-medium">{parseFloat(p.amount).toLocaleString('fr-FR')} MAD</p>
                      <p className="text-text-muted text-xs mt-0.5">{p.plan_name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-text-secondary text-xs">{METHOD_LABELS[p.method] || p.method}</p>
                      <p className="text-text-muted text-xs mt-0.5">
                        {new Date(p.payment_date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
