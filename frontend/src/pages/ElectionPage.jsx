import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWeb3 } from "../context/Web3Context";
import { electionsAPI } from "../services/api";
import Vote from "../components/Voter/Vote";
import Results from "../components/Dashboard/Results";

const ElectionPage = () => {

  const { id } = useParams();
  const electionId = id;

  const { user, isAuthenticated } = useAuth();
  const { account, isConnected } = useWeb3();

  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("vote");

  useEffect(() => {
    if (electionId) {
      fetchElection();
    } else {
      setError("Invalid Election ID");
      setLoading(false);
    }
  }, [electionId]);

  const fetchElection = async () => {
    try {

      setLoading(true);

      const response = await electionsAPI.getById(electionId);

      setElection(response.data.data);

    } catch (err) {

      console.error(err);

      setError(err.response?.data?.message || "Failed to fetch election");

    } finally {

      setLoading(false);

    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="card">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="card">
        <div className="alert alert-error">Election not found</div>
      </div>
    );
  }

  return (
    <div>

      <div className="page-header">
        <h1 className="page-title">{election.name}</h1>
        <p className="page-subtitle">{election.description}</p>

        <div style={{ marginTop: "1rem" }}>
          <span className={`election-status ${election.isActive ? "active" : "ended"}`}>
            {election.isActive ? "Active" : "Ended"}
          </span>
        </div>
      </div>


      <div className="grid grid-2" style={{ marginBottom: "2rem" }}>

        <div className="card">

          <h3>Election Details</h3>

          <p>
            <strong>Start Time:</strong> {formatDate(election.startTime)}
          </p>

          <p>
            <strong>End Time:</strong> {formatDate(election.endTime)}
          </p>

          <p>
            <strong>Candidates:</strong> {election.candidates?.length || 0}
          </p>

          <p>
            <strong>Registered Voters:</strong> {election.registeredVoters?.length || 0}
          </p>

        </div>


        <div className="card">

          <h3>Your Status</h3>

          {isAuthenticated ? (
            <>
              <p>
                <strong>Logged in as:</strong> {user?.name}
              </p>

              <p>
                <strong>Role:</strong> {user?.role}
              </p>

              {isConnected ? (
                <p>
                  <strong>Wallet:</strong> {account?.slice(0,6)}...{account?.slice(-4)}
                </p>
              ) : (
                <p style={{ color: "red" }}>
                  Please connect wallet to vote
                </p>
              )}

            </>
          ) : (
            <p>Please login to participate</p>
          )}

        </div>

      </div>


      {isAuthenticated && election.isActive && (

        <div style={{ marginBottom: "2rem" }}>

          <button
            onClick={() => setActiveTab("vote")}
            className={`btn ${activeTab === "vote" ? "btn-primary" : "btn-secondary"}`}
            style={{ marginRight: "1rem" }}
          >
            Vote
          </button>

          <button
            onClick={() => setActiveTab("results")}
            className={`btn ${activeTab === "results" ? "btn-primary" : "btn-secondary"}`}
          >
            Results
          </button>

        </div>

      )}


      {activeTab === "vote" ? (

        isAuthenticated ? (

          election.isActive ? (

            <Vote
              electionId={electionId}
              candidates={election.candidates || []}
            />

          ) : (

            <div className="card">

              <div className="alert alert-info">
                This election has ended
              </div>

              <Results electionId={electionId} />

            </div>

          )

        ) : (

          <div className="card">
            <div className="alert alert-info">
              Please login to vote
            </div>
          </div>

        )

      ) : (

        <Results electionId={electionId} />

      )}

    </div>
  );
};

export default ElectionPage;
