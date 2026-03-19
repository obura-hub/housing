'use client';

import { useRouter } from 'next/navigation';

interface TermsAndConditionsModalProps {
  onAccept: () => void;
  onCancel: () => void;
}

export default function TermsAndConditionsModal({ onAccept, onCancel }: TermsAndConditionsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Terms and Conditions</h2>
          <p className="text-sm text-gray-500 mt-1">
            Please read and accept the terms to view our projects
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-gray-700">
          <p>
            By accessing and viewing the Nairobi County affordable housing projects, you agree to the following terms and conditions:
          </p>
          <ol className="list-decimal list-inside space-y-3">
            <li>
              <strong>Eligibility:</strong> You must be  Nairobi County employee and meet the eligibility criteria for the Affordable Housing Program.
            </li>
            <li>
              <strong>Accuracy of Information:</strong> All project information displayed is subject to change. We recommend verifying details with our offices before making any commitments.
            </li>
            <li>
              <strong>Personal Use:</strong> The information provided is for personal use only. Commercial use or redistribution without authorization is prohibited.
            </li>
            <li>
              <strong>Privacy:</strong> Your use of this platform is governed by our Privacy Policy. We collect and process your data in accordance with applicable laws.
            </li>
            <li>
              <strong>No Guarantee:</strong> Viewing projects does not guarantee allocation. Unit allocation is subject to availability and program requirements.
            </li>
          </ol>
          <p className="text-sm text-gray-500 pt-2">
            By clicking &quot;Accept&quot;, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions.
          </p>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onAccept}
            className="px-6 py-2.5 bg-[#15B76C] text-white rounded-lg hover:bg-[#0F854E] transition-colors font-semibold"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
