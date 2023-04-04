import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const NewData = () => {
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [newData, setNewData] = useState({
    name: '',
    location: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
  }, []);

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(async (config) => {
    const currentDate = new Date();
    if (expire * 1000 < currentDate.getTime()) {
      await refreshToken();
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token');
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.name);
      setExpire(decoded.exp);
    } catch (error) {
      if (error.response) {
        navigate('/');
      }
    }
  };

  const handleInputChange = (event) => {
    setNewData({
        ...newData,
        [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosJWT.post('http://localhost:5000/people', newData);
      navigate('/Dashboard');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Add New Data</h1>
      <form onSubmit={handleSubmit}>
        <div className='field'>
          <label className='label'>Name</label>
          <div className='control'>
            <input className='input' type='text' name='name' onChange={handleInputChange} required />
          </div>
        </div>
        <div className='field'>
          <label className='label'>Location</label>
          <div className='control'>
            <input className='input' type='text' name='location' onChange={handleInputChange} required />
          </div>
        </div>
        <div className='field'>
          <div className='control'>
            <button className='button is-success'>Add Data</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default NewData;
