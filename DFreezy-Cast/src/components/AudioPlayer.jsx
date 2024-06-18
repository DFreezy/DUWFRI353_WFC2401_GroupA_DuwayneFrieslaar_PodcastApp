import React, { useState, useEffect } from 'react';

const Episode = ({ episode, addToFavorites }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  useEffect(() => {
    // Retrieve saved progress from localStorage on component mount
    const savedProgress = localStorage.getItem(`episode-${episode.id}-progress`);
    if (savedProgress) {
      setAudioProgress(parseFloat(savedProgress));
    }
  }, [episode.id]);

  useEffect(() => {
    // Save current progress to localStorage whenever it changes
    localStorage.setItem(`episode-${episode.id}-progress`, audioProgress.toString());
  }, [episode.id, audioProgress]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = (e) => {
    const { currentTime, duration } = e.target;
    if (duration > 0) {
      const progress = (currentTime / duration) * 100;
      setAudioProgress(progress);
    }
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * episode.duration;
    audioElement.currentTime = seekTime;
    setAudioProgress(e.target.value);
  };

  return (
    <div className="Episode">
      <h3>{episode.title}</h3>
      <p>{episode.description}</p>
      <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
      <input
        type="range"
        min="0"
        max="100"
        value={audioProgress}
        onChange={handleSeek}
      />
      <button onClick={() => addToFavorites(episode)}>
        Add to Favorites
      </button>
      {isPlaying && (
        <audio
          controls
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        >
          <source src={episode.audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default Episode;
