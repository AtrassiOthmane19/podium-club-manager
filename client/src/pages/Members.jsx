import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Plus, Search, Edit, Trash2, X, Eye, Download } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { can } from '../config/roles';

function exportCSV(data, filename) {
  const headers = ['Prénom', 'Nom', 'Téléphone', 'CIN', 'Statut', 'Date inscription'];
  const rows = data.map((m) => [
    m.first_name, m.last_name, m.phone, m.cin, m.status,
    new Date(m.registration_date).toLocaleDateString('fr-FR'),
  ]);
  const csv = [headers, ...rows].map((r) => r.map((v) => `"${v ?? ''}"`).join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function Members() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const readOnly = can(user, 'members') === 'read';
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', cin: '', status: 'active', photo: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async (searchTerm) => {
    setLoading(true);
    setError('');
    try {
      const q = searchTerm !== undefined ? searchTerm : search;
      const params = q ? `?search=${encodeURIComponent(q)}` : '';
      const res = await API.get(`/members${params}`);
      setMembers(res.data);
    } catch (err) {
      setError('Erreur lors du chargement des membres.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMembers(search);
  };

  const openCreate = () => {
    setEditingMember(null);
    setForm({ firstName: '', lastName: '', phone: '', cin: '', status: 'active', photo: '' });
    setSubmitError('');
    setShowModal(true);
  };

  const openEdit = (m) => {
    setEditingMember(m);
    setForm({ firstName: m.first_name, lastName: m.last_name, phone: m.phone, cin: m.cin, status: m.status, photo: m.photo || '' });
    setSubmitError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    try {
      if (editingMember) {
        await API.put(`/members/${editingMember.id}`, form);
      } else {
        await API.post('/members', form);
      }
      setShowModal(false);
      fetchMembers();
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Erreur lors de l\'enregistrement.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce membre ?')) return;
    try {
      await API.delete(`/members/${id}`);
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression.');
    }
  };

  const statusLabel = (s) => {
    if (s === 'active') return 'Actif';
    if (s === 'expired') return 'Expiré';
    return 'Suspendu';
  };

  const statusClass = (s) => {
    if (s === 'active') return 'bg-success/10 text-success';
    if (s === 'expired') return 'bg-error/10 text-error';
    return 'bg-warning/10 text-warning';
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex justify-between mb-8">
          <h1 className="text-2xl font-bold text-text-primary">Membres</h1>
          <div className="flex gap-2">
            <button onClick={() => exportCSV(members, 'membres.csv')}
              className="flex items-center gap-2 border border-dark-border text-text-secondary hover:text-text-primary hover:border-primary px-4 py-2.5 rounded-lg font-medium transition">
              <Download size={18} />CSV
            </button>
            {!readOnly && (
              <button onClick={openCreate} className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-lg font-medium">
                <Plus size={18} />Ajouter
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative max-w-md flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par nom, téléphone ou CIN..."
                className="w-full bg-dark-card border border-dark-border rounded-lg pl-10 pr-4 py-2.5 text-text-primary focus:outline-none focus:border-primary"
              />
            </div>
            <button type="submit" className="bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-lg font-medium">
              Chercher
            </button>
            {search && (
              <button type="button" onClick={() => { setSearch(''); fetchMembers(''); }} className="text-text-muted hover:text-text-primary px-2">
                <X size={18} />
              </button>
            )}
          </div>
        </form>

        {error && (
          <div className="bg-error/10 border border-error text-error rounded-lg p-3 mb-4 text-sm">{error}</div>
        )}

        <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left p-4 text-text-muted text-sm">Nom</th>
                <th className="text-left p-4 text-text-muted text-sm">Téléphone</th>
                <th className="text-left p-4 text-text-muted text-sm">CIN</th>
                <th className="text-left p-4 text-text-muted text-sm">Statut</th>
                <th className="text-right p-4 text-text-muted text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan="5" className="p-8 text-center text-text-muted">Chargement...</td></tr>
              )}
              {!loading && members.length === 0 && (
                <tr><td colSpan="5" className="p-8 text-center text-text-muted">Aucun membre trouvé</td></tr>
              )}
              {!loading && members.map((m) => (
                <tr key={m.id} className="border-b border-dark-border hover:bg-dark-light">
                  <td className="p-4">
                    <button onClick={() => navigate(`/members/${m.id}`)}
                      className="text-text-primary hover:text-primary font-medium text-left transition">
                      {m.first_name} {m.last_name}
                    </button>
                  </td>
                  <td className="p-4 text-text-secondary">{m.phone}</td>
                  <td className="p-4 text-text-secondary">{m.cin}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass(m.status)}`}>
                      {statusLabel(m.status)}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => navigate(`/members/${m.id}`)} className="text-text-secondary hover:text-primary p-1" title="Voir profil"><Eye size={16} /></button>
                    {!readOnly && <>
                      <button onClick={() => openEdit(m)} className="text-text-secondary hover:text-primary p-1 ml-1"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(m.id)} className="text-text-secondary hover:text-error p-1 ml-1"><Trash2 size={16} /></button>
                    </>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-dark-card border border-dark-border rounded-2xl w-full max-w-md p-6">
              <div className="flex justify-between mb-6">
                <h2 className="text-lg font-bold text-text-primary">{editingMember ? 'Modifier le membre' : 'Nouveau membre'}</h2>
                <button onClick={() => setShowModal(false)}><X size={20} className="text-text-muted" /></button>
              </div>

              {submitError && (
                <div className="bg-error/10 border border-error text-error rounded-lg p-3 mb-4 text-sm">{submitError}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  placeholder="Prénom *"
                  className="w-full bg-dark-light border border-dark-border rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary"
                  required
                />
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  placeholder="Nom *"
                  className="w-full bg-dark-light border border-dark-border rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary"
                  required
                />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Téléphone *"
                  className="w-full bg-dark-light border border-dark-border rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary"
                  required
                />
                <input
                  type="text"
                  value={form.cin}
                  onChange={(e) => setForm({ ...form, cin: e.target.value })}
                  placeholder="CIN *"
                  className="w-full bg-dark-light border border-dark-border rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary"
                  required
                />
                {editingMember && (
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full bg-dark-light border border-dark-border rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-primary"
                  >
                    <option value="active">Actif</option>
                    <option value="expired">Expiré</option>
                    <option value="suspended">Suspendu</option>
                  </select>
                )}
                <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white rounded-lg py-2.5 font-medium">
                  {editingMember ? 'Enregistrer les modifications' : 'Ajouter le membre'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
