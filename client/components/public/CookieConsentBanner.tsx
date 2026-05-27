"use client";

import { useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    // Check if user already consented
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      // Auto trigger after 1.5s
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const consentObj = { necessary: true, analytics: true, marketing: true };
    localStorage.setItem("cookie_consent", JSON.stringify(consentObj));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookie_consent", JSON.stringify(preferences));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-[90vw] md:max-w-[400px] w-full bg-navy text-white rounded-2xl border border-white/10 shadow-2xl p-6 animate-fade-up">
      <div className="flex items-center gap-3 mb-3">
        <ShieldCheck className="w-6 h-6 text-gold shrink-0" />
        <h4 className="font-serif text-base font-semibold tracking-wide text-white">We use cookies</h4>
      </div>

      <p className="text-gray-300 text-xs leading-relaxed mb-4">
        We use cookies to keep your portal session secure, optimize scheduling and remember your
        preferences. We don&apos;t process card details on our servers.
      </p>

      {showPreferences ? (
        <div className="space-y-3 mb-5 border-t border-white/10 pt-3">
          {/* Necessary */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold block text-white">Necessary</span>
              <span className="text-[10px] text-gray-400 block">Required for sign-in and booking flow.</span>
            </div>
            <input
              type="checkbox"
              disabled
              checked
              className="accent-gold h-4 w-4 rounded border-gray-300 cursor-not-allowed"
            />
          </div>

          {/* Analytics */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold block text-white">Analytics</span>
              <span className="text-[10px] text-gray-400 block">Helps us monitor patient visit loads.</span>
            </div>
            <input
              type="checkbox"
              checked={preferences.analytics}
              onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
              className="accent-gold h-4 w-4 rounded border-gray-300 cursor-pointer"
            />
          </div>

          {/* Marketing */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold block text-white">Marketing</span>
              <span className="text-[10px] text-gray-400 block">Google review prompt integrations.</span>
            </div>
            <input
              type="checkbox"
              checked={preferences.marketing}
              onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
              className="accent-gold h-4 w-4 rounded border-gray-300 cursor-pointer"
            />
          </div>

          <button
            onClick={handleSavePreferences}
            className="w-full bg-white text-navy font-semibold text-xs py-2 rounded-lg hover:bg-gray-100 transition-colors mt-2"
          >
            Save Preferences
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={handleAcceptAll}
            className="flex-1 bg-gold hover:bg-gold-dark text-navy font-bold text-xs py-2.5 rounded-lg shadow transition-colors"
          >
            Accept All
          </button>
          <button
            onClick={() => setShowPreferences(true)}
            className="flex-1 border border-white/20 hover:border-white/40 text-white font-medium text-xs py-2.5 rounded-lg transition-colors"
          >
            Customize
          </button>
        </div>
      )}
    </div>
  );
}
