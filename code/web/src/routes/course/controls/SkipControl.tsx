import React from 'react';
import { FaForward } from 'react-icons/fa';

const NextButton = () => {
  const goToNextVideo = () => {
    // Lógica para pular para o próximo vídeo
    console.log('Pular para o próximo vídeo');
  };

  return (
    <div onClick={goToNextVideo} style={{color:'white'}}>
      <FaForward />
    </div>
  );
};

export default NextButton;
