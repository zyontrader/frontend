import React, { useState } from 'react';
import { sendConfirmationEmail } from '../../api/apis';


const UserConfirmationPopup = ({ isOpen }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleResend = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await sendConfirmationEmail();
      setMessage('Confirmation email resent! Please check your inbox.');
    } catch (e) {
      setError('Could not send the confirmation email. Please try again.')
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed  inset-0 z-50 flex items-center justify-center bg-neutral-500/40 font-family-roboto">
      <div className="bg-neutral-900 rounded-xl shadow-lg border border-neutral-600 relative w-[500px]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 rounded-t-xl bg-brighter-green">
          <span className="text-base font-bold text-neutral-800">Confirm Your Email</span>
        </div>
        {/* Content */}
        <div className="flex flex-col items-center py-8 px-6">
          {message && <div className="mb-4 text-price-green text-center">{message}</div>}
          {error && <div className="mb-4 text-price-red text-center">{error}</div>}
          <div className="mb-6 text-neutral-400 text-center text-base">
            <div className='mt-2'>
              You need to confirm your email you entered for this account.
            </div>
            <div className='mt-2'>
              Please check your registered email account with the necessary instructions.
            </div>
            <div className='mt-2'>
              In case you have not received an email, you can resend it by clicking the button below.
            </div>
          </div>
          <button
            className="py-2 px-8 rounded-md border border-brighter-green text-brighter-green font-bold text-base bg-price-green/20 hover:bg-price-green/40 active:bg-price-green/70 disabled:opacity-60"
            onClick={handleResend}
            disabled={loading}>
            {loading ? 'Resending...' : 'Resend Confirmation Email'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserConfirmationPopup; 