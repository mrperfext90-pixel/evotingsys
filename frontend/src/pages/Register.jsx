import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../context/Web3Context';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    aadharId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { register } = useAuth();
  const { account, connectWallet } = useWeb3();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!account) {
      setError('Please connect your MetaMask wallet first');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        ...formData,
        walletAddress: account
      };
      const user = await register(userData);
      
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/voter');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Register</h2>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Aadhar ID</label>
            <input
              type="text"
              name="aadharId"
              className="form-input"
              value={formData.aadharId}
              onChange={handleChange}
              required
              placeholder="12-digit Aadhar ID"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Wallet Address</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                className="form-input"
                value={account || 'Please connect MetaMask'}
                disabled
                style={{ flex: 1 }}
              />
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={async () => { try { await connectWallet(); } catch (err) { setError(err.message); } }}
                disabled={!!account}
              >
                {account ? 'Connected' : 'Connect Wallet'}
              </button>
            </div>
            {!account && <small style={{ color: 'red' }}>Please connect MetaMask to register</small>}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || !account}
            style={{ width: '100%' }}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
