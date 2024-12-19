import React from 'react';
import { FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className='bg-gray-800 text-white p-10'>
      <div className='flex flex-col md:flex-row justify-between items-center space-y-5 md:space-y-0'>
        <div className='space-y-4'>
          <p className='text-lg font-semibold'>About Us</p>
          <p className='text-lg font-semibold'>Contact Us</p>
          <p className='text-lg font-semibold'>Privacy Policy</p>
        </div>
        <div className='flex space-x-5 text-3xl'>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className='hover:text-blue-400 transition duration-200'>
            <FaTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className='hover:text-pink-400 transition duration-200'>
            <FaInstagram />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className='hover:text-blue-600 transition duration-200'>
            <FaLinkedin />
          </a>
        </div>
      </div>
      <p className='text-center text-green-500 mt-5'>© 2024 Homemate. All rights reserved.</p>
    </div>
  );
}

export default Footer;
