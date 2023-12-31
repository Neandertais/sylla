import { useState } from "react";

export default function Description({ description }: { description: string }) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const truncatedDescription = description.substring(0, 50);
  const isTruncated = description.length > 50;

  return (
    <div className="mt-2 w-100">
      <p className="text-justify">{showFullDescription ? description : truncatedDescription}</p>
      {isTruncated && (
        <button
          className="text-blue-600 font-bold bg-transparent outline-none cursor-pointer focus:outline-none"
          onClick={toggleDescription}
        >
          {showFullDescription ? "Mostrar menos" : "Ler mais"}
        </button>
      )}
    </div>
  );
}
