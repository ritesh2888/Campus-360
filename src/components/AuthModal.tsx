import React, { useState } from 'react';
import { CheckCircle2, KeyRound, Lock, Phone, RefreshCw, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { MiniMothService } from '../services/minimoth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { session, login, logout, user } = useCampus();
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 43210');
  const [otp, setOtp] = useState('123456');
  const [step, setStep] = useState<'phone' | 'otp' | 'session'>('phone');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [apiKey, setApiKey] = useState(() => MiniMothService.getStoredApiKey());
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = async (phoneToUse?: string) => {
    const targetPhone = phoneToUse || phoneNumber;
    if (!targetPhone || targetPhone.length < 10) {
      setStatusMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    setStatusMsg('');

    try {
      const res = await MiniMothService.sendOTP(targetPhone);
      setLoading(false);
      if (res.success) {
        setStep('otp');
        setStatusMsg(res.message);
      } else {
        setStatusMsg('Failed to send OTP: ' + res.message);
      }
    } catch {
      setLoading(false);
      setStatusMsg('Error communicating with MiniMoth.');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      setStatusMsg('Please enter the 6-digit OTP.');
      return;
    }
    setLoading(true);
    setStatusMsg('');

    try {
      const res = await MiniMothService.verifyOTP(phoneNumber, otp, {
        name: user?.name,
        rollNo: user?.rollNo,
        division: user?.division,
        branch: user?.branch,
      });
      setLoading(false);

      if (res.success && res.session) {
        login(res.session);
        setStep('session');
        setStatusMsg('Successfully authenticated with MiniMoth token session!');
      } else {
        setStatusMsg(res.message || 'Invalid OTP code.');
      }
    } catch {
      setLoading(false);
      setStatusMsg('Verification failed. Try sandbox code 123456.');
    }
  };

  const handleQuickSandboxLogin = async () => {
    setPhoneNumber('+91 98765 43210');
    setOtp('123456');
    setLoading(true);
    await MiniMothService.sendOTP('+919876543210');
    const res = await MiniMothService.verifyOTP('+919876543210', '123456', {
      name: 'Ritesh Yadav',
      rollNo: '62',
      division: 'D4B',
      branch: 'Electronics & Telecommunication Engineering',
      year: 'First Year (FE)',
    });
    setLoading(false);
    if (res.success && res.session) {
      login(res.session);
      setStep('session');
      setStatusMsg('Quick Demo Login successful via MiniMoth sandbox!');
    }
  };

  const handleRefreshToken = async () => {
    setLoading(true);
    const refreshed = await MiniMothService.refreshToken();
    setLoading(false);
    if (refreshed) {
      login(refreshed);
      setStatusMsg('MiniMoth access token successfully refreshed! Expiry extended.');
    }
  };

  const handleSaveApiKey = () => {
    MiniMothService.setApiKey(apiKey);
    setShowApiKeyInput(false);
    setStatusMsg('MiniMoth API Key saved. Live endpoints will now be used.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-slate-800 dark:text-slate-100 transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-50 dark:bg-indigo-600/30 border border-indigo-200 dark:border-indigo-500/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-slate-900 dark:text-white">MiniMoth Authentication</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Secure Phone OTP & Token Sessions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div className="mb-4 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-xs text-indigo-800 dark:text-indigo-200">
            {statusMsg}
          </div>
        )}

        {/* Step: Already Logged In / View Session */}
        {session && step === 'session' ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Status:</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Authenticated
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">User:</span>
                <span className="font-medium text-slate-900 dark:text-slate-200">{session.user.name} ({session.user.rollNo})</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Phone:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{session.user.phone}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Access Token:</span>
                <span className="font-mono text-[11px] text-indigo-700 dark:text-indigo-300 truncate max-w-[200px]">
                  {session.accessToken}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Session Expiry:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {new Date(session.expiresAt).toLocaleTimeString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleRefreshToken}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-600/30 border border-indigo-200 dark:border-indigo-500/50 hover:bg-indigo-100 dark:hover:bg-indigo-600/40 text-indigo-700 dark:text-indigo-200 text-xs font-medium transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                Refresh Token
              </button>
              <button
                onClick={() => {
                  logout();
                  setStep('phone');
                }}
                className="py-2 px-3 rounded-xl bg-rose-50 dark:bg-rose-600/20 border border-rose-200 dark:border-rose-500/40 hover:bg-rose-100 dark:hover:bg-rose-600/30 text-rose-700 dark:text-rose-300 text-xs font-medium transition"
              >
                Sign Out
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold shadow-xs transition"
            >
              Continue to Campus360
            </button>
          </div>
        ) : step === 'phone' ? (
          /* Step 1: Enter Phone Number */
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Indian Mobile Number (WhatsApp / SMS)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 font-mono transition"
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                MiniMoth delivers OTP directly via WhatsApp with automated SMS fallback.
              </p>
            </div>

            <button
              onClick={() => handleSendOtp()}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white font-medium text-sm transition flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/20"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Send Verification OTP
                </>
              )}
            </button>

            {/* Quick Demo Sandbox Button for Judges */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleQuickSandboxLogin}
                className="w-full py-2 px-3 rounded-xl bg-emerald-50 dark:bg-gradient-to-r dark:from-emerald-600/20 dark:to-teal-600/20 border border-emerald-300 dark:border-emerald-500/40 hover:bg-emerald-100 dark:hover:border-emerald-500 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ⚡ Judge / Quick Demo Mode (1-Click Instant Login)
              </button>
              <p className="text-[10px] text-center text-slate-500 dark:text-slate-400 mt-1">
                Bypasses SMS quotas with pre-configured student token session.
              </p>
            </div>

            {/* Live MiniMoth API Key Setting toggle */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center justify-center gap-1 mx-auto"
              >
                <KeyRound className="w-3.5 h-3.5" />
                {showApiKeyInput ? 'Hide MiniMoth API Config' : 'Configure Live MiniMoth API Key (Optional)'}
              </button>

              {showApiKeyInput && (
                <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-left space-y-2">
                  <label className="text-[11px] text-slate-700 dark:text-slate-300 block font-medium">
                    MiniMoth Bearer API Token:
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="mm_live_..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={handleSaveApiKey}
                    className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs text-white font-medium shadow-xs"
                  >
                    Save API Key
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Step 2: Enter OTP */
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Enter 6-Digit OTP Code
                </label>
                <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">Sandbox Code: 123456</span>
              </div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                maxLength={6}
                className="w-full text-center tracking-widest text-lg font-mono py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 text-center">
                Sent to <span className="font-mono text-slate-700 dark:text-slate-300">{phoneNumber}</span>
              </p>
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white font-medium text-sm transition flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/20"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Verify & Issue Session Token
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                onClick={() => setStep('phone')}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              >
                Change Phone
              </button>
              <button
                onClick={() => handleSendOtp()}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold"
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
