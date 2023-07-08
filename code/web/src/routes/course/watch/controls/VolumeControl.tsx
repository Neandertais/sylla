import { FiVolume2, FiVolumeX } from "react-icons/fi";

export default function VideoVolumeControl({ state, dispatch }: { state: any; dispatch: any }) {
  const isMuted = state.volume === 0;

  return (
    <div className="flex items-center text-white cursor-pointer group">
      {isMuted ? (
        <FiVolumeX size={18} onClick={() => dispatch({ type: "UPDATE", payload: { volume: 1 } })} />
      ) : (
        <FiVolume2 size={18} onClick={() => dispatch({ type: "UPDATE", payload: { volume: 0 } })} />
      )}

      <div className="w-24 hidden ml-2 group-hover:inline-flex">
        <input
          type="range"
          min="0"
          max="100"
          value={state.volume * 100}
          onChange={(e) => dispatch({ type: "UPDATE", payload: { volume: +e.target.value / 100 } })}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
}
