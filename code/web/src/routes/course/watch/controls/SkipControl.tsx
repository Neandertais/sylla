import { FaForward } from "react-icons/fa";

export default function NextButton() {
  const goToNextVideo = () => {};

  return (
    <div onClick={goToNextVideo} className="flex items-center cursor-pointer text-white">
      <FaForward size={18} />
    </div>
  );
}
