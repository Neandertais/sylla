import { useState } from "react";
import { Popover } from "antd";

import { FaCog } from "react-icons/fa";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

export default function Settings({
  playerContainer,
  qualities,
  state,
  dispatch,
}: {
  playerContainer: any;
  qualities: string[];
  state: any;
  dispatch: any;
}) {
  const [popoverIsOpen, setPopoverIsOpen] = useState(false);
  const [tab, setTab] = useState<"menu" | "quality" | "speed">("menu");

  const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  const menu = (
    <div>
      <div
        className="flex items-center justify-between gap-8 p-2 rounded-md cursor-pointer hover:bg-gray-200"
        onClick={() => setTab("speed")}
      >
        <p>Velocidade de Reprodução</p>
        <p className="flex items-center gap-1">
          {state.speed === 1 ? "Normal" : state.speed} <IoIosArrowForward />
        </p>
      </div>
      <div
        className="flex items-center justify-between gap-8 p-2 rounded-md cursor-pointer hover:bg-gray-200"
        onClick={() => setTab("quality")}
      >
        <p>Qualidade</p>
        <p className="flex items-center gap-1">
          {state.quality} <IoIosArrowForward />
        </p>
      </div>
    </div>
  );

  const qualityTab = (
    <div>
      <div
        className="flex items-center justify-between gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-200"
        onClick={() => setTab("menu")}
      >
        <IoIosArrowBack />
        <p className="mr-4">Qualidade</p>
      </div>
      <div>
        {qualities.map((quality) => (
          <p
            key={quality}
            onClick={() => dispatch({ type: "UPDATE", payload: { quality } })}
            className="p-2 rounded-md cursor-pointer hover:bg-gray-200"
          >
            {quality}
          </p>
        ))}
      </div>
    </div>
  );

  const speedTab = (
    <div>
      <div
        className="flex items-center justify-between gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-200"
        onClick={() => setTab("menu")}
      >
        <IoIosArrowBack />
        <p className="mr-4">Velocidade de Reprodução</p>
      </div>
      <div className="max-h-40 overflow-y-scroll">
        {speeds.map((speed) => (
          <p
            key={speed}
            onClick={() => dispatch({ type: "UPDATE", payload: { speed } })}
            className="p-2 rounded-md cursor-pointer hover:bg-gray-200"
          >
            {speed === 1 ? "Normal" : speed}
          </p>
        ))}
      </div>
    </div>
  );

  const tabs = {
    menu,
    quality: qualityTab,
    speed: speedTab,
  };

  return (
    <Popover
      open={popoverIsOpen}
      onOpenChange={(state) => setPopoverIsOpen(state)}
      getPopupContainer={() => playerContainer.current}
      placement="topRight"
      trigger="click"
      arrow={false}
      content={tabs[tab]}
    >
      <FaCog className="text-white cursor-pointer" size={18} />
    </Popover>
  );
}
