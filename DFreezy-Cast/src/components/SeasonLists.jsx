import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './SeasonList.css'; // Import CSS for styling

const API_BASE_URL = 'https://podcast-api.netlify.app';

const SeasonList = ({ addToFavorites }) => {
  const { showId } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/id/${showId}`);
        setShow(response.data);
        setLoading(false);

        const genresResponse = await axios.get(`${API_BASE_URL}/genre/${response.data.genreId}`);
        setGenres(genresResponse.data);
      } catch (error) {
        console.error('Error fetching show details:', error);
        setLoading(false);
      }
    };

    fetchShowDetails();
  }, [showId]);

  const handleEpisodeClick = (episode) => {
    setSelectedEpisode(episode);
  };

  const handleFavoriteClick = (episode) => {
    addToFavorites({
      ...episode,
      showId: show.id,
      seasonId: episode.seasonId,
    });
  };

  return (
    <div className="SeasonList">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>{show?.title}</h2>
          <p>Genres: {genres.map((genre) => genre.title).join(', ')}</p>
          <p>Last Updated: {show?.lastUpdated ? new Date(show.lastUpdated).toLocaleDateString() : 'N/A'}</p>
          <details>
            <summary>Seasons</summary>
            {show?.seasons.map((season, index) => (
              <details key={season.id}>
                <summary>Season {index + 1}</summary>
                <ol>
                  {season.episodes.map((episode) => (
                    <li key={episode.id}>
                      <h3>{episode.title}</h3>
                      <p>{episode.description}</p>
                      <button onClick={() => handleEpisodeClick(episode)}>
                        {selectedEpisode === episode ? 'Close' : 'Play'}
                      </button>
                      <button onClick={() => handleFavoriteClick(episode)}>
                        Add to Favorites
                      </button>
                      {selectedEpisode === episode && (
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
