import React, { useState } from 'react';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';

const VideoVolumeControl = () => {
  const [volume, setVolume] = useState(50);
  const [isMuted, setMuted] = useState(false);

  const handleVolumeChange = (event) => {
    const newVolume = parseInt(event.target.value);
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  const handleMuteToggle = () => {
    if (isMuted) {
      // Unmute
      setMuted(false);
      setVolume(50); 
    } else {
      // Mute
      setMuted(true);
      setVolume(0);
    }
  };

  return (
    <div className="flex items-center">
      {isMuted ? (
        <FiVolumeX className="text-gray-500 mr-2" onClick={handleMuteToggle} />
      ) : (
        <FiVolume2 className="text-gray-500 mr-2" onClick={handleMuteToggle} />
      )}

      <div className="w-24">
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full h-2 rounded-lg bg-gray-300 appearance-none focus:outline-none"
        />
      </div>
    </div>
  );
};

export default VideoVolumeControl;
