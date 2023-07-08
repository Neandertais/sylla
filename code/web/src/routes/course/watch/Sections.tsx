import { Collapse } from "antd";
import clsx from "clsx";
import { Link } from "react-router-dom";

const { Panel } = Collapse;

export default function Sections({
  courseID,
  currentVideoID,
  sections,
}: {
  courseID: string;
  currentVideoID: string;
  sections: Section[];
}) {
  return (
    <div className="w-full lg:w-4/12">
      <Collapse
        defaultActiveKey={sections.find((section) => section.videos?.find((video) => video.id === currentVideoID))?.id}
      >
        {sections.map((section) => (
          <Panel key={section.id} header={section.name}>
            {section.videos?.map((video) => (
              <Link key={video.id} to={`/watch/${courseID}/${video.id}`} className="hover:text-inherit">
                <div
                  className={clsx([
                    "w-full flex items-center gap-3 p-1 rounded-md transition hover:bg-gray-200",
                    currentVideoID === video.id && "bg-gray-100",
                  ])}
                >
                  <div className="w-full max-w-[120px] flex items-center aspect-video">
                    <img src={video.thumbnailUrl} className="w-full h-full object-cover rounded-md" />
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
}
