import clsx from "clsx";
import interactjs from "interactjs";
import { useEffect, useRef, useState } from "react";

import { FiUploadCloud, FiTrash, FiSettings } from "react-icons/fi";
import { MdDragIndicator } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";

import type useStudio from "@services/studio";
import VideoUpload from "./VideoUpload";
import { Link, useParams } from "react-router-dom";
import { Modal } from "antd";

export default function Panel({
  addDraggable,
  addDropZone,
  section,
  studio,
}: {
  addDraggable: Function;
  addDropZone: Function;
  section: Section;
  studio: ReturnType<typeof useStudio>;
}) {
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    addDraggable(node, setIsOpen);
    addDropZone(node);

    return () => {
      interactjs(node as any).unset();
    };
  }, []);

  return (
    <>
      <div className="bg-gray-50 border border-b-0 last-of-type:border-b last-of-type:rounded-b-lg first-of-type:rounded-t-lg touch-none !cursor-default">
        <div
          ref={containerRef}
          className="flex items-center justify-between p-3 data-[state=selected]:opacity-0"
          data-type="section"
          data-id={section.id}
          onClick={() => setIsOpen((prev) => !prev)}
          onMouseDown={(e) => {
            e.detail > 1 && e.preventDefault();
          }}
        >
          <div className="flex items-center gap-2">
            <IoIosArrowForward size={12} className={clsx(["transition", isOpen && "rotate-90"])} />
            <p
              contentEditable
              suppressContentEditableWarning={true}
              className="outline-none cursor-text"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => {
                e.detail > 1 && e.stopPropagation();
              }}
              onInput={(e) => {
                studio.handleUpdateSection(section.id, e.currentTarget.textContent!);
              }}
            >
              {section.name}
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <FiUploadCloud
              className="cursor-pointer"
              size="16"
              onClick={(e) => {
                e.stopPropagation();
                setIsUploadModalOpen(true);
              }}
            />
            <FiTrash
              className="cursor-pointer"
              size="16"
              onClick={(e) => {
                e.stopPropagation();
                Modal.confirm({
                  centered: true,
                  title: "Confirmação",
                  content: "Tem certeza que deseja excluir a sessão?",
                  cancelText: "Cancelar",
                  okText: "Sim",
                  onOk: () => {
                    studio.handleDeleteSection(section.id);
                  },
                });
              }}
            />
            <MdDragIndicator className="cursor-move" size="18" />
          </div>
        </div>
        {isOpen && (
          <div className="w-full border-t">
            {section.videos?.map((video) => (
              <VideoPanel key={video.id} video={video} addDraggable={addDraggable} addDropZone={addDropZone} />
            ))}
          </div>
        )}
      </div>
      <VideoUpload section={section.id} isOpen={isUploadModalOpen} setIsOpen={setIsUploadModalOpen} />
    </>
  );
}

function VideoPanel({
  video,
  addDraggable,
  addDropZone,
}: {
  video: Video;
  addDraggable: Function;
  addDropZone: Function;
}) {
  const containerRef = useRef(null);

  const { id } = useParams();

  useEffect(() => {
    const node = containerRef.current;
    addDraggable(node);
    addDropZone(node);

    return () => {
      interactjs(node as any).unset();
    };
  }, []);

  return (
    <div ref={containerRef} data-type="video" data-id={video.id} className="border-t first-of-type:border-t-0 group">
      <div className="flex gap-6 items-center px-6 py-3 group-[.selected]:opacity-0 group-[.dragging]:border group-[.dragging]:rounded-md">
        <Link to={`/watch/${id}/${video.id}`} className="w-full max-w-[120px]">
          <div className="relative w-full aspect-video bg-zinc-200 rounded-md overflow-hidden">
            {video.thumbnailUrl && (
              <img className="absolute w-full h-full object-cover" src={video.thumbnailUrl} alt="" />
            )}
          </div>
        </Link>
        <div className="w-full flex items-center justify-between">
          <div className="flex-[2]">
            <p className="font-bold">{video.name}</p>
            <p className="max-w-[40ch] whitespace-nowrap overflow-hidden text-ellipsis">{video.description}</p>
          </div>
          <p className="flex-1 text-center font-bold">
            20 <br /> visualizações
          </p>
          <p className="flex-1 text-center font-bold">
            {new Date(video.created_at).toLocaleDateString("pt", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
          <Link to={video.id}>
            <FiSettings size={18} />
          </Link>
        </div>
        <MdDragIndicator className="rotate-90 cursor-move" size={26} />
      </div>
    </div>
  );
}
