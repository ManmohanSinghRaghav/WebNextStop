import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth.jsx'
import Home from './pages/Home.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import DriverLoginPage from './pages/DriverLoginPage.jsx'
import DriverSignupPage from './pages/DriverSignupPage.jsx'
import DriverApplicationPage from './pages/DriverApplicationPage.jsx'
import DriverDashboard from './pages/DriverDashboard.jsx'
import DriverPendingPage from './pages/DriverPendingPage.jsx'
// Temporarily commenting out onboarding modal
// import OnboardingModal from './components/OnboardingModal.jsx'
import './App.css'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ fontSize: '24px' }}>🚌</div>
        <div>Loading NextStop...</div>
      </div>
    )
  }

  return (
    <>
      <Routes>
        {user ? (
          // Authenticated routes
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/driver/application" element={<DriverApplicationPage />} />
            <Route path="/driver/dashboard" element={<DriverDashboard />} />
            <Route path="/driver/pending" element={<DriverPendingPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          // Unauthenticated routes
          <>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/driver/login" element={<DriverLoginPage />} />
            <Route path="/driver/signup" element={<DriverSignupPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
