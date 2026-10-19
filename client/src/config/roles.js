export const ROLES = {
  admin:         { label: 'Administrateur',  color: 'bg-primary/10 text-primary',      icon: 'ShieldCheck' },
  caissier:      { label: 'Caissier',         color: 'bg-blue-500/10 text-blue-400',    icon: 'Wallet' },
  receptionist:  { label: 'Réceptionniste',   color: 'bg-dark-light text-text-secondary', icon: 'ConciergeBell' },
  coach:         { label: 'Coach',            color: 'bg-success/10 text-success',      icon: 'Dumbbell' },
};

// pages each role can access  (true = full access, 'read' = view only, false = blocked)
export const PERMISSIONS = {
  admin:        { dashboard: true,  members: true,   subscriptions: true,  payments: true,  attendance: true,  users: true  },
  caissier:     { dashboard: true,  members: true,   subscriptions: true,  payments: true,  attendance: true,  users: false },
  receptionist: { dashboard: true,  members: true,   subscriptions: true,  payments: false, attendance: true,  users: false },
  coach:        { dashboard: true,  members: 'read', subscriptions: false, payments: false, attendance: true,  users: false },
};

export function can(user, page) {
  if (!user) return false;
  return PERMISSIONS[user.role]?.[page] ?? false;
}
