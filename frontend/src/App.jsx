import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Web3Provider } from './context/Web3Context';
import Navbar from './components/Common/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import VoterDashboard from './pages/VoterDashboard';
import ElectionPage from './pages/ElectionPage';



function App() {
  return (
    <AuthProvider>
      <Web3Provider>
        <Router>
          <div className="app">
            <Navbar />
            <div className="container">
              <Routes>
               

                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/voter" element={<VoterDashboard />} />
                <Route path="/election/:id" element={<ElectionPage />} />
              </Routes>
            </div>
          </div>
        </Router>
      </Web3Provider>
    </AuthProvider>
  );
}

export default App;
