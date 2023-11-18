import React, {useEffect} from 'react'
import '../App.css';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const {isAuthenticated, logout} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!isAuthenticated) {
        console.log('User is not authenticated. Redirecting to login...');
        navigate('/login')
      }
    }, [isAuthenticated]);

  return (
    <div>
        <h1>Welcome to the Admin Dashboard!</h1>
        <button onClick={() => logout()}>Logout</button>
    </div>
  )
}

export default AdminDashboard