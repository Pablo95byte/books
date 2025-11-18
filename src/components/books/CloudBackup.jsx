/**
 * Cloud Backup Component
 * UI for cloud backup and restore operations
 */

import { useState } from 'react';
import {
  Cloud,
  Download,
  Upload,
  Github,
  Database,
  Clock,
  Check,
  AlertCircle
} from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import toast from 'react-hot-toast';
import {
  backupToFirebase,
  restoreFromFirebase,
  backupToGist,
  restoreFromGist,
  downloadBackup,
  restoreEmergencyBackup,
  saveToBrowserSync,
  restoreFromBrowserSync,
} from '../../lib/cloudBackup';

const CloudBackup = ({ books, onRestore, onClose }) => {
  const [gistToken, setGistToken] = useState(
    localStorage.getItem('githubToken') || ''
  );
  const [gistId, setGistId] = useState(
    localStorage.getItem('lastGistId') || ''
  );
  const [isLoading, setIsLoading] = useState(false);

  // Firebase Backup
  const handleFirebaseBackup = async () => {
    setIsLoading(true);
    try {
      await backupToFirebase(books);
      toast.success('✅ Backup su Firebase completato!');
    } catch (error) {
      toast.error('❌ Errore backup Firebase: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFirebaseRestore = async () => {
    setIsLoading(true);
    try {
      const restoredBooks = await restoreFromFirebase();
      if (!restoredBooks) {
        toast.error('Nessun backup trovato su Firebase');
        return;
      }
      onRestore(restoredBooks);
      toast.success(`✅ Ripristinati ${restoredBooks.length} libri da Firebase!`);
      onClose();
    } catch (error) {
      toast.error('❌ Errore ripristino Firebase: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // GitHub Gist Backup
  const handleGistBackup = async () => {
    if (!gistToken) {
      toast.error('Inserisci il GitHub Personal Access Token');
      return;
    }

    setIsLoading(true);
    try {
      const newGistId = await backupToGist(books, gistToken);

      // Save for future use
      localStorage.setItem('githubToken', gistToken);
      localStorage.setItem('lastGistId', newGistId);
      setGistId(newGistId);

      toast.success('✅ Backup su GitHub Gist completato!');
    } catch (error) {
      toast.error('❌ Errore backup Gist: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGistRestore = async () => {
    if (!gistId) {
      toast.error('Inserisci il Gist ID');
      return;
    }

    setIsLoading(true);
    try {
      const restoredBooks = await restoreFromGist(gistId, gistToken);
      onRestore(restoredBooks);
      toast.success(`✅ Ripristinati ${restoredBooks.length} libri da Gist!`);
      onClose();
    } catch (error) {
      toast.error('❌ Errore ripristino Gist: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Download Backup
  const handleDownload = () => {
    try {
      downloadBackup(books);
      toast.success('✅ Backup scaricato!');
    } catch (error) {
      toast.error('❌ Errore download: ' + error.message);
    }
  };

  // Emergency Restore
  const handleEmergencyRestore = () => {
    const restoredBooks = restoreEmergencyBackup();
    if (!restoredBooks) {
      toast.error('Nessun backup di emergenza trovato');
      return;
    }

    onRestore(restoredBooks);
    toast.success(`✅ Ripristinati ${restoredBooks.length} libri dal backup di emergenza!`);
    onClose();
  };

  // Browser Sync
  const handleBrowserSync = async () => {
    setIsLoading(true);
    try {
      await saveToBrowserSync(books);
      toast.success('✅ Salvato su Browser Sync!');
    } catch (error) {
      toast.error('❌ Browser Sync non disponibile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBrowserSyncRestore = async () => {
    setIsLoading(true);
    try {
      const restoredBooks = await restoreFromBrowserSync();
      if (!restoredBooks) {
        toast.error('Nessun backup trovato su Browser Sync');
        return;
      }
      onRestore(restoredBooks);
      toast.success(`✅ Ripristinati ${restoredBooks.length} libri!`);
      onClose();
    } catch (error) {
      toast.error('❌ Browser Sync non disponibile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-medium mb-1">Backup automatico attivo</p>
            <p>
              I tuoi dati vengono salvati automaticamente ogni 24 ore nel browser
              (backup di emergenza).
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <Card.Header>
          <Card.Title>Azioni rapide</Card.Title>
        </Card.Header>
        <Card.Content className="space-y-3">
          <Button
            variant="primary"
            className="w-full"
            onClick={handleDownload}
            icon={<Download className="w-4 h-4" />}
          >
            Scarica Backup (JSON)
          </Button>

          <Button
            variant="secondary"
            className="w-full"
            onClick={handleEmergencyRestore}
            icon={<Database className="w-4 h-4" />}
          >
            Ripristina Backup di Emergenza
          </Button>
        </Card.Content>
      </Card>

      {/* GitHub Gist Backup */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <Github className="w-5 h-5" />
            <Card.Title>GitHub Gist (Consigliato)</Card.Title>
          </div>
        </Card.Header>
        <Card.Content className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Salva i tuoi dati su GitHub Gist (privato e gratuito).
          </p>

          <Input
            label="GitHub Personal Access Token"
            type="password"
            value={gistToken}
            onChange={(e) => setGistToken(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxx"
            helperText={
              <a
                href="https://github.com/settings/tokens/new?scopes=gist&description=Library%20Tracker%20Backup"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                Crea un nuovo token →
              </a>
            }
          />

          <div className="flex gap-2">
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleGistBackup}
              loading={isLoading}
              disabled={!gistToken}
              icon={<Upload className="w-4 h-4" />}
            >
              Backup su Gist
            </Button>
          </div>

          {gistId && (
            <div className="mt-4 space-y-2">
              <Input
                label="Gist ID (per ripristino)"
                value={gistId}
                onChange={(e) => setGistId(e.target.value)}
                placeholder="abc123def456"
              />

              <Button
                variant="secondary"
                className="w-full"
                onClick={handleGistRestore}
                loading={isLoading}
                disabled={!gistId}
                icon={<Download className="w-4 h-4" />}
              >
                Ripristina da Gist
              </Button>
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Firebase Backup */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            <Card.Title>Firebase Cloud</Card.Title>
          </div>
        </Card.Header>
        <Card.Content className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Richiede configurazione Firebase nelle variabili d'ambiente.
          </p>

          <div className="flex gap-2">
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleFirebaseBackup}
              loading={isLoading}
              icon={<Upload className="w-4 h-4" />}
            >
              Backup
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={handleFirebaseRestore}
              loading={isLoading}
              icon={<Download className="w-4 h-4" />}
            >
              Ripristina
            </Button>
          </div>
        </Card.Content>
      </Card>

      {/* Browser Sync */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <Card.Title>Browser Sync (Chrome/Firefox)</Card.Title>
          </div>
        </Card.Header>
        <Card.Content className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sincronizza tramite il tuo account browser (massimo 100KB).
          </p>

          <div className="flex gap-2">
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleBrowserSync}
              loading={isLoading}
              icon={<Upload className="w-4 h-4" />}
            >
              Salva
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={handleBrowserSyncRestore}
              loading={isLoading}
              icon={<Download className="w-4 h-4" />}
            >
              Ripristina
            </Button>
          </div>
        </Card.Content>
      </Card>

      {/* Last Backup Info */}
      {localStorage.getItem('lastAutoBackup') && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <Check className="w-4 h-4 inline mr-1" />
          Ultimo backup automatico:{' '}
          {new Date(parseInt(localStorage.getItem('lastAutoBackup'))).toLocaleString('it-IT')}
        </div>
      )}
    </div>
  );
};

export default CloudBackup;
