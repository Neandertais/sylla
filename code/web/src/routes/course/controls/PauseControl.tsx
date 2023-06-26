import React, { useState } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';

const PausaButton = () => {
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div onClick={togglePlayback} style={{color:'white'}}>
      {isPlaying ? <FaPause /> : <FaPlay />}
    </div>
  );
}

export default PausaButton;
