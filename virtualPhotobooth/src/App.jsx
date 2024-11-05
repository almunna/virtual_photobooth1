import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Registration from './registration.jsx'; // Ensure the path is correct
import CaptureImage from './CaptureImage';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css"

import HomePage from './Homepage';
import AgreementPage from './AgreementPage';
import ImagesByDepartment from './ImagesByDepartment';
import SuccessPage from './SuccessPage';

function App() {
    const [userInfo, setUserInfo] = useState({ name: '', email: '', department: '' }); // Initialize userInfo

    const ProtectedRoute = ({ children }) => {
        const isAccepted = localStorage.getItem('agreementAccepted') === 'true';
        return isAccepted ? children : <Navigate to="/agreement" />;
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/agreement" element={<AgreementPage />} />
                <Route 
                    path="/register" 
                    element={<Registration setUserInfo={setUserInfo} />} 
                />
                <Route path="/images" element={<ImagesByDepartment />} />
                <Route 
                    path="/capture-image" 
                    element={
                        <ProtectedRoute>
                            <CaptureImage userInfo={userInfo} />
                        </ProtectedRoute>
                    } 
                />
                <Route path="/success" element={<SuccessPage />} />
                {/* Add other routes as needed */}
            </Routes>
        </Router>
    );
}

export default App;
