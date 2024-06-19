import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const API_BASE_URL = 'https://podcast-api.netlify.app';

// Context to manage global audio state
const AudioContext = React.createContext();

const ShowDetails = () => {
  const { showId } = useParams(); // Get showId from URL params using useParams hook
  const [show, setShow] = useState(null); // State to hold show details
  const [loading, setLoading] = useState(true); // State to manage loading status
  const audioRef = useRef(); // Reference to audio element for playback

  useEffect(() => {
    // Effect to fetch show details based on showId
    const fetchShowDetails = async () => {
      try {
        // Fetch show details from API
        const response = await axios.get(`${API_BASE_URL}/id/${showId}`);
        setShow(response.data); // Set show state with fetched data
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching show details:', error); // Log error if fetching fails
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchShowDetails(); // Invoke fetchShowDetails function when showId changes
  }, [showId]); // Dependency array ensures effect runs when showId changes

  // Function to toggle play/pause of audio
  const togglePlay = () => {
    if (audioRef.current.paused) {
      audioRef.current.play(); // If paused, play audio
    } else {
      audioRef.current.pause(); // If playing, pause audio
    }
  };

  return (
    <div className="ShowDetails">
      {loading ? ( // Conditional rendering based on loading state
        <p>Loading show details...</p> // Display loading message while fetching data
      ) : (
        <div>
          <h2>{show?.title}</h2> {/* Display show title if show is loaded */}
          <p>Genres: {show?.genres.map(genre => genre.title).join(', ')}</p> {/* Display genres associated with the show */}
          <p>Last Updated: {show?.lastUpdated ? new Date(show.lastUpdated).toLocaleDateString() : 'N/A'}</p> {/* Display last updated date if available */}
          <AudioContext.Provider value={{ audioRef, togglePlay }}> {/* Provide context with audioRef and togglePlay function */}
            <AudioPlayer /> {/* Render AudioPlayer component within AudioContext.Provider */}
          </AudioContext.Provider>
        </div>
      )}
    </div>
  );
};

// Separate AudioPlayer component to manage audio playback
const AudioPlayer = () => {
  const { audioRef, togglePlay } = useContext(AudioContext); // Access audioRef and togglePlay function from context

  // Function to handle click on play/pause button
  const handleTogglePlay = () => {
    togglePlay(); // Call togglePlay function from context to toggle play/pause
  };

  return (
    <div className="AudioPlayer">
      <button onClick={handleTogglePlay}>Play/Pause</button> {/* Button to toggle play/pause */}
      <audio ref={audioRef} controls> {/* Audio element with ref set to audioRef for control */}
        <source src="https://podcast-api.netlify.app/placeholder-audio.mp3" type="audio/mpeg" /> {/* Placeholder audio source */}
        Your browser does not support the audio element. {/* Message for unsupported browsers */}
      </audio>
    </div>
  );
};

export default ShowDetails;
