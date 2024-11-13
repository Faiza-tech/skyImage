import React, { useEffect, useState } from 'react';
import './Astronmy.css';

const NASA_API_BASE_URL = 'https://api.nasa.gov/';
const API_KEY = import.meta.env.VITE_NASA_API_KEY; // Your API key here

const Astronmy = () => {
  const [apodData, setApodData] = useState(null);
  const [epicData, setEpicData] = useState(null);
  const [marsData, setMarsData] = useState(null);
  const [error, setError] = useState(null);
  const [apodDate, setApodDate] = useState('');
  const [epicDate, setEpicDate] = useState('');
  const [marsDate, setMarsDate] = useState(''); // Date for Mars Rover photos
  const [selectedType, setSelectedType] = useState('apod');

  useEffect(() => {
    fetchImage();
  }, []);

  const fetchImage = async () => {
    try {
      let url;
      if (selectedType === 'apod') {
        url = apodDate
          ? `${NASA_API_BASE_URL}planetary/apod?api_key=${API_KEY}&date=${apodDate}`
          : `${NASA_API_BASE_URL}planetary/apod?api_key=${API_KEY}`;
      } else if (selectedType === 'mars') {
        url = marsDate
          ? `${NASA_API_BASE_URL}mars-photos/api/v1/rovers/curiosity/photos?earth_date=${marsDate}&api_key=${API_KEY}`
          : `${NASA_API_BASE_URL}mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${API_KEY}`;
      } else if (selectedType === 'epic') {
        url = epicDate
          ? `${NASA_API_BASE_URL}EPIC/api/natural/date/${epicDate}?api_key=${API_KEY}`
          : `${NASA_API_BASE_URL}EPIC/api/natural/images?api_key=${API_KEY}`;
      }

      console.log('Fetching URL:', url);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (selectedType === 'epic') {
        setEpicData(data);
      } else if (selectedType === 'mars') {
        setMarsData(data);
      } else {
        setApodData(data);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching image:', err);
    }
  };

  const handleFetchPicture = (e) => {
    e.preventDefault();
    fetchImage();
  };

  return (
    <div className="apod-container">
      <h1 className="apod-title">
        {selectedType === 'apod' ? apodData?.title : selectedType === 'epic' ? 'EPIC Earth Images' : 'Mars Rover Photos'}
      </h1>

      {/* Display Date */}
      {selectedType === 'apod' && apodData && (
        <p className="date-info">Date: {apodData.date}</p>
      )}
      {selectedType === 'mars' && marsData?.photos?.[0] && (
        <p className="date-info">Date: {marsData.photos[0].earth_date}</p>
      )}
      {selectedType === 'epic' && epicData?.[0] && (
        <p className="date-info">Date: {epicData[0].date.split(' ')[0]}</p>
      )}

      {/* Display Images */}
      {selectedType === 'apod' && apodData && (
        <div className="image-container">
          <img src={apodData.url} alt={apodData.title} className="apod-image" />
        </div>
      )}

      {selectedType === 'mars' && marsData?.photos && (
        <div className="mars-image-container">
          {marsData.photos.map(photo => (
            <img key={photo.id} src={photo.img_src} alt="Mars Rover" className="apod-image" />
          ))}
        </div>
      )}

      {selectedType === 'epic' && epicData && (
        <div className="epic-images-container">
          {epicData.map(image => (
            <div key={image.image} className="epic-image-container">
              <img 
                src={`https://api.nasa.gov/EPIC/archive/natural/${image.date.split(" ")[0].replace(/-/g, '/')}/png/${image.image}.png?api_key=${API_KEY}`} 
                alt={`EPIC image of ${image.date}`} 
                className="apod-image" 
              />
            </div>
          ))}
        </div>
      )}

      {/* Descriptions and Links */}
      {selectedType === 'apod' && apodData && (
        <div className="description-container">
          <p className="apod-description">{apodData.explanation}</p>
          <a href={apodData.hdurl} target="_blank" rel="noopener noreferrer" className="hd-link">
            View HD Image
          </a>
        </div>
      )}

      {selectedType === 'mars' && marsData?.photos && (
        <div className="description-container">
          <p className="apod-description">Images from Mars Rover Curiosity.</p>
        </div>
      )}

      {selectedType === 'epic' && epicData && (
        <div className="description-container">
          <p className="apod-description">Images captured by EPIC.</p>
        </div>
      )}

      {/* Selection Form */}
      <div className="selection-container">
        <form onSubmit={handleFetchPicture}>
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="apod">Astronomy Picture of the Day</option>
            <option value="mars">Mars Rover Photos</option>
            <option value="epic">EPIC Earth Images</option>
          </select>

          {selectedType === 'apod' && (
            <input
              type="date"
              value={apodDate}
              onChange={(e) => setApodDate(e.target.value)}
            />
          )}

          {selectedType === 'mars' && (
            <input
              type="date"
              value={marsDate}
              onChange={(e) => setMarsDate(e.target.value)}
            />
          )}

          {selectedType === 'epic' && (
            <input
              type="date"
              value={epicDate}
              onChange={(e) => setEpicDate(e.target.value)}
            />
          )}

          <button type="submit">Get Picture</button>
        </form>
      </div>

      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default Astronmy;
