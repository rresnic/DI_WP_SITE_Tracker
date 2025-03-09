import { useState } from 'react';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";


const ForgottenPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/users/reset-password`, {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('If an account with that email exists, a password reset link has been sent.');
      } else {
        setError(result.message || 'An error occurred. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Forgot your password?</h2>
      <p>Enter your email address, and we will send you a password reset link.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          required
          placeholder="Enter your email"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ForgottenPassword;
