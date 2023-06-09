import React from 'react';
import { Collapse, Button, Space } from 'antd';

import { MdOutlineDelete, MdOutlineModeEditOutline} from "react-icons/md";
import LayoutSideBar from "@components/LayoutSideBar";
import { Content } from "antd/es/layout/layout";

const { Panel } = Collapse;

const App: React.FC = () => {
  const videosByCategory = [
    {
      category: 'Introdução',
      videos: [
        {
          id: '1',
          url: 'https://example.com/video1.mp4',
          date: '2023-05-13',
        },
        {
          id: '2',
          url: 'https://example.com/video2.mp4',
          date: '2023-05-12',
        },
      ],
    },
    {
      category: 'Avançado',
      videos: [
        {
          id: '3',
          url: 'https://example.com/video3.mp4',
          date: '2023-05-11',
        },
      ],
    },
  ];

  const handleEdit = (id: string) => {
    console.log(`Editar vídeo com ID: ${id}`);
  };

  const handleDelete = (id: string) => {
    console.log(`Excluir vídeo com ID: ${id}`);
  };

  const renderVideoPanel = (video: any) => {
    return (
      <Panel
        header={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <img src={video.thumbnail} alt="thumbnail" style={{ width: '120px', marginRight: '16px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <h3>{video.title}</h3>
              <p>{video.subtitle}</p>
              <p>(Postado em {video.date})</p>
            </div>
            <Space>
              <MdOutlineDelete 
                onClick={() => handleEdit(video.id)}
              />

              <MdOutlineModeEditOutline
                onClick={() => handleDelete(video.id)}
              />

            </Space>
          </div>
        }
        key={video.id}
      >
        <div style={{ maxWidth: '500px' }}>
          <video src={video.url} controls width="100%" style={{ maxWidth: '300px' }} />
        </div>
      </Panel>
    );
  };

  return (
    <LayoutSideBar>
        <Content>
            <h1 className="font-sans font-bold text-2xl ml-14 mt-10">Videos</h1>
            <div style={{ width:'1000px', marginLeft: ' 80px', marginTop:'17px' }}>
                <Collapse defaultActiveKey={['1']}>
                    {videosByCategory.map((category) => (
                        <Panel header={category.category} key={category.category}>
                            {category.videos.map((video) => renderVideoPanel(video))}
                        </Panel>
                    ))}
                </Collapse> 
            </div>
        </Content>
    </LayoutSideBar>
    
  );
};

export default App;
