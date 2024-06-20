import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ShowDetail.css';
import { AudioContext } from './AudioContexts'; // Assuming you have AudioContext defined

const API_BASE_URL = 'https://podcast-api.netlify.app';

const ShowDetails = ({ addToFavorites }) => {
  const { showId } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const { audioRef, togglePlay } = useContext(AudioContext);
  const [seasonImages, setSeasonImages] = useState({});

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

  useEffect(() => {
    if (show) {
      const fetchSeasonImages = async () => {
        try {
          const seasonImagesPromises = show.seasons.map(async (season) => {
            const seasonImageResponse = await axios.get(`${API_BASE_URL}/seasonImage/${season.id}`);
            console.log('Season ID:', season.id, 'Image URL:', seasonImageResponse.data.imageUrl); // Log image URLs
            return { seasonId: season.id, imageUrl: seasonImageResponse.data.imageUrl };
          });
          const seasonImages = await Promise.all(seasonImagesPromises);
          const imagesMap = seasonImages.reduce((acc, curr) => {
            acc[curr.seasonId] = curr.imageUrl;
            return acc;
          }, {});
          console.log('Season Images:', imagesMap); // Log season images
          setSeasonImages(imagesMap);
        } catch (error) {
          console.error('Error fetching season images:', error);
        }
      };

      fetchSeasonImages();
    }
  }, [show]);

  const handleFavoriteClick = (episode) => {
    addToFavorites({
      ...episode,
      showId: show.id,
      seasonId: episode.seasonId,
    });
  };

  return (
    <div className="ShowDetails">
      {loading ? (
        <p>Loading show details...</p>
      ) : (
        <div>
          <h2>{show?.title}</h2>
          <p>Genres: {show?.genres.map((genre) => genre.title).join(', ')}</p>
          <p>Last Updated: {show?.lastUpdated ? new Date(show.lastUpdated).toLocaleDateString() : 'N/A'}</p>
          <details>
            <summary>Seasons</summary>
            {show?.seasons.map((season, index) => (
              <details key={season.id}>
                <summary>Season {index + 1}</summary>
                <img src={seasonImages[season.id]} alt={`Season ${index + 1}`} className="SeasonImage" />
                <ol>
                  {season.episodes.map((episode) => (
                    <li key={episode.id}>
                      <h3>{episode.title}</h3>
                      <p>{episode.description}</p>
                      <button onClick={() => handleFavoriteClick(episode)}>Add to Favorites</button>
                      <button onClick={() => togglePlay(episode.audioUrl)}>Play</button>
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

export default ShowDetails;
