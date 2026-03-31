"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Shield, Eye, Lock } from "lucide-react";

interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onCancel: () => void;
}

export default function TermsAndConditionsModal({
  isOpen,
  onAccept,
  onCancel,
}: TermsAndConditionsModalProps) {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setScrolledToBottom(false);
    }
  }, [isOpen]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 10;
    if (isBottom) {
      setScrolledToBottom(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800">
          <button
            onClick={onCancel}
            className="absolute right-4 top-4 p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Terms & Conditions
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Please read carefully before proceeding
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          className="flex-1 overflow-y-auto p-6 space-y-4 text-gray-700 dark:text-gray-300 max-h-[50vh]"
          onScroll={handleScroll}
        >
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 dark:text-blue-300">
                By accessing the Nairobi County affordable housing projects, you
                agree to the following terms.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Eligibility
                </h4>
                <p className="text-sm">
                  You must be a Nairobi County employee and meet the eligibility
                  criteria for the Affordable Housing Program.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Accuracy of Information
                </h4>
                <p className="text-sm">
                  All project information displayed is subject to change. We
                  recommend verifying details with our offices before making any
                  commitments.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Personal Use
                </h4>
                <p className="text-sm">
                  The information provided is for personal use only. Commercial
                  use or redistribution without authorization is prohibited.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Privacy
                </h4>
                <p className="text-sm">
                  Your use of this platform is governed by our Privacy Policy.
                  We collect and process your data in accordance with applicable
                  laws.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  No Guarantee
                </h4>
                <p className="text-sm">
                  Viewing projects does not guarantee allocation. Unit
                  allocation is subject to availability and program
                  requirements.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              By clicking &quot;Accept&quot;, you acknowledge that you have
              read, understood, and agree to be bound by these terms and
              conditions.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onAccept}
            className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
          >
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
