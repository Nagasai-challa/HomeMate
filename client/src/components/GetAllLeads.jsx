import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoLocation, IoSearch } from "react-icons/io5";
import { PiCurrencyInrBold, PiHouseSimpleBold } from "react-icons/pi";

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
        const response = await axios.get("https://homemate-au6s.onrender.com/lead", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setLeads(response.data);
        setAllLeads(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch leads. Please log in to view the leads or try again later..");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatPrice = (price) => {
    if (price >= 100000) {
      return `${(price / 100000).toFixed(2)} Lakh`;
    }
    return price.toLocaleString('en-IN');
  };

  const LeadCard = ({ lead }) => {
    return (
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden mx-auto">
        <div className="flex flex-col sm:flex-row">
          {/* Image Section */}
          <div className="relative sm:w-1/2 lg:w-2/5">
            <img
              className="w-full h-80 sm:h-96 object-cover"
              src={lead.image}
              alt=":)"
            />
            <div className="absolute top-4 right-4">
              <span className="bg-white/90 px-4 py-1 rounded-full text-base font-semibold text-gray-800 shadow-md">
                {lead.property_type}
              </span>
            </div>
          </div>
          {/* Content Section */}
          <div className="flex-1 p-8">
            <div className="space-y-6">
              {/* Location */}
              <div className="flex items-start gap-4">
                <IoLocation className="w-7 h-7 text-blue-500 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">{lead.area}</h3>
                  <p className="text-gray-600 text-lg">
                    {lead.city}, {lead.state} {lead.pincode && ` - ${lead.pincode}`}
                  </p>
                </div>
              </div>
              {/* Property Details */}
              <div className="flex items-center gap-4">
                <PiHouseSimpleBold className="w-7 h-7 text-blue-500 flex-shrink-0" />
                <span className="bg-gray-100 px-4 py-2 rounded-full text-lg font-medium text-gray-800">
                  {lead.no_of_bedrooms} BHK
                </span>
              </div>
              {/* Price */}
              <div className="flex items-center gap-4">
                <PiCurrencyInrBold className="w-7 h-7 text-green-500 flex-shrink-0" />
                <span className="text-3xl font-bold text-green-600">₹{formatPrice(lead.Price)}</span>
              </div>
              {/* Contact Details */}
              {lead.contact && (
                <div className="pt-6 border-t border-gray-300 mt-6">
                  <span className="text-gray-600 text-lg">Contact:</span>
                  <a
                    href={`tel:${lead.contact}`}
                    className="text-blue-600 hover:text-blue-700 font-medium text-xl ml-2"
                  >
                    {lead.contact}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
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
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
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

        {/* Lead Cards */}
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