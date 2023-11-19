import React, { useEffect, useState } from 'react';
import '../App.css';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => 50),
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: labels.map(() => 100),
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};


const AdminDashboard = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [adminData, setAdminData] = useState(null);
  const navigate = useNavigate();

  const [chargeCustomers, setChargeCustomers] = useState(false);
  const [customAmount, setCustomAmount] = useState(0);
  const [regularAmounts, setRegularAmounts] = useState([0,0,0,0]);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(`https://stg.dhunjam.in/account/admin/${user.user.id}`);
        const { data } = response.data;

        if (response.data.status === 200) {
            setAdminData(data);

            // Fetch values for charge_customers, custom_amount, and regular_amounts
            setChargeCustomers(data.charge_customers);
            setCustomAmount(data.amount.category_6);
            setRegularAmounts([
            data.amount.category_7,
            data.amount.category_8,
            data.amount.category_9,
            data.amount.category_10,
            ]);

            // Enable the Save button initially
            setSaveButtonDisabled(false);
        } else {
          console.error('Error fetching admin data:', data.server_err_msg);
        }
      } catch (error) {
        console.error('Internal error fetching data:', error.message);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const handleSave = async () => {
    try {
      // Prepare the payload for the PUT request
      const payload = {
        amount: {
          category_6: customAmount, // Assuming category_6 is the custom amount field
          category_7: regularAmounts[0],
          category_8: regularAmounts[1],
          category_9: regularAmounts[2],
          category_10: regularAmounts[3],
        },
      };

      // Make the PUT request
      const response = await axios.put(`https://stg.dhunjam.in/account/admin/${user.user.id}`, payload);

      // Check the response status
      if (response.data.status === 200) {
        // Update state or perform other actions based on the response
        console.log('Price update successful:', response.data.data.amount);
      } else {
        console.error('Error updating price:', response.data.server_err_msg);
      }
    } catch (error) {
      console.error('Internal error during price update:', error.message);
    }
  };

  const handleCustomAmountChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setCustomAmount(value);
    setSaveButtonDisabled(value <= 99);
  };

  const handleRegularAmountChange = (index, e) => {
    const value = parseInt(e.target.value, 10);
    const newRegularAmounts = [...regularAmounts];
    newRegularAmounts[index] = value;
    setRegularAmounts(newRegularAmounts);

    // Disabling the Save button if any regular amount is less than or equal to its minimum value
    setSaveButtonDisabled(
      newRegularAmounts.some((amount, i) => amount <= [79, 59, 39, 19][i])
    );
  };

  return (
    <div className='dashboard-container'>
      {isAuthenticated && adminData ? (
        <div>
          <h1>{adminData.name}, {adminData.location} on Dhun Jam</h1>

          {/* Part 1: Charge Customers */}
          <div className='charge-container'>
            <label>
              Do you want to charge your customers for requesting songs?
              <input
                type="radio"
                value="yes"
                checked={chargeCustomers}
                onChange={() => setChargeCustomers(true)}
              />
              Yes
              <input
                type="radio"
                value="no"
                checked={!chargeCustomers}
                onChange={() => setChargeCustomers(false)}
              />
              No
            </label>
          </div>

          {/* Part 2: Custom Song Request Amount */}
          <div className='field-container'>
            <label>
              Custom Song Request Amount:
              <input
                type="number"
                value={customAmount}
                onChange={handleCustomAmountChange}
                disabled={!chargeCustomers}
              />
            </label>
          </div>

          {/* Part 3: Regular Song Request Amounts */}
          <div className='regular-amounts-container'>
            <label>
              Regular Song Request Amounts (from high to low):
              {regularAmounts.map((amount, index) => (
                <div className='regular-amounts-inputs' key={index}>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => handleRegularAmountChange(index, e)}
                    disabled={!chargeCustomers}
                  />
                </div>
              ))}
            </label>
          </div>

          {chargeCustomers && <Bar options={options} data={data} />}
          <div style={{marginTop: "80px"}}>
          <button className='save-button' onClick={handleSave} disabled={saveButtonDisabled}>
            Save
          </button>
          <button className='logout-button' onClick={() => logout()}>Logout</button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminDashboard;