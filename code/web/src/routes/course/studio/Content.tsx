import interactjs from "interactjs";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Input, Skeleton } from "antd";
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
      accept: "[data-type=video],[data-type=section]",
      ondragenter: async (e) => {
        const draggingID = e.relatedTarget.dataset.id;
        const destinationID = e.target.dataset.id == "null" ? null : e.target.dataset.id;

        if (e.relatedTarget.dataset.type === "section" && e.target.dataset.type === "section") {
          studio.handleSectionChange(draggingID, destinationID);
          return;
        }

        if (e.relatedTarget.dataset.type === "video") {
          if (e.target.dataset.type === "section") {
            await studio.handleVideoChangeSection(draggingID, destinationID);

            if (!e.target.parentElement.contains(e.relatedTarget)) {
              ghost.current!.setAttribute("style", "");
              e.target.classList.remove("selected");
            }

            return;
          }
          studio.handleVideoChange(draggingID, destinationID);

          if (!e.target.parentElement.contains(e.relatedTarget)) {
            ghost.current!.setAttribute("style", "");
            e.target.classList.remove("selected");
          }
        }
      },
    });
  }, []);

  const addDraggable = useCallback((ref: any, setIsOpen?: Function) => {
    const position = { x: 0, y: 0 };

    interactjs(ref)
      .draggable({
        autoScroll: true,
        listeners: {
          start: (e) => {
            const clone = e.target.cloneNode(true);
            clone.classList.add("dragging");

            ghost.current!.firstChild?.remove();
            ghost.current!.appendChild(clone);

            ghost.current!.style.width = e.rect.width + "px";
            ghost.current!.style.top = e.rect.top + "px";
            ghost.current!.style.left = e.rect.left + "px";

            position.x = 0;
            position.y = 0;

            e.target.classList.add("selected");
            e.target.dataset.state = "selected";

            setIsOpen && setIsOpen(false);
          },
          move: (e) => {
            position.x += e.dx;
            position.y += e.dy;

            ghost.current!.style.transform = `translate(${position.x}px, ${position.y}px)`;
          },
          end: (e) => {
            ghost.current!.setAttribute("style", "");
            e.target.classList.remove("selected");
            e.target.dataset.state = "";
          },
        },
      })
      .styleCursor(false);
  }, []);

  useEffect(() => {
    const node = dropzoneFirst.current;
    if (!node) return;

    addDropZone(node);

    return () => {
      interactjs(node as any).unset();
    };
  }, [isLoading]);

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <div className="mb-8">
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
      <div ref={dropzoneFirst} data-id="null" data-type="section" className="mt-4 h-8 w-full"></div>
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

      <div ref={ghost} className="absolute top-[-9999px] pointer-events-none touch-none bg-gray-50"></div>
    </div>
  );
}
