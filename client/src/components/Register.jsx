import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  // State hooks to manage form inputs and messages
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Form validation
  const validateForm = () => {
    if (!name || !email || !password) {
      setError("All fields are required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email address is invalid.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    setError('');
    return true;
  };

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return; // Exit if form validation fails

    try {
      const response = await axios.post("https://homemate-au6s.onrender.com/register", {
        name,
        email,
        password
      });
      if (response.status === 200) {
        setMessage("Registration Successful!");
        setName('');
        setEmail('');
        setPassword('');
      } else {
        setMessage("Failed to register.");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form 
        className="bg-blue-500 shadow-md rounded-lg w-96 p-8 space-y-4" 
        onSubmit={handleSubmit}
      >
        {/* Display success or error messages */}
        {message && <p className="text-center text-green-200">{message}</p>}
        {error && <p className="text-center text-red-200">{error}</p>}
        
        <label className="block font-bold text-white text-xl">Name</label>
        <input 
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text" 
          placeholder="Enter your name"
        />

        <label className="block font-bold text-white text-xl">Email</label>
        <input 
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email" 
          placeholder="Enter your email"
        />

        <label className="block font-bold text-white text-xl">Password</label>
        <input 
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password" 
          placeholder="Enter your password"
        />

        <button 
          type="submit" 
          className="bg-gray-500 p-2 w-full rounded-md text-white hover:bg-blue-800 transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Register;
