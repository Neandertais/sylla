import { memo } from "react";
import { Collapse } from "antd";
import { Link } from "react-router-dom";

const { Panel } = Collapse;

const Sections = memo(() => {
  const sections: Section[] = [
    {
      id: "asdaw",
      name: "Vamos tesar",
      videos: [
        {
          id: "1",
          name: "Vídeo de Introdução 1",
          description: "Lorem ipsum dolor sit amet",
          thumbnailUrl: "https://example.com/thumbnail1.jpg",
          created_at: "2023-06-01",
        },
        {
          id: "1",
          name: "Vídeo de Introdução 1",
          description: "Lorem ipsum dolor sit amet",
          thumbnailUrl: "https://example.com/thumbnail1.jpg",
          created_at: "2023-06-01",
        },
        {
          id: "1",
          name: "Vídeo de Introdução 1",
          description: "Lorem ipsum dolor sit amet",
          thumbnailUrl: "https://example.com/thumbnail1.jpg",
          created_at: "2023-06-01",
        },
      ],
    },
  ];

  return (
    <div className="w-full lg:w-4/12">
      <Collapse>
        {sections.map((section) => (
          <Panel key={section.id} header={section.name}>
            {section.videos?.map((video) => (
              <Link to="" className="hover:text-inherit">
                <div className="w-full flex items-center gap-3 p-1 rounded-md transition hover:bg-gray-200">
                  <div className="w-full max-w-[120px] flex items-center aspect-video">
                    <img
                      src="https://picsum.photos/256/320"
                      alt="Thumbnail"
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <h2 className="font-bold text-sm">{video.name}</h2>
                </div>
              </Link>
            ))}
          </Panel>
        ))}
      </Collapse>
    </div>
  );
});

export default Sections;
