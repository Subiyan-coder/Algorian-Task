import {Routes, Route, Navigate} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import ResetPassword from './pages/ResetPassword';

function App() {
    return (
        <>

            <Navbar />
            <ToastContainer
                position="top-right"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                draggable
                theme="colored"
            />
            <Routes>
                <Route path='/' element={<Navigate to='/login' replace /> } />
                <Route path='/login' element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />
                <Route path='/register' element={<Register />} />
                <Route path='/tasks' element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route
                path="/profile"
                    element={
                        <ProtectedRoute>
                        <Profile />
                        </ProtectedRoute>
                    }
                />
            </Routes>

        </>
    )
}

export default App