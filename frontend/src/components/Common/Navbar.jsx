import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import WalletConnect from './WalletConnect';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" className="nav-brand">
          E-VOTING SYSTEM
        </Link>
      </div>
      
      <div className="nav-links">
        <Link to="/" className="nav-btn nav-btn-home">
          Home
        </Link>
        
        {!isAuthenticated ? (
          <>
            <button onClick={() => navigate('/login')} className="nav-btn nav-btn-login" style={{ cursor: 'pointer' }}>
              Login
            </button>
            <button onClick={() => navigate('/register')} className="nav-btn nav-btn-register" style={{ cursor: 'pointer' }}>
              Register
            </button>
          </>
        ) : (
          <>
            <Link 
              to={isAdmin ? "/admin" : "/voter"} 
              className="nav-btn nav-btn-home"
            >
              Dashboard
            </Link>
            <WalletConnect />
            <button 
              onClick={handleLogout} 
              className="nav-btn nav-btn-register"
              style={{ cursor: 'pointer' }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
