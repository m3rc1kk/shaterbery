import { Routes, Route, Navigate } from 'react-router-dom';
import Main from '../pages/Main/Main.jsx';
import SignIn from '../pages/AdminPanel/SignIn/SignIn.jsx';
import Dashboard from '../pages/AdminPanel/Dashboard/Dashboard.jsx';
import Applications from '../pages/AdminPanel/Applications/Applications.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/admin/sign-in" element={<SignIn />} />
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/applications"
                element={
                    <ProtectedRoute>
                        <Applications />
                    </ProtectedRoute>
                }
            />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
    );
}
