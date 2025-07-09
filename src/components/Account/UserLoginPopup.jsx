import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { login, sync } from '../../api/apis';

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 mr-2 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
  </svg>
);

const UserLoginPopup = ({ isOpen }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    doLogin({ userName: username, password });
  }

  const doLogin = async (obj) => {
    try {
      let res = await login(obj);
      if (res.status) {
        sync(res.creds);
      } else {
        setError(res.errorMessage || 'Login Failed. Please try again');
      }
    } catch (err) {
      setError(err.message || 'Login Failed. Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 font-family-roboto">
      <div className="bg-dark-bg rounded-xl shadow-2xl border border-neutral-700 w-full max-w-md p-0 relative">
        {/* Header */}
        <div className="bg-header-green rounded-t-xl px-6 py-3 text-lg font-bold text-black">Login To Trade</div>
        {/* Error message */}
        {error && (
          <div className="text-red-400 bg-dark-bg border border-red-400 rounded mt-6 mx-8 mb-2 px-4 py-2 text-center text-lg">
            {error}
          </div>
        )}
        {/* Form */}
        <form className="flex flex-col gap-2 px-8 py-6" onSubmit={handleLogin}>
          <label className="text-neutral-400 text-sm font-bold mt-2" htmlFor="username">User Name / User Email</label>
          <input
            id="username"
            type="text"
            className="rounded bg-neutral-900 border border-neutral-600 px-3 py-2 text-white focus:outline-none focus:border-green-400"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
            autoComplete="username"
            disabled={loading}
          />
          <label className="text-neutral-400 text-sm font-bold mt-2" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="rounded bg-neutral-900 border border-neutral-600 px-3 py-2 text-white focus:outline-none focus:border-green-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={loading}
          />
          <div className="flex gap-4 mt-2">
            <button
              type="submit"
              className="flex-1 border-2 border-green-500 text-green-500 rounded py-2 font-semibold hover:bg-green-500 hover:text-black transition flex items-center justify-center"
              disabled={loading}
            >
              {loading && <Spinner />}
              Login
            </button>
            <button
              type="button"
              className="flex-1 border-2 border-green-500 text-green-500 rounded py-2 font-semibold hover:bg-green-500 hover:text-black transition"
              disabled={loading}
            >
              Sign Up
            </button>
          </div>
          <div className="flex items-center my-2">
            <div className="flex-1 h-px bg-neutral-700" />
            <span className="mx-2 text-neutral-500 text-sm">or</span>
            <div className="flex-1 h-px bg-neutral-700" />
          </div>
          <div className="flex items-center justify-center">
          <GoogleOAuthProvider clientId="805608009371-kejkesbrfh7k05a5te73nju1o7d1ka51.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={credentialResponse => {
                if (credentialResponse.credential) {
                  setLoading(true);
                  doLogin({ googleSignInToken: credentialResponse.credential });
                } else {
                  setError('Google sign-in failed');
                }
              }}
              onError={() => {
                setError('Google sign-in failed');
              }}
              theme="outline"
              size="large"
            />
          </GoogleOAuthProvider>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserLoginPopup; 