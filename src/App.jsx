/**
 * App Component
 * Main application component with routing
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import NextToRead from './pages/NextToRead';
import BookDetail from './pages/BookDetail';
import Stats from './pages/Stats';
import BookModals from './components/books/BookModals';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="library" element={<Library />} />
          <Route path="next-to-read" element={<NextToRead />} />
          <Route path="book/:id" element={<BookDetail />} />
          <Route path="stats" element={<Stats />} />
        </Route>
      </Routes>

      {/* Global Modals */}
      <BookModals />
    </BrowserRouter>
  );
}

export default App;
