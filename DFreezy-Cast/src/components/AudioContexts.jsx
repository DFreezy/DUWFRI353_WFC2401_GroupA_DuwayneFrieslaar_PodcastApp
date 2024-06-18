// AudioContext.js

import React, { useState, useRef, createContext } from 'react';

const AudioContext = createContext();

const AudioProvider = ({ children }) => {
  const audioRef = useRef(); // Reference to audio element
  const [isPlaying, setIsPlaying] = useState(false); // Track play/pause state

  const togglePlay = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <AudioContext.Provider value={{ audioRef, togglePlay, isPlaying }}>
      {children}
    </AudioContext.Provider>
  );
};

export { AudioContext, AudioProvider };
