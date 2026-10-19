import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Plus, Edit, Trash2, X, ShieldCheck, ConciergeBell, Wallet, Dumbbell } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../config/roles';

const ROLE_ICONS = { admin: ShieldCheck, caissier: Wallet, receptionist: ConciergeBell, coach: Dumbbell };

export default function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'receptionist' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get('/users');
      setUsers(res.data);
    } catch {
      setError('Erreur lors du chargement des utilisateurs.');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ fullName: '', email: '', password: '', role: 'receptionist' });
    setSubmitError('');
    setShowModal(true);
  };

  const openEdit = (u) => {
    setEditing(u);
    setForm({ fullName: u.full_name, email: u.email, password: '', role: u.role });
    setSubmitError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    try {
      if (editing) {
        await API.put(`/users/${editing.id}`, form);
      } else {
        await API.post('/users', form);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Erreur lors de l'enregistrement.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    try {
      await API.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression.');
    }
  };

  if (currentUser?.role !== 'admin') {
    return (
      <DashboardLayout>
        <div className="p-8">
          <div className="bg-error/10 border border-error text-error rounded-lg p-4">
            Accès réservé aux administrateurs.
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Gestion des utilisateurs</h1>
            <p className="text-text-muted text-sm mt-1">Administrateurs et réceptionnistes</p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-lg font-medium">
            <Plus size={18} />Nouvel utilisateur
          </button>
        </div>

        {error && (
          <div className="bg-error/10 border border-error text-error rounded-lg p-3 mb-4 text-sm">{error}</div>
        )}

        <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left p-4 text-text-muted text-sm">Nom</th>
                <th className="text-left p-4 text-text-muted text-sm">Email</th>
                <th className="text-left p-4 text-text-muted text-sm">Rôle</th>
                <th className="text-left p-4 text-text-muted text-sm">Créé le</th>
                <th className="text-right p-4 text-text-muted text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan="5" className="p-8 text-center text-text-muted">Chargement…</td></tr>
              )}
              {!loading && users.length === 0 && (
                <tr><td colSpan="5" className="p-8 text-center text-text-muted">Aucun utilisateur</td></tr>
              )}
              {!loading && users.map((u) => {
                const roleInfo = ROLES[u.role] || { label: u.role, color: 'bg-dark-light text-text-muted' };
                const RoleIcon = ROLE_ICONS[u.role] || ShieldCheck;
                return (
                <tr key={u.id} className={`border-b border-dark-border hover:bg-dark-light ${u.id === currentUser?.id ? 'opacity-75' : ''}`}>
                  <td className="p-4 flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${roleInfo.color.split(' ')[0]}`}>
                      <RoleIcon size={16} className={roleInfo.color.split(' ')[1]} />
                    </div>
                    <span className="text-text-primary font-medium">{u.full_name}</span>
                    {u.id === currentUser?.id && <span className="text-xs text-text-muted">(vous)</span>}
                  </td>
                  <td className="p-4 text-text-secondary">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleInfo.color}`}>
                      {roleInfo.label}
                    </span>
                  </td>
                  <td className="p-4 text-text-secondary text-sm">
                    {new Date(u.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => openEdit(u)} className="text-text-secondary hover:text-primary p-1"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(u.id)} disabled={u.id === currentUser?.id}
                      className="text-text-secondary hover:text-error p-1 ml-1 disabled:opacity-30 disabled:cursor-not-allowed">
                      <Trash2 size={16} />
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
                <h2 className="text-lg font-bold text-text-primary">
                  {editing ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
                </h2>
                <button onClick={() => setShowModal(false)}><X size={20} className="text-text-muted" /></button>
              </div>

              {submitError && (
                <div className="bg-error/10 border border-error text-error rounded-lg p-3 mb-4 text-sm">{submitError}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Nom complet *" value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full bg-dark-light border border-dark-border rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary"
                  required />
                <input type="email" placeholder="Email *" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-dark-light border border-dark-border rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary"
                  required />
                <input type="password" placeholder={editing ? 'Nouveau mot de passe (laisser vide = inchangé)' : 'Mot de passe *'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-dark-light border border-dark-border rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary"
                  required={!editing} />
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full bg-dark-light border border-dark-border rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary">
                  <option value="receptionist">Réceptionniste — accueil &amp; présences</option>
                  <option value="caissier">Caissier — paiements &amp; abonnements</option>
                  <option value="coach">Coach — membres &amp; présences (lecture)</option>
                  <option value="admin">Administrateur — accès complet</option>
                </select>
                <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white rounded-lg py-2.5 font-medium">
                  {editing ? 'Enregistrer' : 'Créer l\'utilisateur'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
