'use client';

import { useState, useCallback, useEffect } from 'react';
import { ISessionApi, IParameterApi } from '@shapediver/viewer';
import { Share2, Copy, Check, Link2, QrCode, X } from 'lucide-react';

interface ShareURLProps {
  session: ISessionApi | null;
  parameters: IParameterApi<unknown>[];
}

export function ShareURL({ session, parameters }: ShareURLProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Generate shareable URL with current parameter state
  const generateShareUrl = useCallback(() => {
    if (!session || parameters.length === 0) return '';

    try {
      // Collect current parameter values
      const state: Record<string, string | number | boolean> = {};
      
      parameters.forEach((param) => {
        if (param.value !== undefined && param.value !== param.defval) {
          state[param.id] = param.value as string | number | boolean;
        }
      });

      // Encode state to base64
      const encodedState = btoa(JSON.stringify(state));
      
      // Build URL
      const url = new URL(window.location.href);
      url.searchParams.set('config', encodedState);
      
      return url.toString();
    } catch (err) {
      console.error('Error generating share URL:', err);
      return window.location.href;
    }
  }, [session, parameters]);

  // Update share URL when dialog opens
  useEffect(() => {
    if (isOpen) {
      setShareUrl(generateShareUrl());
    }
  }, [isOpen, generateShareUrl]);

  // Copy URL to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareUrl]);

  // Generate QR code URL using external service
  const qrCodeUrl = shareUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`
    : '';

  return (
    <>
      {/* Share Button */}
      <button
        onClick={() => setIsOpen(true)}
        disabled={!session}
        className="flex items-center gap-2 px-3 py-2 bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-lg text-sm text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Share Configuration"
      >
        <Share2 className="w-4 h-4" />
        <span className="hidden sm:inline">Share</span>
      </button>

      {/* Share Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Dialog */}
          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-zinc-400" />
                <h3 className="text-lg font-semibold text-zinc-100">
                  Share Configuration
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* URL Input */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">
                  Shareable Link
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg">
                    <Link2 className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 bg-transparent text-sm text-zinc-300 outline-none truncate"
                    />
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* QR Code Toggle */}
              <div>
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  <span>{showQR ? 'Hide QR Code' : 'Show QR Code'}</span>
                </button>

                {/* QR Code */}
                {showQR && (
                  <div className="mt-3 flex justify-center">
                    <div className="p-4 bg-white rounded-lg">
                      <img
                        src={qrCodeUrl}
                        alt="QR Code"
                        width={200}
                        height={200}
                        className="block"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3 bg-zinc-800/50 rounded-lg">
                <p className="text-xs text-zinc-500">
                  This link contains your current configuration. Anyone with this
                  link can view your customized model.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 p-4 border-t border-zinc-800">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Hook to load configuration from URL
export function useShareURLLoader(
  session: ISessionApi | null,
  onParameterChange: (id: string, value: string | number | boolean) => void
) {
  useEffect(() => {
    if (!session) return;

    try {
      const url = new URL(window.location.href);
      const configParam = url.searchParams.get('config');
      
      if (configParam) {
        // Decode the configuration
        const state = JSON.parse(atob(configParam)) as Record<string, string | number | boolean>;
        
        // Apply parameter values
        Object.entries(state).forEach(([id, value]) => {
          if (session.parameters[id]) {
            onParameterChange(id, value);
          }
        });
        
        // Clean up URL
        url.searchParams.delete('config');
        window.history.replaceState({}, '', url.toString());
      }
    } catch (err) {
      console.error('Error loading configuration from URL:', err);
    }
  }, [session, onParameterChange]);
}
