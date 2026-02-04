'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { IViewportApi, ISessionApi } from '@shapediver/viewer';
import { Smartphone, QrCode, X, Loader2, AlertCircle } from 'lucide-react';

interface ARViewButtonProps {
  viewport: IViewportApi | null;
  session: ISessionApi | null;
}

export function ARViewButton({ viewport, session }: ARViewButtonProps) {
  const [isARSupported, setIsARSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [arUrl, setArUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check AR support on mount
  useEffect(() => {
    const checkARSupport = async () => {
      // Check for WebXR support
      if ('xr' in navigator) {
        try {
          const isSupported = await (navigator as any).xr?.isSessionSupported?.(
            'immersive-ar'
          );
          setIsARSupported(!!isSupported);
        } catch {
          // WebXR not fully supported
          setIsARSupported(false);
        }
      }

      // Also check viewport AR session support
      if (viewport && (viewport as any).arSession?.isSupported) {
        setIsARSupported(true);
      }
    };

    checkARSupport();
  }, [viewport]);

  // Generate AR URL for QR code
  const generateARUrl = useCallback(async () => {
    if (!session) return null;

    try {
      // Try to get glTF export for AR viewing
      const exports = Object.values(session.exports);
      const gltfExport = exports.find(
        (exp) =>
          exp.name?.toLowerCase().includes('gltf') ||
          exp.type?.toLowerCase().includes('gltf')
      );

      if (gltfExport) {
        const result = await gltfExport.request();
        if (result.content && result.content.length > 0) {
          return result.content[0].href;
        }
      }

      return null;
    } catch (err) {
      console.error('Error generating AR URL:', err);
      return null;
    }
  }, [session]);

  // Handle AR button click
  const handleARClick = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      // Check if on mobile and WebXR is supported
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile && isARSupported && viewport) {
        // Try to start AR session directly
        const arSession = (viewport as any).arSession;
        if (arSession?.isSupported) {
          await arSession.start();
          return;
        }
      }

      // Fallback: Show QR code for mobile viewing
      const url = await generateARUrl();
      if (url) {
        setArUrl(url);
        setShowQRModal(true);
      } else {
        setError('AR export not available for this model');
      }
    } catch (err) {
      console.error('AR error:', err);
      setError('Failed to start AR session');
    } finally {
      setIsLoading(false);
    }
  }, [viewport, isARSupported, generateARUrl]);

  // Generate QR code URL
  const qrCodeUrl = arUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(arUrl)}`
    : '';

  // Don't render if no session
  if (!session) return null;

  return (
    <>
      {/* AR Button */}
      <button
        onClick={handleARClick}
        disabled={isLoading}
        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-sm text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
        title="View in AR"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Smartphone className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">AR View</span>
      </button>

      {/* QR Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowQRModal(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-zinc-100">
                  View in AR
                </h3>
              </div>
              <button
                onClick={() => setShowQRModal(false)}
                className="p-1 text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {error ? (
                <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-800 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              ) : (
                <>
                  {/* QR Code */}
                  <div className="flex justify-center">
                    <div className="p-4 bg-white rounded-lg">
                      {qrCodeUrl ? (
                        <Image
                          src={qrCodeUrl}
                          alt="AR QR Code"
                          width={200}
                          height={200}
                          className="block"
                        />
                      ) : (
                        <div className="w-[200px] h-[200px] flex items-center justify-center">
                          <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="space-y-2 text-center">
                    <p className="text-sm text-zinc-300">
                      Scan this QR code with your phone to view the model in AR
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
                      <QrCode className="w-4 h-4" />
                      <span>Works on iOS and Android devices</span>
                    </div>
                  </div>

                  {/* Direct Link */}
                  {arUrl && (
                    <div className="pt-4 border-t border-zinc-800">
                      <a
                        href={arUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-zinc-300 text-center transition-colors"
                      >
                        Open 3D Model Link
                      </a>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
