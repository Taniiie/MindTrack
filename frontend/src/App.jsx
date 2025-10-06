import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MoodTracker from './pages/MoodTracker'
import CognitiveGames from './pages/CognitiveGames'
import HealthMetrics from './pages/HealthMetrics'
import Journal from './pages/Journal'
import Recommendations from './pages/Recommendations'
import WellnessChatbot from './pages/WellnessChatbot'
import Layout from './components/Layout'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function PublicRoute({ children }) {
  const { user } = useAuth()
  return user ? <Navigate to="/" /> : children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          
          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="mood" element={<MoodTracker />} />
            <Route path="cognitive" element={<CognitiveGames />} />
            <Route path="health" element={<HealthMetrics />} />
            <Route path="journal" element={<Journal />} />
            <Route path="recommendations" element={<Recommendations />} />
            <Route path="chatbot" element={<WellnessChatbot />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
