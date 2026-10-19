import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-bg">
      <div className="w-full max-w-md rounded-2xl bg-dark-card p-8 border border-dark-border">
        <div className="text-center mb-8">
          <img
            src="https://i.postimg.cc/3RMg66rw/pod-logo-01-01.png"
            alt="Podium Fitness Club"
            className="h-24 mx-auto mb-4"
          />
          <p className="text-text-secondary mt-2">Club Manager</p>
        </div>

        {error && (
          <div className="bg-error/10 border border-error text-error rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-text-secondary text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-dark-light border border-dark-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary transition"
            />
          </div>

          <div>
            <label className="block text-text-secondary text-sm mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark-light border border-dark-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white rounded-lg py-3 font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
