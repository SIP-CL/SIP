import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const history = useHistory();  // Hook for navigation

  // State variables to manage form inputs and error messages
  const [username, setUsername] = useState('');  // Stores the username
  const [password, setPassword] = useState('');  // Stores the password
  const [error, setError] = useState<string>('');  // Stores error messages (invalid login or account exists)
  const [isSignup, setIsSignup] = useState<boolean>(false);  // Toggle between login and signup forms

  // Handles the login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();  // Prevent default form submission

    // Simulate API call to validate login
    const isValidUser = await fakeLoginApi(username, password);

    // If the login is successful, redirect to dashboard
    if (isValidUser) {
      history.push('/feed');  // Navigate to dashboard page after successful login
    } else {
      setError('Invalid username or password');  // Show error if login fails
    }
  };

  // Handles the signup form submission
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();  // Prevent default form submission

    // Simulate API call to create a new account
    const isUserCreated = await fakeSignupApi(username, password);

    // If account creation is successful, redirect to dashboard
    if (isUserCreated) {
      history.push('/feed');  // Navigate to dashboard page after successful signup
    } else {
      setError('Account already exists');  // Show error if account already exists
    }
  };

  // Simulate a fake API call for login validation
  const fakeLoginApi = async (username: string, password: string): Promise<boolean> => {
    // This simulates a login where only 'testUser' and 'password123' are valid
    return username === 'testUser' && password === 'password123';
  };

  // Simulate a fake API call for creating a new user
  const fakeSignupApi = async (username: string, password: string): Promise<boolean> => {
    // This simulates checking for an existing user, returns false if the username is 'existingUser'
    return username !== 'existingUser';  // Simulate an existing user scenario
  };

  return (
    <div className="login-page">
      {/* Heading changes based on the isSignup state */}
      <h2>{isSignup ? 'Create Account' : 'Login'}</h2>

      {/* Conditionally switch between the login and signup forms */}
      <form onSubmit={isSignup ? handleSignup : handleLogin}>
        {/* Username input field */}
        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}  // Update username state on input change
            required
          />
        </div>
        
        {/* Password input field */}
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}  // Update password state on input change
            required
          />
        </div>

        {/* Display error message if any */}
        {error && <p className="error">{error}</p>}

        {/* Submit button text changes based on the form type (Login or Sign Up) */}
        <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
      </form>

      {/* Toggle between Login and Signup forms */}
      <p className="switch-form">
        {isSignup ? (
          // If it's the signup form, show a message to switch to login
          <>
            Already have an account?{' '}
            <span onClick={() => setIsSignup(false)} className="link">Login</span>
          </>
        ) : (
          // If it's the login form, show a message to switch to signup
          <>
            Don't have an account?{' '}
            <span onClick={() => setIsSignup(true)} className="link">Create one</span>
          </>
        )}
      </p>
    </div>
  );
};

export default LoginPage;
