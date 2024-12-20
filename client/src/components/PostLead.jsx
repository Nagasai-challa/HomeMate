import React, { useState } from 'react';
import axios from 'axios';

const PostLead = () => {
  // State to store form data and loading status
  const [formData, setFormData] = useState({
    state: '',
    city: '',
    area: '',
    pincode: '',
    property_type: '',
    no_of_bedrooms: '',
    Price: '',
    contact: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes for form fields
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle image file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async () => {
    if (!imageFile) return null;
  
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'homemate'); // Replace with your Cloudinary upload preset
  
    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/du3dhdsdh/image/upload',  // Replace with your Cloudinary URL
        formData
      );
      console.log('Image uploaded successfully:', response.data.secure_url);
      return response.data.secure_url; // Return the image URL
    } catch (error) {
      console.error('Image upload error:', error);
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const cloudinaryUrl = await uploadImageToCloudinary(); // Upload image and get the URL

      // Send form data along with the image URL to the API
      const response = await axios.post(
        "https://homemate-au6s.onrender.com/lead", // Replace with your backend API endpoint
        { ...formData, image: cloudinaryUrl },  // Include the image URL
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}` // Authorization token from localStorage
          }
        }
      );

      if (response.status === 200) {
        setMessage("Lead Posted Successfully!");
        // Clear form fields after successful submission
        setFormData({
          state: '',
          city: '',
          area: '',
          pincode: '',
          property_type: '',
          no_of_bedrooms: '',
          Price: '',
          contact: ''
        });
        setImageFile(null); // Reset image file
      }
    } catch (error) {
      setMessage("Failed to post lead. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Post Property Lead
          </h2>
          
          {/* Display success or error messages */}
          {message && (
            <div className={`mb-4 p-3 rounded-lg text-center ${
              message.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Render form fields dynamically */}
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {key.replace(/_/g, ' ').toUpperCase()}
                </label>
                <input
                  type={key === 'Price' ? 'number' : 'text'}  // Price should be a number input
                  value={value}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>
            ))}

            {/* Image Upload Field */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                PROPERTY IMAGE
              </label>
              <input
                type="file"
                onChange={handleImageUpload}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                accept="image/*"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-lg text-white font-medium transition
                ${isLoading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                }`}
            >
              {isLoading ? 'Posting...' : 'Post Lead'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostLead;
