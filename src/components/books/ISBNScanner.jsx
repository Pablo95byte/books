/**
 * ISBN Scanner Component
 * Scan barcode with camera to add books automatically
 */

import { useState, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Camera, X, Loader, Keyboard, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import { searchBookByISBN } from '../../lib/googleBooks';
import toast from 'react-hot-toast';

const ISBNScanner = ({ onBookFound, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualISBN, setManualISBN] = useState('');
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const readerRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup: stop scanner on unmount
      stopScanning();
    };
  }, []);

  const startScanning = async () => {
    try {
      console.log('🎥 Starting camera scanner...');
      setError(null);
      setIsScanning(true);

      // Check if running in secure context (HTTPS)
      if (!window.isSecureContext) {
        const errorMsg = 'La fotocamera richiede HTTPS. Usa l\'input manuale.';
        console.error('❌ Not in secure context (HTTPS required)');
        setError(errorMsg);
        setIsScanning(false);
        setShowManualInput(true);
        return;
      }

      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const errorMsg = 'Browser non supporta l\'accesso alla fotocamera. Usa l\'input manuale.';
        console.error('❌ getUserMedia not available');
        setError(errorMsg);
        setIsScanning(false);
        setShowManualInput(true);
        return;
      }

      // Initialize barcode reader
      console.log('📚 Initializing barcode reader...');
      readerRef.current = new BrowserMultiFormatReader();

      console.log('📸 Requesting camera access and starting scanner...');

      // Get video devices
      const videoInputDevices = await readerRef.current.listVideoInputDevices();
      console.log(`📹 Found ${videoInputDevices.length} camera(s):`, videoInputDevices.map(d => d.label));

      if (videoInputDevices.length === 0) {
        const errorMsg = 'Nessuna fotocamera trovata - usa l\'input manuale qui sotto.';
        console.error('❌ No cameras found');
        setError(errorMsg);
        setIsScanning(false);
        setShowManualInput(true);
        return;
      }

      // Use back camera if available (mobile)
      const backCamera = videoInputDevices.find(device =>
        device.label.toLowerCase().includes('back') ||
        device.label.toLowerCase().includes('rear')
      );
      const selectedDevice = backCamera || videoInputDevices[0];
      console.log('📷 Using camera:', selectedDevice.label);

      // Start scanning
      console.log('🔍 Starting barcode detection and video stream...');

      try {
        // Get camera stream with specific constraints
        const constraints = {
          video: {
            deviceId: selectedDevice.deviceId ? { exact: selectedDevice.deviceId } : undefined,
            facingMode: backCamera ? 'environment' : 'user',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('✅ Camera stream obtained');

        // Assign stream to video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          // Wait for video to be ready and play
          await videoRef.current.play();
          console.log('✅ Video playing');
        }

        // Start barcode detection on the video element
        const controls = await readerRef.current.decodeFromVideoElement(
          videoRef.current,
          async (result, error) => {
            if (result) {
              const isbn = result.getText();
              console.log('✅ ISBN scanned:', isbn);

              // Stop scanning
              stopScanning();

              // Fetch book data
              await handleISBN(isbn);
            }

            if (error && error.name !== 'NotFoundException') {
              console.error('⚠️ Scanner error:', error);
            }
          }
        );

        console.log('✅ Scanner successfully started');
      } catch (decodeError) {
        console.error('❌ Error starting camera:', decodeError);

        let errorMsg = 'Fotocamera non disponibile. ';
        if (decodeError.name === 'NotAllowedError') {
          errorMsg += 'Permessi negati - usa l\'input manuale qui sotto.';
        } else if (decodeError.name === 'NotFoundError') {
          errorMsg += 'Nessuna fotocamera trovata - usa l\'input manuale qui sotto.';
        } else if (decodeError.name === 'NotReadableError') {
          errorMsg += 'Fotocamera in uso - usa l\'input manuale qui sotto.';
        } else {
          errorMsg += 'Errore: ' + decodeError.message;
        }

        setError(errorMsg);
        setIsScanning(false);
        setShowManualInput(true);
      }
    } catch (error) {
      console.error('❌ Error in scanner initialization:', error);
      const errorMsg = 'Errore scanner - usa l\'input manuale qui sotto.';
      setError(errorMsg);
      setIsScanning(false);
      setShowManualInput(true);
    }
  };

  const stopScanning = () => {
    try {
      if (readerRef.current) {
        // Stop all video tracks
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject;
          stream.getTracks().forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }

        // Clear the reader reference
        readerRef.current = null;
      }
    } catch (error) {
      console.error('Error stopping scanner:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleISBN = async (isbn) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('📖 Searching for ISBN:', isbn);

      const bookData = await searchBookByISBN(isbn);

      if (!bookData) {
        console.warn('⚠️ Book not found for ISBN:', isbn);
        setError(`Libro con ISBN ${isbn} non trovato. Verifica il codice o aggiungi manualmente.`);
        setIsLoading(false);
        setShowManualInput(true);
        return;
      }

      console.log('✅ Book found:', bookData.title);
      toast.success(`✓ Trovato: ${bookData.title}`);
      onBookFound(bookData);
      onClose();
    } catch (error) {
      console.error('❌ Error fetching book:', error);
      setError('Errore di connessione. Verifica la connessione internet e riprova.');
      setIsLoading(false);
      setShowManualInput(true);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    const cleanISBN = manualISBN.trim().replace(/[-\s]/g, '');

    if (!cleanISBN) {
      setError('Inserisci un codice ISBN valido');
      return;
    }

    if (cleanISBN.length !== 10 && cleanISBN.length !== 13) {
      setError('L\'ISBN deve essere di 10 o 13 cifre');
      return;
    }

    console.log('📝 Manual ISBN entry:', cleanISBN);
    setManualISBN('');
    await handleISBN(cleanISBN);
  };

  return (
    <div className="fixed inset-0 bg-black" style={{ zIndex: 9999 }}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-black/70 backdrop-blur-sm" style={{ zIndex: 10 }}>
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold text-lg">Scanner ISBN</h2>
          <button
            onClick={() => {
              stopScanning();
              onClose();
            }}
            className="text-white p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Chiudi scanner"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="absolute inset-0 flex items-center justify-center p-6" style={{ paddingTop: '80px' }}>
        {!isScanning && !isLoading && !showManualInput && (
          <div className="text-center max-w-md w-full">
            <Camera className="w-20 h-20 text-white mx-auto mb-6" />
            <h3 className="text-white text-2xl font-semibold mb-3">
              Scansiona Codice ISBN
            </h3>
            <p className="text-gray-300 mb-8 text-base">
              Inquadra il codice a barre sul retro del libro
            </p>

            <div className="space-y-4">
              <Button
                variant="primary"
                size="lg"
                onClick={startScanning}
                icon={<Camera className="w-5 h-5" />}
                className="w-full"
              >
                Avvia Scanner
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  setShowManualInput(true);
                  setError(null);
                }}
                icon={<Keyboard className="w-5 h-5" />}
                className="w-full bg-white/10 hover:bg-white/20 text-white border-white/30"
              >
                Inserisci ISBN Manualmente
              </Button>
            </div>
          </div>
        )}

        {!isScanning && !isLoading && showManualInput && (
          <div className="text-center max-w-md w-full">
            {error && (
              <div className="mb-6 p-4 bg-yellow-500/20 border-2 border-yellow-500 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="text-left flex-1">
                    <p className="text-yellow-200 font-semibold mb-1">Fotocamera non disponibile</p>
                    <p className="text-yellow-100 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <Keyboard className="w-20 h-20 text-white mx-auto mb-6" />
            <h3 className="text-white text-2xl font-semibold mb-3">
              Inserisci ISBN Manualmente
            </h3>
            <p className="text-gray-300 mb-8 text-base">
              Digita il codice ISBN del libro (10 o 13 cifre)
            </p>

            <form onSubmit={handleManualSubmit} className="space-y-5">
              <input
                type="text"
                value={manualISBN}
                onChange={(e) => setManualISBN(e.target.value)}
                placeholder="Es: 9788804668879"
                className="w-full px-4 py-4 bg-white/10 border-2 border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xl tracking-wider text-center font-mono"
                autoFocus
                inputMode="numeric"
              />

              <div className="space-y-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={!manualISBN.trim()}
                >
                  Cerca Libro
                </Button>

                {!error && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={() => {
                      setShowManualInput(false);
                      setManualISBN('');
                      setError(null);
                    }}
                    icon={<Camera className="w-5 h-5" />}
                    className="w-full bg-white/10 hover:bg-white/20 text-white border-white/30"
                  >
                    Prova con Fotocamera
                  </Button>
                )}
              </div>
            </form>
          </div>
        )}

        {isLoading && (
          <div className="text-center">
            <Loader className="w-16 h-16 text-white mx-auto mb-4 animate-spin" />
            <p className="text-white">Ricerca libro in corso...</p>
          </div>
        )}

        {isScanning && (
          <div className="absolute inset-0">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              autoPlay
              muted
            />

            {/* Scanning Guide */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ paddingTop: '80px' }}>
              <div className="border-4 border-white rounded-xl w-72 h-52 relative shadow-2xl">
                <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-primary-500 rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-primary-500 rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-primary-500 rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-primary-500 rounded-br-xl" />
              </div>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-12 left-0 right-0 text-center px-4">
              <div className="inline-block bg-black/80 backdrop-blur-sm px-8 py-4 rounded-xl shadow-lg">
                <p className="text-white font-semibold text-base">
                  Posiziona il codice a barre nel riquadro
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ISBNScanner;
