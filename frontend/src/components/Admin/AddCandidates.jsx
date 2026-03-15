import { useState } from 'react';
import { electionsAPI } from '../../services/api';

const AddCandidates = ({ electionId, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    party: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
    setSuccess(null);

    try {
      await electionsAPI.addCandidate(electionId, formData);
      setFormData({ name: '', party: '' });
      setSuccess('Candidate added successfully!');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add candidate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="card-header">Add Candidate</h3>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Candidate Name</label>
          <input
            type="text"
            name="name"
            className="form-input"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., John Doe"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Party/Organization</label>
          <input
            type="text"
            name="party"
            className="form-input"
            value={formData.party}
            onChange={handleChange}
            required
            placeholder="e.g., Democratic Party"
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Candidate'}
        </button>
      </form>
    </div>
  );
};

export default AddCandidates;
