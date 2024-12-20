import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GetMyLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://homemate-au6s.onrender.com/my-lead", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setLeads(response.data);
      } catch (error) {
        setMessage("Error fetching leads");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const deleteLead = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        const response = await axios.delete(`https://homemate-au6s.onrender.com/lead/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (response.status === 200) {
          alert("Lead Deleted Successfully");
          setLeads((prevLeads) => prevLeads.filter((lead) => lead._id !== id));
        }
      } catch (error) {
        alert("Unable to Delete Lead");
      }
    }
  };

  const LeadCard = ({ lead }) => (
    <div className='flex flex-col md:flex-row border-2 shadow-lg rounded-xl w-full max-w-3xl p-5 mb-5 bg-white'>
      <img 
        className='w-full md:w-96 h-72 object-cover rounded-md' 
        src={lead.image} 
        alt="Property" 
      />
      <div className='space-y-3 p-5 flex flex-col font-semibold text-lg'>
        <p>📍 {lead.state}, {lead.city}, {lead.area}</p>
        <p>📮 {lead.pincode}</p>
        <p>🏠 {lead.no_of_bedrooms} BHK {lead.property_type}</p>
        <p>📞 {lead.contact}</p>
        <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2'>
          <button 
            className='bg-blue-500 text-white p-2 rounded-md transition duration-200 hover:bg-blue-600'
            onClick={() => window.location.assign(`/edit-lead/${lead._id}`)}
          >
            Edit
          </button>
          <button 
            className='bg-red-500 text-white p-2 rounded-md transition duration-200 hover:bg-red-600'
            onClick={() => deleteLead(lead._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p className='text-xl'>Loading leads...</p>
      </div>
    );
  }

  return (
    <div className='space-y-5 mt-10 flex flex-col items-center justify-center px-4'>
      {message && <p className='text-red-500'>{message}</p>}
      {leads.length > 0 ? (
        leads.map((lead) => (
          <LeadCard key={lead._id} lead={lead} />
        ))
      ) : (
        <p className='text-center'>No leads found.</p>
      )}
    </div>
  );
};

export default GetMyLeads;
