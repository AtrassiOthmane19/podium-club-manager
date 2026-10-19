import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, Receipt, QrCode, LogOut, ShieldCheck, Wallet, Dumbbell, ConciergeBell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { can, ROLES } from '../../config/roles';

const ROLE_ICONS = { admin: ShieldCheck, caissier: Wallet, receptionist: ConciergeBell, coach: Dumbbell };

const allLinks = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard',    page: 'dashboard' },
  { to: '/members',       icon: Users,           label: 'Membres',      page: 'members' },
  { to: '/subscriptions', icon: CreditCard,      label: 'Abonnements',  page: 'subscriptions' },
  { to: '/payments',      icon: Receipt,         label: 'Paiements',    page: 'payments' },
  { to: '/attendance',    icon: QrCode,          label: 'Présences',    page: 'attendance' },
  { to: '/users',         icon: ShieldCheck,     label: 'Utilisateurs', page: 'users' },
];

export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const RoleIcon = ROLE_ICONS[user?.role] || ShieldCheck;
  const roleInfo = ROLES[user?.role];
  const visibleLinks = allLinks.filter((l) => can(user, l.page));

  return (
    <div className="w-64 h-screen bg-dark-card border-r border-dark-border flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-dark-border">
        <img
          src="https://i.postimg.cc/3RMg66rw/pod-logo-01-01.png"
          alt="Podium Fitness Club"
          className="h-20 w-auto mb-1"
        />
        <p className="text-text-muted text-xs mt-1">Club Manager</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:bg-dark-light hover:text-text-primary'
              }`
            }
          >
            <link.icon size={20} />
            <span className="text-sm font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User info */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-dark-light">
          <RoleIcon size={16} className="text-text-muted shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-text-primary text-xs font-medium truncate">{user?.full_name || user?.fullName}</p>
            {roleInfo && (
              <p className="text-text-muted text-xs truncate">{roleInfo.label}</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 pt-2 border-t border-dark-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-dark-light hover:text-error transition w-full"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
