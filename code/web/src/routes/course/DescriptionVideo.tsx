import React, { useState } from 'react';

function VideoDescription() {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const description = 
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac neque sed risus sollicitudin fringilla ac vel purus. In nec lorem justo. Sed eu arcu ac tellus fringilla consectetur. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac neque sed risus sollicitudin fringilla ac vel purus. In nec lorem justo. Sed eu arcu ac tellus fringilla consectetur.';

  const truncatedDescription = description.substring(0, 50);
  const isTruncated = description.length > 50;

  return (
    <div className='mt-2 w-100'>
      <p className='text-justify'>{showFullDescription ? description : truncatedDescription}</p>
      {isTruncated && (
        <button  className="text-blue-600 font-bold bg-transparent outline-none focus:outline-none" onClick={toggleDescription}>
          {showFullDescription ? 'Mostrar menos' : 'Ler mais'}
        </button>
      )}
    </div>
  );
}

export default VideoDescription;
