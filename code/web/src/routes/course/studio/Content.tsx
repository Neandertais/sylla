import interactjs from "interactjs";

import { Button, Input, Skeleton } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import Panel from "@components/Panel";

import useStudio from "@services/studio";

export default function Test() {
  const ghost = useRef<HTMLDivElement>(null);
  const dropzoneFirst = useRef<HTMLDivElement>(null);

  const { id } = useParams();
  const studio = useStudio(id!);
  const [newSectionName, setNewSectionName] = useState("");

  const { sections, isLoading, handleCreateSection } = studio;

  const addDropZone = useCallback((ref: any) => {
    interactjs(ref).dropzone({
      accept: "[data-type=video]",
      ondragenter: (e) => {
        const draggingID = e.relatedTarget.dataset.id;
        const destinationID = e.target.dataset.id == "null" ? null : e.target.dataset.id;

        studio.handleSectionChange(draggingID, destinationID);
      },
    });
  }, []);

  const addDraggable = useCallback((ref: any) => {
    const position = { x: 0, y: 0 };

    interactjs(ref).draggable({
      autoScroll: true,
      listeners: {
        start: (e) => {
          ghost.current!.firstChild?.remove();
          ghost.current!.appendChild(e.target.cloneNode(true));

          ghost.current!.style.width = e.rect.width + "px";
          ghost.current!.style.top = e.rect.top + "px";
          ghost.current!.style.left = e.rect.left + "px";

          position.x = 0;
          position.y = 0;

          e.target.classList.add("selected");
        },
        move: (e) => {
          position.x += e.dx;
          position.y += e.dy;

          ghost.current!.style.transform = `translate(${position.x}px, ${position.y}px)`;
        },
        end: (e) => {
          ghost.current!.setAttribute("style", "");
          e.target.classList.remove("selected");
        },
      },
    });
  }, []);

  useEffect(() => {
    const node = dropzoneFirst.current;
    if (!node) return;

    addDropZone(node);

    return () => {
      interactjs(node as any).unset();
    };
  }, [dropzoneFirst]);

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <div>
      <div className="flex items-center gap-6">
        <Input value={newSectionName} onChange={(e) => setNewSectionName(e.target.value)} />
        <Button
          type="primary"
          onClick={() => {
            handleCreateSection(newSectionName);
          }}
        >
          Adicionar seção
        </Button>
      </div>
      <div ref={dropzoneFirst} data-id="null" className="mt-4 h-4 w-full"></div>
      <div>
        {sections?.map((section) => (
          <Panel
            key={section.id}
            addDraggable={addDraggable}
            addDropZone={addDropZone}
            section={section}
            studio={studio}
          />
        ))}
      </div>

      <div ref={ghost} className="absolute top-[-9999px] pointer-events-none touch-none bg-white"></div>
    </div>
  );
}
