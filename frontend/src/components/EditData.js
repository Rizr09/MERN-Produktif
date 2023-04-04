import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useParams, useNavigate } from 'react-router-dom';

const EditData = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    getUser();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token');
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setExpire(decoded.exp);
    } catch (error) {
      if (error.response) {
        navigate('/');
      }
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(async (config) => {
    const currentDate = new Date();
    if (expire * 1000 < currentDate.getTime()) {
      const response = await axios.get('http://localhost:5000/token');
      config.headers.Authorization = `Bearer ${response.data.accessToken}`;
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setExpire(decoded.exp);
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  const getUser = async () => {
    const response = await axiosJWT.get(`http://localhost:5000/people/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setName(response.data.name);
    setLocation(response.data.location);
  }

  const handleNameChange = (event) => {
    setName(event.target.value);
  }

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosJWT.put(`http://localhost:5000/people/${id}`, {
        name: name,
        location: location
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container mt-5">
      <h1>Edit Data</h1>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Name</label>
          <div className="control">
            <input className="input" type="text" value={name} onChange={handleNameChange} />
          </div>
        </div>
        <div className="field">
          <label className="label">Location</label>
          <div className="control">
            <input className="input" type="text" value={location} onChange={handleLocationChange} />
          </div>
        </div>
        <button type="submit" className="button is-info">Save</button>
      </form>
    </div>
  );
}

export default EditData;
