'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Step = 'enter-id' | 'verify-otp';

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>('enter-id');
  const [idType, setIdType] = useState<'national-id' | 'personal-no'>('national-id');
  const [idNumber, setIdNumber] = useState('');
  const [dob, setDob] = useState(''); // Date of Birth field in DD/MM/YYYY format
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [storedDob, setStoredDob] = useState(''); // Store DOB for verification
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // Format DOB input to DD/MM/YYYY as user types
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Auto-format as DD/MM/YYYY
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (value.length >= 5) {
      value = value.slice(0, 5) + '/' + value.slice(5, 9);
    }
    
    // Limit to 10 characters (DD/MM/YYYY)
    if (value.length <= 10) {
      setDob(value);
    }
  };

  // Parse DD/MM/YYYY to Date object
  const parseDob = (dobString: string): Date | null => {
    const parts = dobString.split('/');
    if (parts.length !== 3) return null;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // JavaScript months are 0-indexed
    const year = parseInt(parts[2], 10);
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    if (day < 1 || day > 31) return null;
    if (month < 0 || month > 11) return null;
    if (year < 1900 || year > new Date().getFullYear()) return null;
    
    const date = new Date(year, month, day);
    
    // Check if the date is valid (e.g., Feb 30 would be invalid)
    if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
      return null;
    }
    
    return date;
  };

  // Validate DOB format (DD/MM/YYYY)
  const validateDob = (dobString: string): boolean => {
    const dobRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    return dobRegex.test(dobString);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!idNumber.trim()) {
      setError('Please enter your ID or personal number.');
      return;
    }

    if (!dob.trim()) {
      setError('Please enter your date of birth.');
      return;
    }

    // Validate DOB format (DD/MM/YYYY)
    if (!validateDob(dob)) {
      setError('Please enter date of birth in DD/MM/YYYY format (e.g., 15/03/1990).');
      return;
    }

    // Parse and validate DOB
    const dobDate = parseDob(dob);
    if (!dobDate || isNaN(dobDate.getTime())) {
      setError('Please enter a valid date of birth.');
      return;
    }

    // Validate date is not in the future
    const today = new Date();
    if (dobDate > today) {
      setError('Date of birth cannot be in the future.');
      return;
    }

    // Validate age (must be at least 18 years old)
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }

    if (age < 18) {
      setError('You must be at least 18 years old to register.');
      return;
    }

    setIsSending(true);
    try {
      // In a real app, call your backend here to:
      // 1. Verify ID number and DOB match in the database
      // 2. Send an SMS OTP to the registered phone number
      
      // Store the DOB for verification in the next step
      setStoredDob(dob);
      
      // For now, we simulate with a fixed demo OTP
      const demoOtp = '123456';
      setGeneratedOtp(demoOtp);
      setStep('verify-otp');
      setInfo('A one-time password has been sent to your registered phone number. (Demo OTP: 123456)');
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otp.trim()) {
      setError('Please enter the OTP sent to your phone.');
      return;
    }

    setIsVerifying(true);
    try {
      // In a real app, verify both OTP and DOB with your backend
      if (otp.trim() !== generatedOtp) {
        setError('Invalid OTP. Please try again.');
        return;
      }

      // Additional check: Verify DOB matches (in real app, this is done on backend)
      if (!storedDob) {
        setError('Session expired. Please start again.');
        return;
      }

      // On success, take the user to the projects page
      router.push('/projects');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                Get Started
              </h1>
              <p className="text-gray-700 text-center mb-6">
                Enter your details to receive a one-time password (OTP) on your registered phone number.
              </p>

              {step === 'enter-id' && (
                <form className="space-y-6" onSubmit={handleSendOtp}>
                  {/* ID Type */}
                  <div>
                    <p className="block text-sm font-medium text-gray-900 mb-2">
                      Select Identification Type
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setIdType('national-id')}
                        className={`rounded-lg border px-4 py-3 text-sm font-medium text-left transition-colors ${
                          idType === 'national-id'
                            ? 'border-[#16a34a] bg-[#e5f9ed] text-[#166534]'
                            : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        National ID Number
                      </button>
                      <button
                        type="button"
                        onClick={() => setIdType('personal-no')}
                        className={`rounded-lg border px-4 py-3 text-sm font-medium text-left transition-colors ${
                          idType === 'personal-no'
                            ? 'border-[#16a34a] bg-[#e5f9ed] text-[#166534]'
                            : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        Personal Number
                      </button>
                    </div>
                  </div>

                  {/* ID / Personal Number */}
                  <div>
                    <label
                      htmlFor="idNumber"
                      className="block text-sm font-medium text-gray-900 mb-2"
                    >
                      {idType === 'national-id' ? 'National ID Number' : 'Personal Number'}
                    </label>
                    <input
                      type="text"
                      id="idNumber"
                      name="idNumber"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-transparent"
                      placeholder={idType === 'national-id' ? 'Enter your ID number' : 'Enter your personal number'}
                      required
                    />
                  </div>

                  {/* Date of Birth in DD/MM/YYYY format */}
                  <div>
                    <label
                      htmlFor="dob"
                      className="block text-sm font-medium text-gray-900 mb-2"
                    >
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="dob"
                      name="dob"
                      value={dob}
                      onChange={handleDobChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-transparent font-mono text-lg tracking-wider"
                      placeholder="DD/MM/YYYY"
                      maxLength={10}
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Format: DD/MM/YYYY (e.g., 15/03/1990). Must match your registered date of birth.
                    </p>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  )}

                  {info && (
                    <div className="flex items-start gap-2 text-sm text-[#166534] bg-[#e5f9ed] border border-[#16a34a] rounded-md px-3 py-2">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{info}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full px-6 py-3 bg-[#16a34a] text-white rounded-lg hover:bg-[#166534] transition-colors font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSending ? 'Sending OTP...' : 'Send OTP'}
                  </button>

                  {/* Security Notice */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Two-Factor Authentication</p>
                        <p className="text-xs text-blue-700">
                          For your security, we verify your identity using both your date of birth and a one-time password sent to your registered phone number.
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {step === 'verify-otp' && (
                <form className="space-y-6" onSubmit={handleVerifyOtp}>
                  {/* Verification Summary */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                    <p className="text-sm font-medium text-gray-900 mb-2">Verification Details:</p>
                    <div className="space-y-1 text-sm text-gray-700">
                      <p><span className="font-medium">ID Type:</span> {idType === 'national-id' ? 'National ID' : 'Personal Number'}</p>
                      <p><span className="font-medium">ID Number:</span> {idNumber}</p>
                      <p><span className="font-medium">Date of Birth:</span> {storedDob}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-700 mb-2">
                      We have sent a one-time password to your registered phone number.
                    </p>
                    <label
                      htmlFor="otp"
                      className="block text-sm font-medium text-gray-900 mb-2"
                    >
                      Enter OTP <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="otp"
                      name="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-transparent tracking-[0.3em] text-center text-lg font-semibold"
                      placeholder="••••••"
                      maxLength={6}
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Check your phone for the 6-digit code
                    </p>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  )}

                  {info && (
                    <div className="flex items-start gap-2 text-sm text-[#166534] bg-[#e5f9ed] border border-[#16a34a] rounded-md px-3 py-2">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{info}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full px-6 py-3 bg-[#16a34a] text-white rounded-lg hover:bg-[#166534] transition-colors font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isVerifying ? 'Verifying...' : 'Verify & Login'}
                  </button>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setStep('enter-id');
                        setOtp('');
                        setGeneratedOtp('');
                        setStoredDob('');
                        setInfo(null);
                        setError(null);
                      }}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Change Details
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOtp('');
                        setError(null);
                        setInfo('New OTP sent! (Demo OTP: 123456)');
                      }}
                      className="flex-1 px-6 py-3 border border-[#16a34a] text-[#16a34a] rounded-lg hover:bg-[#e5f9ed] transition-colors text-sm font-medium"
                    >
                      Resend OTP
                    </button>
                  </div>

                  {/* Help Text */}
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      Didn't receive the code?{' '}
                      <button 
                        type="button"
                        className="text-[#16a34a] hover:text-[#166534] font-medium"
                        onClick={() => {
                          setInfo('Please check your phone or contact support if you continue to have issues.');
                        }}
                      >
                        Get help
                      </button>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
