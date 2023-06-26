import React from 'react';
import { Collapse } from 'antd';
import { UserOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { Panel } = Collapse;

const VideoSections = () => {
  const videosByCategory = [
    {
      category: 'Section - Clique para ver mais videos',
      videos: [
        {
          id: '1',
          title: 'Vídeo de Introdução 1',
          subtitle: 'Lorem ipsum dolor sit amet',
          thumbnail: 'https://example.com/thumbnail1.jpg',
          date: '2023-06-01',
        },
        {
          id: '2',
          title: 'Vídeo de Introdução 2',
          subtitle: 'Consectetur adipiscing elit',
          thumbnail: 'https://example.com/thumbnail2.jpg',
          date: '2023-06-02',
        },
        {
          id: '3',
          title: 'Vídeo de Introdução 3',
          subtitle: 'Consectetur adipiscing elit',
          thumbnail: 'https://example.com/thumbnail2.jpg',
          date: '2023-06-02',
        },
        {
          id: '4',
          title: 'Vídeo de Introdução 3',
          subtitle: 'Consectetur adipiscing elit',
          thumbnail: 'https://example.com/thumbnail2.jpg',
          date: '2023-06-02',
        },
      ],
    },
    
  ];

  
  const renderVideoPanel = (video) => {
    return (
      <Panel
        header={
          <div style={{ display: 'flex', alignItems: 'center',  }}>
            <div>
              <img src="https://picsum.photos/256/320" alt="Thumbnail" style={{ width: '100px', height:'56px', marginRight: '16px' }} />
            </div>
            <div style={{ flex: 1,  }}>
              <h3>{video.title}</h3>
              <p>{video.subtitle}</p>
            </div>
            
          </div>
        }
        key={video.id}
      >
        <video src={video.url} controls width="100%" style={{ maxWidth: '300px' }} />
      </Panel>
    );
  };

  return (
    <div>
      
      <Collapse defaultActiveKey={['1']}>
        {videosByCategory.map((category) => (
          <Panel header={category.category} key={category.category}>
            {category.videos.map((video) => renderVideoPanel(video))}
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default VideoSections;
