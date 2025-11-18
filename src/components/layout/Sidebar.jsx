/**
 * Sidebar Component
 * Side navigation with main menu items
 */

import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Library,
  BookMarked,
  TrendingUp,
  Settings,
  X
} from 'lucide-react';
import useStore from '../../store/useStore';
import { cn } from '../../lib/utils';

const menuItems = [
  {
    name: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'La mia libreria',
    path: '/library',
    icon: Library,
  },
  {
    name: 'Da leggere',
    path: '/next-to-read',
    icon: BookMarked,
  },
  {
    name: 'Statistiche',
    path: '/stats',
    icon: TrendingUp,
  },
];

const Sidebar = () => {
  const { sidebarOpen, toggleSidebar, getStats } = useStore();
  const stats = getStats();

  return (
    <>
      {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-40 h-screen w-70',
          'lg:translate-x-0'
        )}
        style={{
          top: '64px',
          height: 'calc(100vh - 64px)',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRight: '2px solid #d4c4a8',
          boxShadow: '2px 0 8px rgba(62, 39, 35, 0.05)'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Close Button */}
          <div className="lg:hidden flex items-center justify-between p-4" style={{
            borderBottom: '1px solid #d4c4a8'
          }}>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              color: '#3e2723',
              letterSpacing: '0.03em'
            }}>Menu</span>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded transition-colors"
              style={{
                color: '#5d4037',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(201, 169, 98, 0.1)';
                e.currentTarget.style.borderColor = '#c9a962';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease',
                  fontFamily: "'Crimson Text', serif",
                  fontSize: '1.05rem',
                  color: isActive ? '#3e2723' : '#5d4037',
                  fontWeight: isActive ? 600 : 400,
                  background: isActive ? 'rgba(201, 169, 98, 0.2)' : 'transparent',
                  border: isActive ? '2px solid #c9a962' : '2px solid transparent',
                  boxShadow: isActive ? '0 2px 4px rgba(62, 39, 35, 0.1)' : 'none'
                })}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.classList.contains('active')) {
                    e.currentTarget.style.background = 'rgba(201, 169, 98, 0.1)';
                    e.currentTarget.style.borderColor = '#d4c4a8';
                  }
                }}
                onMouseLeave={(e) => {
                  const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Stats Card */}
          <div className="p-4" style={{ borderTop: '1px solid #d4c4a8' }}>
            <div className="p-4" style={{
              background: 'linear-gradient(135deg, rgba(201, 169, 98, 0.15) 0%, rgba(218, 165, 32, 0.1) 100%)',
              border: '2px solid #c9a962',
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(62, 39, 35, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
            }}>
              <h3 className="mb-3" style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#5d4037',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}>
                Riepilogo
              </h3>
              <div className="space-y-2" style={{
                fontFamily: "'Crimson Text', serif",
                fontSize: '0.95rem'
              }}>
                <div className="flex justify-between">
                  <span style={{ color: '#6d4423' }}>Totale libri</span>
                  <span style={{
                    fontWeight: 600,
                    color: '#3e2723',
                    fontFamily: "'Playfair Display', serif"
                  }}>
                    {stats.total}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#6d4423' }}>Letti</span>
                  <span style={{
                    fontWeight: 600,
                    color: '#4e6741',
                    fontFamily: "'Playfair Display', serif"
                  }}>
                    {stats.read}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#6d4423' }}>In lettura</span>
                  <span style={{
                    fontWeight: 600,
                    color: '#daa520',
                    fontFamily: "'Playfair Display', serif"
                  }}>
                    {stats.reading}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#6d4423' }}>Da leggere</span>
                  <span style={{
                    fontWeight: 600,
                    color: '#8b5a2b',
                    fontFamily: "'Playfair Display', serif"
                  }}>
                    {stats.toRead}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
