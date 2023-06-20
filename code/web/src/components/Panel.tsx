import clsx from "clsx";
import interactjs from "interactjs";
import { useEffect, useRef, useState } from "react";

import { FiUploadCloud, FiTrash } from "react-icons/fi";
import { MdDragIndicator } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";

import type useStudio from "@services/studio";

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

  useEffect(() => {
    const node = containerRef.current;
    addDraggable(node);
    addDropZone(node);

    return () => {
      interactjs(node as any).unset();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="group bg-gray-50 border border-b-0 last-of-type:border-b last-of-type:rounded-b-lg first-of-type:rounded-t-lg touch-none !cursor-default"
      data-type="video"
      data-id={section.id}
    >
      <div
        className="flex items-center justify-between p-3 group-[.selected]:opacity-0"
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
          <FiUploadCloud size="16" />
          <FiTrash
            className="cursor-pointer"
            size="16"
            onClick={(e) => {
              e.stopPropagation();
              studio.handleDeleteSection(section.id);
            }}
          />
          <MdDragIndicator className="cursor-move" size="18" />
        </div>
      </div>
      {isOpen && (
        <div className="w-full border-t px-6 py-3">
          <p>Content</p>
        </div>
      )}
    </div>
  );
}
