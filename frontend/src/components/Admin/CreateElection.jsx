import { useState } from 'react';
import { electionsAPI } from '../../services/api';

const CreateElection = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    durationInMinutes: 60
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

    try {
      await electionsAPI.create(formData);
      setFormData({ name: '', description: '', durationInMinutes: 60 });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create election');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="card-header">Create New Election</h3>
      
      {error && <div className="alert alert-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Election Name</label>
          <input
            type="text"
            name="name"
            className="form-input"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Presidential Election 2024"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-input"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Enter election description..."
            rows="4"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Duration (minutes)</label>
          <input
            type="number"
            name="durationInMinutes"
            className="form-input"
            value={formData.durationInMinutes}
            onChange={handleChange}
            required
            min="1"
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Election'}
        </button>
      </form>
    </div>
  );
};

export default CreateElection;
