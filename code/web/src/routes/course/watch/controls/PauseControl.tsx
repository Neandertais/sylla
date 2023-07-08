import { FaPlay, FaPause } from "react-icons/fa";

export default function PausaButton({ state, dispatch }: { state: any; dispatch: any }) {
  return (
    <div
      onClick={() => dispatch({ type: "PLAY/PAUSE", payload: {} })}
      className="flex items-center cursor-pointer text-white"
    >
      {state.playing ? <FaPause size={18} /> : <FaPlay size={18} />}
    </div>
  );
}
