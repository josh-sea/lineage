import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/layout/PrivateRoute';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import NewReport from './components/report/NewReport';
import ReportView from './components/report/ReportView';
import InspectorManager from './components/inspectors/InspectorManager';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <Navbar />
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/reports/new" element={
            <PrivateRoute>
              <Navbar />
              <NewReport />
            </PrivateRoute>
          } />
          <Route path="/reports/:id" element={
            <PrivateRoute>
              <Navbar />
              <ReportView />
            </PrivateRoute>
          } />
          <Route path="/reports/:id/edit" element={
            <PrivateRoute>
              <Navbar />
              <NewReport />
            </PrivateRoute>
          } />
          <Route path="/inspectors" element={
            <PrivateRoute>
              <Navbar />
              <InspectorManager />
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
