import React from "react";

const CaptionsList = ({
  isVideoLoaded,
  captions,
  handleDeleteCaption,
  handleEditCaption,
  convertToTimeFormat,
}) => {
  return (
    <>
      <div className='captions'>
        <h2>Added Captions</h2>
        {!isVideoLoaded && (
          <p>Please Add Url and Load Video to add the captions in the video</p>
        )}
        {captions.length === 0 && isVideoLoaded && (
          <p>No captions added yet. Add captions to see them here.</p>
        )}
        <ul>
          {captions.map((caption, index) => (
            <li key={index}>
              {index + 1}. {caption.caption} (Start:{" "}
              {convertToTimeFormat(caption.startTime)} - End:{" "}
              {convertToTimeFormat(caption.endTime)})
              <button onClick={() => handleEditCaption(index)}>Edit</button>
              <button onClick={() => handleDeleteCaption(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default CaptionsList;
