import React, { useState } from 'react';
import { FaCog } from 'react-icons/fa';
import './quality.css';

const QualidadeButton = () => {
  const [qualidade, setQualidade] = useState('Auto');
  const [aberto, setAberto] = useState(false);

  const opcoesQualidade = ['Auto', '144p', '240p', '360p', '480p', '720p','1080p']; 

  const handleChangeQualidade = (novaQualidade) => {
    setQualidade(novaQualidade);
    setAberto(false);
  };

  return (
    <div className="qualidade-button">
      <div className="qualidade-button-header" onClick={() => setAberto(!aberto)} style={{color:'white'}}>
        <FaCog />
        <span>{qualidade}</span>
      </div>
      {aberto && (
        <ul className="qualidade-button-opcoes">
          {opcoesQualidade.map((opcao, index) => (
            <li key={index} onClick={() => handleChangeQualidade(opcao)}>{opcao}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QualidadeButton;
