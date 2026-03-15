import { useState } from 'react';
import { useWeb3 } from '../../context/Web3Context';

const WalletConnect = () => {
  const { account, connectWallet, disconnectWallet, loading, isConnected } = useWeb3();
  const [error, setError] = useState(null);

  const handleConnect = async () => {
    try {
      setError(null);
      await connectWallet();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected) {
    return (
      <div className="wallet-connect">
        <div className="wallet-address">
          {formatAddress(account)}
        </div>
        <button onClick={handleDisconnect} className="btn btn-secondary">
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="wallet-connect">
      <button 
        onClick={handleConnect} 
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? 'Connecting...' : 'Connect Wallet'}
      </button>
      {error && <span className="alert alert-error">{error}</span>}
    </div>
  );
};

export default WalletConnect;
