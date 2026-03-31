import { Routes, Route } from 'react-router-dom'
import Main from "../pages/Main/Main.jsx";
import SignIn from "../pages/AdminPanel/SignIn/SignIn.jsx";
import Dashboard from "../pages/AdminPanel/Dashboard/Dashboard.jsx";

export default function AppRouter() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/admin/sign-in" element={<SignIn />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
            </Routes>
        </>
    );
}
