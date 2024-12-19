import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!email || !password) {
      setError("Both fields are required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email address is invalid.");
      return false;
    }
    setError('');
    return true;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password
      });
      if (response.status === 200) {
        const token = response.data.token;
        console.log(token);
        localStorage.setItem("token", token);
        setMessage("Login Successful");
        setEmail('');
        setPassword('');
      } else {
        setMessage("Failed To Login");
      }
    } catch (error) {
      setMessage("Not able to make Request");
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <form className='bg-blue-500 shadow-md rounded-lg w-96 p-8 space-y-4'
            onSubmit={handleSubmit}>
        {message && <p className='text-center text-green-200'>{message}</p>}
        {error && <p className='text-center text-red-200'>{error}</p>}
        
        <label className='block font-bold text-white text-xl'>Email</label>
        <input 
          className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email" 
          placeholder="Enter your email"
        />

        <label className='block font-bold text-white text-xl'>Password</label>
        <input 
          className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password" 
          placeholder="Enter your password"
        />

        <button 
          type="submit" 
          className='bg-blue-700 p-2 w-full rounded-md text-white hover:bg-blue-800 transition duration-200'
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Login;
