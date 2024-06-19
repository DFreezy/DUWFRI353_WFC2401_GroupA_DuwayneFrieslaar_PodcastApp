import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './SeasonList.css'; // Import CSS for styling

const API_BASE_URL = 'https://podcast-api.netlify.app';

const SeasonList = ({ addToFavorites }) => {
  const { showId } = useParams(); // Get showId from URL params using useParams hook
  const [show, setShow] = useState(null); // State to store show details
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [selectedEpisode, setSelectedEpisode] = useState(null); // State to manage currently selected episode
  const [genres, setGenres] = useState([]); // State to store genres associated with the show

  useEffect(() => {
    // Effect to fetch show details and genres based on showId
    const fetchShowDetails = async () => {
      try {
        // Fetch show details from API
        const response = await axios.get(`${API_BASE_URL}/id/${showId}`);
        setShow(response.data); // Set show state with fetched data
        setLoading(false); // Set loading to false after data is fetched

        // Fetch genres for the show using genreId from show data
        const genresResponse = await axios.get(`${API_BASE_URL}/genre/${response.data.genreId}`);
        setGenres(genresResponse.data); // Set genres state with fetched genres
      } catch (error) {
        console.error('Error fetching show details:', error); // Log error if fetching fails
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchShowDetails(); // Invoke fetchShowDetails function when showId changes
  }, [showId]); // Dependency array ensures effect runs when showId changes

  // Function to handle click on an episode
  const handleEpisodeClick = (episode) => {
    setSelectedEpisode(episode); // Set selectedEpisode state to the clicked episode
  };

  // Function to handle adding an episode to favorites
  const handleFavoriteClick = (episode) => {
    // Call addToFavorites function passed as prop, with episode details
    addToFavorites({
      ...episode, // Spread existing episode details
      showId: show.id, // Add showId to episode details
      seasonId: episode.seasonId, // Add seasonId to episode details
    });
  };

  return (
    <div className="SeasonList">
      {loading ? ( // Conditional rendering based on loading state
        <p>Loading...</p> // Display loading message while data is being fetched
      ) : (
        <div>
          <h2>{show?.title}</h2> {/* Display show title if show is loaded */}
          <p>Genres: {genres.map((genre) => genre.title).join(', ')}</p> {/* Display genres associated with the show */}
          <p>Last Updated: {show?.lastUpdated ? new Date(show.lastUpdated).toLocaleDateString() : 'N/A'}</p> {/* Display last updated date if available */}
          <details>
            <summary>Seasons</summary>
            {show?.seasons.map((season, index) => ( // Map through seasons of the show
              <details key={season.id}>
                <summary>Season {index + 1}</summary> {/* Display season summary */}
                <ol>
                  {season.episodes.map((episode) => ( // Map through episodes in each season
                    <li key={episode.id}>
                      <h3>{episode.title}</h3> {/* Display episode title */}
                      <p>{episode.description}</p> {/* Display episode description */}
                      <button onClick={() => handleEpisodeClick(episode)}>
                        {selectedEpisode === episode ? 'Close' : 'Play'} {/* Toggle button text based on selected episode */}
                      </button>
                      <button onClick={() => handleFavoriteClick(episode)}>
                        Add to Favorites {/* Button to add episode to favorites */}
                      </button>
                      {selectedEpisode === episode && ( // Conditional rendering for audio player based on selected episode
                        <audio controls>
                          <source
                            src={episode.audioUrl || 'https://podcast-api.netlify.app/placeholder-audio.mp3'}
                            type="audio/mpeg"
                          />
                          Your browser does not support the audio element.
                        </audio>
                      )}
                    </li>
                  ))}
                </ol>
              </details>
            ))}
          </details>
        </div>
      )}
    </div>
  );
};

export default SeasonList;
