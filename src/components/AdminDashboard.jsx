import React, {useEffect, useState} from 'react'
import '../App.css';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
    const {isAuthenticated, user, logout} = useAuth();
    const [adminData, setAdminData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {

        if(!isAuthenticated){
            navigate('/login');
        }

        const fetchData = async () => {
          try {
            // console.log(user);
            const response = await axios.get(`https://stg.dhunjam.in/account/admin/${user.user.id}`);
            console.log(response);
            const {data} = response.data;

            if (response.data.status=== 200) {
                console.log(data)
                setAdminData(data);

            } else {
              console.error('Error fetching admin data:', data.server_err_msg);
            }
          } catch (error) {

            console.error('Internal error fetching data:', error.message);
          }
        };
        
        fetchData();

      }, [isAuthenticated]);

  return (
    <div>
        <h1>Welcome to the Admin Dashboard!</h1>
        <button onClick={() => logout()}>Logout</button>
        <h2>{JSON.stringify(adminData)}</h2>
    </div>
  )
}

export default AdminDashboard