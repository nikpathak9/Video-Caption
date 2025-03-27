import React from "react";

const Video = ({
  videoUrl,
  isVideoLoaded,
  videoRef,
  handleTimeUpdate,
  currentCaption,
}) => {
  return (
    <>
      {videoUrl && isVideoLoaded && (
        <div className='video-container'>
          <video
            ref={videoRef}
            width='320'
            height='240'
            controls
            onTimeUpdate={handleTimeUpdate}
          >
            <source src={videoUrl} type='video/mp4' />
          </video>

          {currentCaption && (
            <div className='caption-overlay'>
              <p>{currentCaption}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Video;
