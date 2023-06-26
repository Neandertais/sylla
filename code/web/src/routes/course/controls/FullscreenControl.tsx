import React, { useState } from 'react';
import { FaExpand, FaCompress } from 'react-icons/fa';

const FullscreenButton = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div onClick={toggleFullscreen} style={{color:'white'}}>
      {isFullscreen ? <FaCompress /> : <FaExpand />}
    </div>
  );
};

export default FullscreenButton;
