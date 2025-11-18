/**
 * ISBN Scanner Component
 * Scan barcode with camera to add books automatically
 */

import { useState, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Camera, X, Loader } from 'lucide-react';
import Button from '../ui/Button';
import { searchBookByISBN } from '../../lib/googleBooks';
import toast from 'react-hot-toast';

const ISBNScanner = ({ onBookFound, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      setIsScanning(true);

      // Initialize barcode reader
      readerRef.current = new BrowserMultiFormatReader();

      // Get video devices
      const videoInputDevices = await readerRef.current.listVideoInputDevices();

      if (videoInputDevices.length === 0) {
        toast.error('Nessuna fotocamera trovata');
        setIsScanning(false);
        return;
      }

      // Use back camera if available (mobile)
      const backCamera = videoInputDevices.find(device =>
        device.label.toLowerCase().includes('back')
      );
      const deviceId = backCamera ? backCamera.deviceId : videoInputDevices[0].deviceId;

      // Start scanning
      readerRef.current.decodeFromVideoDevice(
        deviceId,
        videoRef.current,
        async (result, error) => {
          if (result) {
            const isbn = result.getText();
            console.log('ISBN scanned:', isbn);

            // Stop scanning
            stopScanning();

            // Fetch book data
            await handleISBN(isbn);
          }

          if (error && error.name !== 'NotFoundException') {
            console.error('Scanner error:', error);
          }
        }
      );

      toast.success('Scanner attivo - inquadra il codice a barre');
    } catch (error) {
      console.error('Error starting scanner:', error);
      toast.error('Errore nell\'avvio dello scanner');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (readerRef.current) {
      readerRef.current.reset();
      readerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleISBN = async (isbn) => {
    setIsLoading(true);

    try {
      toast.loading('Ricerca libro...', { id: 'searching' });

      const bookData = await searchBookByISBN(isbn);

      toast.dismiss('searching');

      if (!bookData) {
        toast.error('Libro non trovato. Aggiungi manualmente.');
        return;
      }

      toast.success(`Trovato: ${bookData.title}`);
      onBookFound(bookData);
      onClose();
    } catch (error) {
      console.error('Error fetching book:', error);
      toast.error('Errore nel recupero dati libro');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-black/50 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold">Scanner ISBN</h2>
          <button
            onClick={() => {
              stopScanning();
              onClose();
            }}
            className="text-white p-2 hover:bg-white/20 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Video Container */}
      <div className="w-full h-full flex items-center justify-center">
        {!isScanning && !isLoading && (
          <div className="text-center p-8">
            <Camera className="w-16 h-16 text-white mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">
              Scansiona codice ISBN
            </h3>
            <p className="text-gray-300 mb-6">
              Inquadra il codice a barre sul retro del libro
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={startScanning}
              icon={<Camera className="w-5 h-5" />}
            >
              Avvia Scanner
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="text-center">
            <Loader className="w-16 h-16 text-white mx-auto mb-4 animate-spin" />
            <p className="text-white">Ricerca libro in corso...</p>
          </div>
        )}

        {isScanning && (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
            />

            {/* Scanning Guide */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border-4 border-white rounded-lg w-64 h-48 relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary-500 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary-500 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary-500 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary-500 rounded-br-lg" />
              </div>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <div className="inline-block bg-black/70 px-6 py-3 rounded-lg">
                <p className="text-white font-medium">
                  Posiziona il codice a barre nel riquadro
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ISBNScanner;
