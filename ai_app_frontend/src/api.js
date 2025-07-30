/**
 * API helper functions for interacting with the backend.  The base URL is
 * configurable via the environment variable REACT_APP_API_BASE_URL.  If not
 * provided, it defaults to http://localhost:8000.
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Submit a candidate's application.  Expects an object containing name,
 * phone and an array of answers.  Returns the JSON response from the server.
 *
 * @param {Object} payload
 */
export async function submitCandidate(payload) {
  const response = await fetch(`${API_BASE_URL}/candidates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to submit candidate');
  }
  return response.json();
}

/**
 * Get evaluation status for a candidate submission.
 *
 * @param {number} candidateId
 */
export async function getEvaluationStatus(candidateId) {
  const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}/status`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to get evaluation status');
  }
  return response.json();
}

/**
 * Authenticate an employer using a username and password.  Returns a token
 * which should be stored by the client for subsequent authenticated calls.
 *
 * @param {{username: string, password: string}} credentials
 */
export async function loginEmployer(credentials) {
  const response = await fetch(`${API_BASE_URL}/employer/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to login employer');
  }
  return response.json();
}

/**
 * Retrieve all candidate submissions.  Expects an authorization token.  Returns
 * an array of candidate objects each with name, phone, answers and evaluation
 * information.
 *
 * @param {string} token
 */
export async function fetchCandidates(token) {
  const response = await fetch(`${API_BASE_URL}/candidates`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to fetch candidates');
  }
  return response.json();
}