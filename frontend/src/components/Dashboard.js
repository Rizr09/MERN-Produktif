import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        refreshToken();
        getUsers();
    },[]);

    const refreshToken = async() => {
        try {
            const response = await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
        } catch (error) {
            if(error.response) {
                navigate('/');
            }
        }
    }

    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(async(config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get('http://localhost:5000/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
        }
        return config;
    }, (error)=>{
        return Promise.reject(error);
    })

    const getUsers = async() => {
        const response = await axiosJWT.get('http://localhost:5000/people', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setUsers(response.data);
    }

    const deleteUser = async(id) => {
        try {
          await axiosJWT.delete(`http://localhost:5000/people/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          // Remove the deleted user from the local users state
          const updatedUsers = users.filter((user) => user.id !== id);
          setUsers(updatedUsers);
      
          // Fetch the updated list of users
          await getUsers();
        } catch (error) {
          console.log(error);
        }
      };
    
    const newData = async() => {
        try {
            await refreshToken();
            navigate('/NewData');
        } catch (error) {
            console.log(error);
        }
    };

    const editData = async(id) => {
        try {
            await refreshToken();
            navigate(`/EditData/${id}`);
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className="container mt-5">
        <h1>Welcome Back {name}</h1>
        <button onClick={getUsers} className='button is-info my-3'>Get People</button>
        {/* send the add new data button to the most right */}
        <button onClick={newData} className='button is-success is-pulled-right my-3'>Add New Data</button>
        <table className='table is-striped is-fullwidth'>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Edit Data</th>
                    <th>Delete Data</th>
                </tr>
            </thead>
            <tbody>
                { users.map((user, index) => (
                    <tr key={ user.id }>
                        <td>{ index + 1 }</td>
                        <td>{ user.name }</td>
                        <td>{ user.location }</td>
                        <td><button className='button is-info' onClick={() => editData(user.id)}>Edit</button></td>
                        <td><button className='button is-danger' onClick={() => deleteUser(user.id)}>Delete</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default Dashboard