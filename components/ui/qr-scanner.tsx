'use client';

import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (errorMessage: string) => void;
}

export function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const callbacksRef = useRef({ onScanSuccess, onScanError });

  // Update callbacks ref when props change so we don't have to re-run the effect
  useEffect(() => {
    callbacksRef.current = { onScanSuccess, onScanError };
  }, [onScanSuccess, onScanError]);

  useEffect(() => {
    // Prevent double instantiation in React Strict Mode
    const element = document.getElementById("qr-reader");
    if (element && element.innerHTML !== "") {
      return;
    }

    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
          rememberLastUsedCamera: true
        },
        false // verbose
      );

      scannerRef.current.render(
        (decodedText) => {
          if (scannerRef.current) {
            // Optional: pause or stop after successful scan to prevent multiple triggers
            scannerRef.current.pause(true);
            callbacksRef.current.onScanSuccess(decodedText);
          }
        },
        (errorMessage) => {
          if (callbacksRef.current.onScanError) {
            callbacksRef.current.onScanError(errorMessage);
          }
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
        scannerRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs exactly once on mount

  return <div id="qr-reader" className="w-full max-w-md mx-auto" />;
}
