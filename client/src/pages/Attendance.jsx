import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { CheckCircle, Search } from 'lucide-react';
import API from '../services/api';

export default function Attendance() {
  const [attendances, setAttendances] = useState([]);
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchAttendances();
    fetchMembers();
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchAttendances = async () => {
    try {
      const res = await API.get('/attendance');
      setAttendances(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchMembers = async () => {
    try {
      const res = await API.get('/members');
      setMembers(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSearch = (value) => {
    setSearch(value);
    setSelectedMember(null);
    if (!value.trim()) { setFilteredMembers([]); setShowDropdown(false); return; }
    const filtered = members.filter(m =>
      `${m.first_name} ${m.last_name}`.toLowerCase().includes(value.toLowerCase()) ||
      m.cin?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredMembers(filtered);
    setShowDropdown(true);
  };

  const handleSelect = (member) => {
    setSelectedMember(member);
    setSearch(`${member.first_name} ${member.last_name}`);
    setShowDropdown(false);
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();
    if (!selectedMember) return;
    try {
      await API.post('/attendance/check-in', { memberId: selectedMember.id });
      setMessage({ text: `Présence enregistrée pour ${selectedMember.first_name} ${selectedMember.last_name} !`, type: 'success' });
      setSearch('');
      setSelectedMember(null);
      fetchAttendances();
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    } catch (err) {
      setMessage({ text: 'Erreur lors de l\'enregistrement', type: 'error' });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-text-primary mb-8">Présences</h1>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-8">
          <h2 className="text-text-secondary text-sm font-medium mb-4">Enregistrer une présence</h2>
          <form onSubmit={handleCheckIn} className="flex gap-4">
            <div className="relative flex-1" ref={dropdownRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => search && setShowDropdown(true)}
                placeholder="Rechercher un membre par nom ou CIN..."
                className="w-full bg-dark-light border border-dark-border rounded-lg pl-10 pr-4 py-2.5 text-text-primary focus:outline-none focus:border-primary"
              />
              {showDropdown && filteredMembers.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-dark-card border border-dark-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredMembers.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleSelect(m)}
                      className="w-full text-left px-4 py-3 hover:bg-dark-light transition border-b border-dark-border last:border-0"
                    >
                      <p className="text-text-primary text-sm">{m.first_name} {m.last_name}</p>
                      <p className="text-text-muted text-xs">{m.cin} — <span className={m.status === 'active' ? 'text-success' : 'text-error'}>{m.status === 'active' ? 'Actif' : 'Expiré'}</span></p>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={!selectedMember}
              className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 transition"
            >
              <CheckCircle size={18} />Check-in
            </button>
          </form>
          {message.text && (
            <p className={`mt-4 text-sm ${message.type === 'success' ? 'text-success' : 'text-error'}`}>
              {message.text}
            </p>
          )}
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-dark-border">
            <h2 className="text-text-primary font-medium">Historique des présences</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left p-4 text-text-muted text-sm">Membre</th>
                <th className="text-left p-4 text-text-muted text-sm">Date d'entrée</th>
              </tr>
            </thead>
            <tbody>
              {attendances.length === 0 && (
                <tr><td colSpan="2" className="p-8 text-center text-text-muted">Aucune présence enregistrée</td></tr>
              )}
              {attendances.map((a) => (
                <tr key={a.id} className="border-b border-dark-border hover:bg-dark-light">
                  <td className="p-4 text-text-primary">{a.first_name} {a.last_name}</td>
                  <td className="p-4 text-text-secondary">{new Date(a.check_in).toLocaleString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
