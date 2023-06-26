import React, { useState } from 'react';
import { Avatar, CollapseProps, Collapse } from "antd";
import { UserOutlined } from '@ant-design/icons';
import { FaPlay, FaPause, FaForwards, FaCog } from 'react-icons/fa';

import NextButton from '@routes/course/controls/SkipControl'
import FullscreenButton from '@routes/course/controls/FullscreenControl';
import QualidadeButton from './controls/QualityControl';
import PauseButton from '@routes/course/controls/PauseControl';
import VolumeButton from '@routes/course/controls/VolumeControl';

import VideoSections from './SectionVideo';
import VideoDescription from './DescriptionVideo';


import './showVideo.css';



const VideoPlayer = () => {
  return (
    <div>
      <div className='flex gap-16 mt-16'>
        <div className="video-player">
          <div className="video-player-container"></div>
          <div className="video-player-controls">
            <div className='button-group1'>
              <PauseButton/>
              <NextButton/>
              <VolumeButton/>
            </div>
            <div className='button-group2'>
              <QualidadeButton/>
              <FullscreenButton/>
            </div>
            
          </div>
        </div>

        <VideoSections/>

      </div>

      <div>
        <div className='font-bold text-2xl mt-2'>
          <h1>Titulo do video</h1>
        </div>

        <div className='flex items-center'>
          <Avatar size={48} icon={<UserOutlined />} />  
            <h2 className='text-xl font-bold ml-2'>User Name</h2>
        </div>
        
        <VideoDescription/>

      </div>


    </div>
   
  );
};

export default VideoPlayer;
