// ShowDetails.jsx

import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const API_BASE_URL = 'https://podcast-api.netlify.app';

// Context to manage global audio state
const AudioContext = React.createContext();

const ShowDetails = () => {
  const { showId } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(); // Reference to audio element

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/id/${showId}`);
        setShow(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching show details:', error);
        setLoading(false);
      }
    };

    fetchShowDetails();
  }, [showId]);

  // Function to toggle play/pause
  const togglePlay = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  return (
    <div className="ShowDetails">
      {loading ? (
        <p>Loading show details...</p>
      ) : (
        <div>
          <h2>{show?.title}</h2>
          <p>Genres: {show?.genres.map(genre => genre.title).join(', ')}</p>
          <p>Last Updated: {show?.lastUpdated ? new Date(show.lastUpdated).toLocaleDateString() : 'N/A'}</p>
          <AudioContext.Provider value={{ audioRef, togglePlay }}>
            <AudioPlayer />
          </AudioContext.Provider>
        </div>
      )}
    </div>
  );
};

// Separate AudioPlayer component to manage audio playback
const AudioPlayer = () => {
  const { audioRef, togglePlay } = useContext(AudioContext);

  // Sync play/pause status with global audioRef
  const handleTogglePlay = () => {
    togglePlay();
  };

  return (
    <div className="AudioPlayer">
      <button onClick={handleTogglePlay}>Play/Pause</button>
      <audio ref={audioRef} controls>
        <source src="https://podcast-api.netlify.app/placeholder-audio.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default ShowDetails;
