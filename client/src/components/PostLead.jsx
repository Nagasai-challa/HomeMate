import React, { useState } from 'react';
import axios from 'axios';

const PostLead = () => {
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const uploadImageToCloudinary = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'homemate');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/du3dhdsdh/image/upload',
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error('Image upload error:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const cloudinaryUrl = await uploadImageToCloudinary();
      
      const response = await axios.post(
        "http://localhost:5000/lead",
        { ...formData, image: cloudinaryUrl },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (response.status === 200) {
        setMessage("Lead Posted Successfully");
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
        setImageFile(null);
      }
    } catch (error) {
      setMessage("Failed to post lead");
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
          
          {message && (
            <div className={`mb-4 p-3 rounded-lg text-center ${
              message.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {key.replace(/_/g, ' ').toUpperCase()}
                </label>
                <input
                  type={key === 'Price' ? 'number' : 'text'}
                  value={value}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>
            ))}

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                PROPERTY IMAGE
              </label>
              <input
                type="file"
                onChange={handleImageUpload}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                accept="image/*"
              />
            </div>

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