import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth.jsx'
import LanguageSwitcher from './LanguageSwitcher.jsx'

export default function Layout({ children }) {
  const { signOut } = useAuth()
  const { t } = useTranslation()
  const [showMenu, setShowMenu] = useState(false)

  const handleLogout = async () => {
    await signOut()
    setShowMenu(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Top Bar */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e0e0e0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'relative'
      }}>
        <div style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#333'
        }}>
          🚌 NextStop
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LanguageSwitcher />
          
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              style={{
                padding: '8px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: '#f0f0f0',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              👤
            </button>
            
            {showMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: '0',
                marginTop: '8px',
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                minWidth: '150px',
                zIndex: 1000
              }}>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  🚪 {t('common.signOut')}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, overflow: 'hidden' }}>
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '12px',
        backgroundColor: '#fff',
        borderTop: '1px solid #e0e0e0',
        boxShadow: '0 -2px 4px rgba(0,0,0,0.1)'
      }}>
        <NavItem icon="🗺️" label="Map" active />
        <NavItem icon="🚌" label="Routes" />
        <NavItem icon="⭐" label="Favorites" />
        <NavItem icon="👤" label="Profile" />
      </nav>
    </div>
  )
}

function NavItem({ icon, label, active = false }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      padding: '8px',
      borderRadius: '8px',
      backgroundColor: active ? '#f0f8ff' : 'transparent',
      color: active ? '#007bff' : '#666',
      fontSize: '12px',
      fontWeight: active ? '600' : '400',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }}>
      <span style={{ fontSize: '20px' }}>{icon}</span>
      <span>{label}</span>
    </div>
  )
}
