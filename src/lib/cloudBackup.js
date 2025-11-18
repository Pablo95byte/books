/**
 * Cloud Backup Service
 * Multiple backup strategies: Firebase (optional), GitHub Gist, Auto-download
 */

import toast from 'react-hot-toast';

// Firebase modules - loaded dynamically only if needed
let firebaseApp = null;
let firebaseFirestore = null;
let firebaseAuth = null;

// Firebase configuration (user will need to add their own)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

let app = null;
let db = null;
let auth = null;

/**
 * Load Firebase modules dynamically
 */
async function loadFirebase() {
  if (firebaseApp) return true; // Already loaded

  try {
    // Dynamic imports - only loads if Firebase is actually used
    firebaseApp = await import('firebase/app');
    firebaseFirestore = await import('firebase/firestore');
    firebaseAuth = await import('firebase/auth');
    return true;
  } catch (error) {
    console.error('Failed to load Firebase:', error);
    return false;
  }
}

/**
 * Initialize Firebase
 */
async function initFirebase() {
  if (!firebaseConfig.apiKey) {
    console.warn('Firebase not configured');
    return false;
  }

  // Load Firebase modules first
  const loaded = await loadFirebase();
  if (!loaded) return false;

  try {
    app = firebaseApp.initializeApp(firebaseConfig);
    db = firebaseFirestore.getFirestore(app);
    auth = firebaseAuth.getAuth(app);
    return true;
  } catch (error) {
    console.error('Firebase init error:', error);
    return false;
  }
}

/**
 * Backup to Firebase
 * @param {Array} books
 * @param {string} userId
 */
export async function backupToFirebase(books, userId = 'anonymous') {
  if (!db && !(await initFirebase())) {
    throw new Error('Firebase not configured. Add credentials to .env file.');
  }

  try {
    // Anonymous login if needed
    if (!auth.currentUser) {
      await firebaseAuth.signInAnonymously(auth);
    }

    const backupDoc = firebaseFirestore.doc(db, 'backups', userId);
    await firebaseFirestore.setDoc(backupDoc, {
      books,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });

    return true;
  } catch (error) {
    console.error('Firebase backup error:', error);
    throw error;
  }
}

/**
 * Restore from Firebase
 * @param {string} userId
 */
export async function restoreFromFirebase(userId = 'anonymous') {
  if (!db && !(await initFirebase())) {
    throw new Error('Firebase not configured. Add credentials to .env file.');
  }

  try {
    const backupDoc = firebaseFirestore.doc(db, 'backups', userId);
    const snapshot = await firebaseFirestore.getDoc(backupDoc);

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data().books;
  } catch (error) {
    console.error('Firebase restore error:', error);
    throw error;
  }
}

/**
 * Backup to GitHub Gist
 * @param {Array} books
 * @param {string} gistToken - GitHub Personal Access Token
 */
export async function backupToGist(books, gistToken) {
  if (!gistToken) {
    throw new Error('GitHub token required');
  }

  try {
    const response = await fetch('https://api.github.com/gists', {
      method: 'POST',
      headers: {
        'Authorization': `token ${gistToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: `Library Tracker Backup - ${new Date().toISOString()}`,
        public: false,
        files: {
          'library-backup.json': {
            content: JSON.stringify(books, null, 2),
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error('GitHub API error');
    }

    const data = await response.json();
    return data.id; // Return gist ID
  } catch (error) {
    console.error('Gist backup error:', error);
    throw error;
  }
}

/**
 * Restore from GitHub Gist
 * @param {string} gistId
 * @param {string} gistToken
 */
export async function restoreFromGist(gistId, gistToken) {
  if (!gistId) {
    throw new Error('Gist ID required');
  }

  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (gistToken) {
      headers['Authorization'] = `token ${gistToken}`;
    }

    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error('GitHub API error');
    }

    const data = await response.json();
    const content = data.files['library-backup.json']?.content;

    if (!content) {
      throw new Error('Backup file not found in gist');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('Gist restore error:', error);
    throw error;
  }
}

/**
 * Auto-download backup to disk
 * @param {Array} books
 */
export function downloadBackup(books) {
  try {
    const backup = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      books,
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `library-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Download backup error:', error);
    throw error;
  }
}

/**
 * Setup auto-backup (runs every 24 hours)
 * @param {Function} getBooksCallback
 */
export function setupAutoBackup(getBooksCallback) {
  // Auto-backup every 24 hours
  const BACKUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

  const lastBackup = localStorage.getItem('lastAutoBackup');
  const now = Date.now();

  if (!lastBackup || (now - parseInt(lastBackup)) > BACKUP_INTERVAL) {
    performAutoBackup(getBooksCallback);
  }

  // Setup interval
  setInterval(() => {
    performAutoBackup(getBooksCallback);
  }, BACKUP_INTERVAL);
}

/**
 * Perform auto-backup
 */
async function performAutoBackup(getBooksCallback) {
  try {
    const books = await getBooksCallback();

    if (books.length === 0) {
      return; // Skip if no books
    }

    // Save to localStorage as emergency backup
    localStorage.setItem('emergencyBackup', JSON.stringify({
      books,
      timestamp: new Date().toISOString(),
    }));

    localStorage.setItem('lastAutoBackup', Date.now().toString());

    console.log('✅ Auto-backup completed:', new Date().toISOString());
  } catch (error) {
    console.error('Auto-backup failed:', error);
  }
}

/**
 * Restore from localStorage emergency backup
 */
export function restoreEmergencyBackup() {
  try {
    const backup = localStorage.getItem('emergencyBackup');

    if (!backup) {
      return null;
    }

    const data = JSON.parse(backup);
    return data.books;
  } catch (error) {
    console.error('Emergency restore error:', error);
    return null;
  }
}

/**
 * Save to browser Sync Storage (Chrome/Firefox)
 * @param {Array} books
 */
export async function saveToBrowserSync(books) {
  if (!chrome?.storage?.sync) {
    throw new Error('Browser sync not available');
  }

  try {
    await chrome.storage.sync.set({
      libraryBackup: {
        books,
        timestamp: new Date().toISOString(),
      },
    });

    return true;
  } catch (error) {
    console.error('Browser sync error:', error);
    throw error;
  }
}

/**
 * Restore from browser Sync Storage
 */
export async function restoreFromBrowserSync() {
  if (!chrome?.storage?.sync) {
    throw new Error('Browser sync not available');
  }

  try {
    const result = await chrome.storage.sync.get('libraryBackup');
    return result.libraryBackup?.books || null;
  } catch (error) {
    console.error('Browser sync restore error:', error);
    throw error;
  }
}

export default {
  // Firebase
  backupToFirebase,
  restoreFromFirebase,

  // GitHub Gist
  backupToGist,
  restoreFromGist,

  // Local
  downloadBackup,
  setupAutoBackup,
  restoreEmergencyBackup,

  // Browser Sync
  saveToBrowserSync,
  restoreFromBrowserSync,
};
