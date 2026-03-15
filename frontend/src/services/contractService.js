import { ethers } from 'ethers';

const CONTRACT_ABI = [
  "function createElection(string memory _name, string memory _description, uint256 _durationInMinutes) external returns (uint256)",
  "function addCandidate(uint256 _electionId, string memory _name, string memory _party) external",
  "function registerVoter(uint256 _electionId, address _voter) external",
  "function registerVoters(uint256 _electionId, address[] memory _voters) external",
  "function vote(uint256 _electionId, uint256 _candidateId) external",
  "function getElection(uint256 _electionId) external view returns (uint256, string memory, string memory, address, uint256, uint256, bool, uint256)",
  "function getAllCandidates(uint256 _electionId) external view returns (tuple(uint256 id, string name, string party, uint256 voteCount, bool exists)[] memory)",
  "function hasVotedFor(uint256 _electionId, address _voter) external view returns (bool)",
  "function isRegistered(uint256 _electionId, address _voter) external view returns (bool)",
  "function getWinner(uint256 _electionId) external view returns (string memory, uint256)",
  "function electionCount() external view returns (uint256)",
  "event VoteCast(uint256 indexed electionId, uint256 indexed candidateId, address voter)",
  "event ElectionCreated(uint256 indexed electionId, string name, uint256 startTime, uint256 endTime)",
  "event CandidateAdded(uint256 indexed electionId, uint256 candidateId, string name, string party)"
];

class ContractService {
  constructor() {
    this.contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || '';
    this.contract = null;
  }

  initialize(signerOrProvider) {
    if (!this.contractAddress) {
      throw new Error('Contract address not configured');
    }
    this.contract = new ethers.Contract(this.contractAddress, CONTRACT_ABI, signerOrProvider);
    return this.contract;
  }

  // Election functions
  async createElection(name, description, durationInMinutes) {
    const tx = await this.contract.createElection(name, description, durationInMinutes);
    return await tx.wait();
  }

  async getElection(electionId) {
    const result = await this.contract.getElection(electionId);
    return {
      id: result[0],
      name: result[1],
      description: result[2],
      admin: result[3],
      startTime: Number(result[4]),
      endTime: Number(result[5]),
      isActive: result[6],
      candidateCount: Number(result[7])
    };
  }

  async getElectionCount() {
    return await this.contract.electionCount();
  }

  // Candidate functions
  async addCandidate(electionId, name, party) {
    const tx = await this.contract.addCandidate(electionId, name, party);
    return await tx.wait();
  }

  async getAllCandidates(electionId) {
    const candidates = await this.contract.getAllCandidates(electionId);
    return candidates.map((c, index) => ({
      candidateId: index,
      name: c.name,
      party: c.party,
      voteCount: Number(c.voteCount)
    }));
  }

  // Voter functions
  async registerVoter(electionId, voterAddress) {
    const tx = await this.contract.registerVoter(electionId, voterAddress);
    return await tx.wait();
  }

  async registerVoters(electionId, voters) {
    const tx = await this.contract.registerVoters(electionId, voters);
    return await tx.wait();
  }

  async isRegistered(electionId, voterAddress) {
    return await this.contract.isRegistered(electionId, voterAddress);
  }

  // Voting functions
  async vote(electionId, candidateId) {
    const tx = await this.contract.vote(electionId, candidateId);
    return await tx.wait();
  }

  async hasVotedFor(electionId, voterAddress) {
    return await this.contract.hasVotedFor(electionId, voterAddress);
  }

  // Results
  async getWinner(electionId) {
    const result = await this.contract.getWinner(electionId);
    return {
      name: result[0],
      votes: Number(result[1])
    };
  }
}

export default new ContractService();
