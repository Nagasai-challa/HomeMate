import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const EditLead = () => {
    const { id } = useParams();
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [area, setArea] = useState('');
    const [pincode, setPincode] = useState('');
    const [property, setProperty] = useState('');
    const [roomCount, setRoomCount] = useState('');
    const [rent, setRent] = useState('');
    const [contact, setContact] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function getLead() {
            try {
                const response = await axios.get(`https://homemate-au6s.onrender.com/lead/${id}`);
                if (response.status === 200) {
                    const data = response.data;
                    setState(data.state);
                    setCity(data.city);
                    setArea(data.area);
                    setContact(data.contact);
                    setPincode(data.pincode);
                    setRent(data.Price);
                    setRoomCount(data.no_of_bedrooms);
                    setProperty(data.property_type);
                    setImageUrl(data.image);
                }
            } catch (error) {
                console.error("Error fetching lead:", error);
                setMessage("Error fetching lead data.");
            }
        }
        getLead();
    }, [id]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
    };

    const uploadImageToCloudinary = async () => {
        if (!imageFile) return imageUrl; // Return current image URL if no new file selected

        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', 'homemate'); // Replace with your Cloudinary upload preset

        try {
            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/du3dhdsdh/image/upload',
                formData
            );
            return response.data.secure_url;
        } catch (error) {
            console.error('Image upload error:', error);
            setMessage("Image upload failed. Please try again.");
            return imageUrl; // Fallback to existing image URL
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let cloudinaryUrl = await uploadImageToCloudinary();
            if (!cloudinaryUrl) cloudinaryUrl = imageUrl;

            const response = await axios.put(`https://homemate-au6s.onrender.com/lead/${id}`, {
                state,
                city,
                area,
                pincode,
                property_type: property,
                no_of_bedrooms: roomCount,
                Price: rent,
                contact,
                image: cloudinaryUrl
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.status === 200) {
                setMessage("Lead Updated Successfully");
            }
        } catch (error) {
            console.error("Update Error:", error);
            setMessage("Failed to update lead. Please try again later.");
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-800'>
            <form 
                onSubmit={handleSubmit}
                className='shadow-lg rounded-lg p-8 bg-gray-700 text-white w-full max-w-md'
            >
                <h2 className='text-2xl font-bold mb-4 text-center'>Edit Lead</h2>
                <p className='text-lg mb-4 text-center'>{message}</p>

                <label className='block mb-2'>STATE</label>
                <input 
                    className='text-black p-2 mb-4 w-full rounded-md border-gray-500 border-2 outline-none'
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    type='text' 
                    required
                />

                <label className='block mb-2'>CITY</label>
                <input 
                    className='text-black p-2 mb-4 w-full rounded-md border-gray-500 border-2 outline-none'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    type='text' 
                    required
                />

                <label className='block mb-2'>AREA</label>
                <input 
                    className='text-black p-2 mb-4 w-full rounded-md border-gray-500 border-2 outline-none'
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    type='text' 
                    required
                />

                <label className='block mb-2'>PINCODE</label>
                <input 
                    className='text-black p-2 mb-4 w-full rounded-md border-gray-500 border-2 outline-none'
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    type='text' 
                    required
                />

                <label className='block mb-2'>PROPERTY TYPE</label>
                <input 
                    className='text-black p-2 mb-4 w-full rounded-md border-gray-500 border-2 outline-none'
                    value={property}
                    onChange={(e) => setProperty(e.target.value)}
                    type='text' 
                    required
                />

                <label className='block mb-2'>NO OF ROOMS</label>
                <input 
                    className='text-black p-2 mb-4 w-full rounded-md border-gray-500 border-2 outline-none'
                    value={roomCount}
                    onChange={(e) => setRoomCount(e.target.value)}
                    type='number' 
                    required
                />

                <label className='block mb-2'>RENT</label>
                <input 
                    className='text-black p-2 mb-4 w-full rounded-md border-gray-500 border-2 outline-none'
                    value={rent}
                    onChange={(e) => setRent(e.target.value)}
                    type='number' 
                    required
                />

                <label className='block mb-2'>CONTACT</label>
                <input 
                    className='text-black p-2 mb-4 w-full rounded-md border-gray-500 border-2 outline-none'
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    type='tel' 
                    required
                />
                
                <label className='block mb-2'>UPLOAD IMAGE</label>
                <input 
                    type='file' 
                    onChange={handleImageUpload}
                    accept="image/*"
                    className='text-black p-1 mb-4 w-full rounded-md border-gray-500 border-2 outline-none'
                /><br/>
                
                <button 
                  type="submit" 
                  className='rounded-md p-3 w-full bg-blue-600 hover:bg-blue-700 transition duration-200'
                  >
                  Update Lead
              </button>
          </form>
      </div>
  );
}

export default EditLead;
