import { useEffect, useState } from "react";

import { FaExpand, FaCompress } from "react-icons/fa";

export default function FullscreenButton({ player }: { player: React.RefObject<HTMLDivElement> }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen();
    } else {
      player.current?.requestFullscreen();
    }
  };

  useEffect(() => {
    const changeState = () => setIsFullscreen((prev) => !prev);

    player.current?.addEventListener("fullscreenchange", changeState);

    return () => player.current?.removeEventListener("fullscreenchange", changeState);
  }, []);

  return (
    <div onClick={toggleFullscreen} className="flex items-center text-white cursor-pointer">
      {isFullscreen ? <FaCompress size={18} /> : <FaExpand size={18} />}
    </div>
  );
}
