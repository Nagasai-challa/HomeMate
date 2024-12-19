import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoLocation, IoSearch } from "react-icons/io5";
import { PiCurrencyInrBold, PiHouseSimpleBold } from "react-icons/pi";
import { FaComments } from "react-icons/fa";
import Chat from './Chat';

const GetAllLeads = () => {
  const [leads, setLeads] = useState(null);
  const [allLeads, setAllLeads] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/lead", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setLeads(response.data);
        setAllLeads(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch leads. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const LeadCard = ({ lead }) => {
    const [isChatOpen, setChatOpen] = useState(false);

    const toggleChat = () => {
      setChatOpen(!isChatOpen);
    };

    return (
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3">
            <img 
              className="w-full h-64 md:h-full object-cover" 
              src={lead.image} 
              alt='Property'
            />
          </div>
          <div className="flex-1 p-6 md:p-8">
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <IoLocation className="w-6 h-6 text-gray-600 mt-1 flex-shrink-0" />
                <p className="text-lg font-medium text-gray-800">
                  {lead.state}, {lead.city}, {lead.area}
                </p>
              </div>
              
              <div className="flex items-start gap-2">
                <PiHouseSimpleBold className="w-6 h-6 text-gray-600 mt-1 flex-shrink-0" />
                <p className="text-lg font-medium text-gray-800">
                  {lead.no_of_bedrooms} BHK {lead.property_type}
                </p>
              </div>
              
              <div className="flex items-start gap-2">
                <PiCurrencyInrBold className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <p className="text-xl font-semibold text-green-500">
                  {lead.Price.toLocaleString('en-IN')}
                </p>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="text-gray-600">Contact:</span>
                <p className="text-lg font-medium text-gray-800">{lead.contact}</p>
              </div>

              <button 
                onClick={toggleChat}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-200"
              >
                <FaComments className="w-5 h-5" />
                <span>Chat with Owner</span>
              </button>
            </div>
          </div>
        </div>
        {isChatOpen && <Chat leadId={lead._id} onClose={toggleChat} />}
      </div>
    );
  };

  const handleSearch = () => {
    if (searchText.trim() === "") {
      setLeads(allLeads);
      return;
    }

    const normalizedSearchText = searchText.trim().toLowerCase();
    const newLeads = allLeads.filter((lead) => {
      const searchableFields = [
        lead.state?.toLowerCase(),
        lead.city?.toLowerCase(),
        lead.pincode?.toString(),
        lead.area?.toLowerCase()
      ];
      return searchableFields.some(field => field?.includes(normalizedSearchText));
    });

    setLeads(newLeads);
  };

  const handlePrice = (event) => {
    const price = event.target.value;
    if (price === "Price Range") {
      setLeads(allLeads);
      return;
    }
    const maxPrice = Number(price.slice(3));
    const newLeads = allLeads.filter(lead => lead.Price <= maxPrice);
    setLeads(newLeads);
  };

  const handlePropertyType = (event) => {
    const propertyType = event.target.value;
    if (propertyType === "Property Type") {
      setLeads(allLeads);
      return;
    }
    const bedrooms = propertyType.slice(0, 1);
    const newLeads = allLeads.filter(lead => lead.no_of_bedrooms === bedrooms);
    setLeads(newLeads);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center p-4">
          <p className="text-xl font-semibold">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <input
              className="w-full px-4 py-3 pl-12 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              spellCheck="false"
              placeholder="Search by state, city, or pincode"
              type="search"
            />
            <IoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <select
            className="px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={handlePrice}
          >
            <option>Price Range</option>
            <option>&lt;= 10000</option>
            <option>&lt;= 20000</option>
            <option>&lt;= 30000</option>
            <option>&lt;= 40000</option>
            <option>&lt;= 50000</option>
          </select>

          <select
            className="px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={handlePropertyType}
          >
            <option>Property Type</option>
            <option>1 BHK</option>
            <option>2 BHK</option>
            <option>3 BHK</option>
            <option>4 BHK</option>
          </select>
        </div>

        <div className="space-y-6">
          {leads?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
            </div>
          ) : (
            leads?.map((lead) => (
              <LeadCard key={lead._id} lead={lead} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GetAllLeads;