import React from 'react';
import { useNavigate } from 'react-router-dom';
import img1 from '../home1.jpeg';
import img2 from '../home2.jpeg';

const Home = () => {
  const navigate = useNavigate();

  const FeatureCard = ({ 
    image, 
    title, 
    description, 
    buttonText, 
    buttonColor, 
    onClick, 
    imageRight = false 
  }) => {
    const ContentSection = () => (
      <div className="flex flex-col justify-center space-y-6 p-8 lg:p-10">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
          {title}
        </h2>
        <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
          {description}
        </p>
        <button
          onClick={onClick}
          className={`${buttonColor} transform hover:scale-105 transition-transform duration-200 text-gray-700 font-semibold rounded-xl py-3 px-6 w-full md:w-1/2 shadow-md hover:shadow-lg`}
        >
          {buttonText} →
        </button>
      </div>
    );

    return (
      <div className="flex flex-col md:flex-row rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white overflow-hidden">
        {!imageRight && (
          <div className="w-full md:w-2/5">
            <img 
              src={image} 
              alt={title}
              className="w-full h-64 object-cover transition-transform duration-300 transform hover:scale-105"
            />
          </div>
        )}
        <div className="w-full md:w-3/5">
          <ContentSection />
        </div>
        {imageRight && (
          <div className="w-full md:w-2/5">
            <img 
              src={image} 
              alt={title}
              className="w-full h-64 object-cover transition-transform duration-300 transform hover:scale-105"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-bold mb-10 text-gray-800">Welcome to HomeMate</h1>
        <div className="space-y-16">
          <FeatureCard
            image={img1}
            title="Find Your Dream Home with Just One Click!"
            description="Easily access verified leads for all your housing needs. From budget-friendly rentals to premium properties, connect with the right people and take the next step toward your perfect home."
            buttonText="Find Leads"
            buttonColor="bg-blue-500 hover:bg-blue-600"
            onClick={() => navigate("/get-all-leads")}
          />

          <FeatureCard
            image={img2}
            title="Post Your Leads"
            description="Easily share your property listings with verified leads. Connect with potential buyers or renters effortlessly and reach the right audience to find the perfect home for others. Post your leads now and get seen by those who matter."
            buttonText="Post Lead"
            buttonColor="bg-teal-500 hover:bg-teal-600"
            onClick={() => navigate("/post-lead")}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
