import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-dark-bg">
      <Sidebar />
      <div className="ml-64 flex-1">
        {children}
      </div>
    </div>
  );
}