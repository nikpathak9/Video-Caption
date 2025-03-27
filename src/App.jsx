import { useEffect, useRef, useState } from "react";
import "./index.css";
import Video from "./component/Video";
import CaptionsList from "./component/CaptionsList";
import CaptionForm from "./component/CaptionForm";
import logo from "./images/pngegg.png";

const App = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [captions, setCaptions] = useState([]);
  const [caption, setCaption] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [currentCaption, setCurrentCaption] = useState("");
  const [editingIndex, setEditingIndex] = useState(null); // To track which caption is being edited
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  // Convert time from HH:MM:SS or MM:SS to seconds
  const convertToSeconds = (timeStr) => {
    const parts = timeStr.split(":").map((part) => parseInt(part, 10));
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1]; // MM:SS format
    } else if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2]; // HH:MM:SS format
    }
    return 0;
  };

  useEffect(() => {
    setCaptions([]); // Clear the captions when the video URL is changed
    setIsVideoLoaded(false); // Reset the video loaded state
  }, [videoUrl, videoRef]);

  const checkForOverlap = (newStart, newEnd) => {
    return captions.some(
      ({ startTime, endTime }) => newStart < endTime && newEnd > startTime // Check if the time ranges overlap
    );
  };

  // Convert time from seconds to HH:MM:SS or MM:SS
  const convertToTimeFormat = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const sec = Math.floor(seconds % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${sec
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `${minutes}:${sec.toString().padStart(2, "0")}`;
    }
  };

  const handleAddOrUpdateCaption = () => {
    const start = convertToSeconds(startTime);
    const end = convertToSeconds(endTime);

    const videoDuration = videoRef.current?.duration;

    // Check if the end time exceeds the video duration
    if (videoDuration && end > videoDuration) {
      alert(`End time exceeds video duration. Please enter a valid end time.`);
      return;
    }

    // Ensure valid caption and time range
    if (caption && start && end && start < end) {
      // If editing an existing caption, skip the overlap check
      if (editingIndex === null) {
        // Check for overlap only when adding a new caption
        if (checkForOverlap(start, end)) {
          alert(
            "The time range overlaps with an existing caption. Please choose a different time range or edit the existing caption."
          );
          return;
        }
      }

      if (editingIndex !== null) {
        // Update the existing caption if the timestamps are the same
        const updatedCaptions = captions.map((c, index) =>
          index === editingIndex
            ? { caption, startTime: start, endTime: end }
            : c
        );
        setCaptions(updatedCaptions);
        setEditingIndex(null); // Reset editing mode after updating
      } else {
        // Check if a caption with the same timestamps already exists
        const existingCaptionIndex = captions.findIndex(
          (c) => c.startTime === start && c.endTime === end
        );
        if (existingCaptionIndex !== -1) {
          // If the same time range already exists, update it
          const updatedCaptions = captions.map((c, index) =>
            index === existingCaptionIndex
              ? { caption, startTime: start, endTime: end }
              : c
          );
          setCaptions(updatedCaptions);
        } else {
          // Add a new caption
          setCaptions([
            ...captions,
            { caption, startTime: start, endTime: end },
          ]);
        }
      }

      // Clear the input fields after adding or updating the caption
      setCaption("");
      setStartTime("");
      setEndTime("");
    } else {
      alert("Please fill all fields correctly to add a caption.");
    }
  };

  const handleDeleteCaption = (index) => {
    const updatedCaptions = captions.filter((_, i) => i !== index);
    setCaptions(updatedCaptions);
  };

  const handleEditCaption = (index) => {
    const captionToEdit = captions[index];
    setCaption(captionToEdit.caption);
    setStartTime(convertToTimeFormat(captionToEdit.startTime)); // Convert to original time format
    setEndTime(convertToTimeFormat(captionToEdit.endTime)); // Convert to original time format
    setEditingIndex(index); // Set the index of the caption being edited
  };

  const handleTimeUpdate = () => {
    const currentTime = videoRef.current.currentTime;

    const activeCaption = captions.find(
      ({ startTime, endTime }) =>
        currentTime >= startTime && currentTime <= endTime
    );
    if (activeCaption) {
      setCurrentCaption(activeCaption.caption);
    } else {
      setCurrentCaption("");
    }
  };

  const handleLoadVideo = () => {
    setIsVideoLoaded(true);
  };

  return (
    <div className='container'>
      {/* Logo */}
      <span className='logo'>
        <img src={logo} />
        <h1>Video Caption</h1>
      </span>

      {/* Form */}
      <div className='form'>
        <label htmlFor='video'>
          Enter Video URL (Should be an mp4 file URL)
        </label>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            width: "auto",
          }}
        >
          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            id='video'
            type='url'
            style={{ width: "75%" }}
          />
          <button onClick={handleLoadVideo} disabled={!videoUrl}>
            Load Video
          </button>
        </div>
        <p style={{ fontSize: "14px", color: "#777", marginTop: "0.1rem" }}>
          Example: https://example.com/video.mp4
        </p>

        {/* Video Component */}

        <Video
          videoRef={videoRef}
          videoUrl={videoUrl}
          isVideoLoaded={isVideoLoaded}
          handleTimeUpdate={handleTimeUpdate}
          currentCaption={currentCaption}
        />

        {/* Caption Form */}

        {isVideoLoaded && (
          <CaptionForm
            caption={caption}
            setCaption={setCaption}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            handleAddOrUpdateCaption={handleAddOrUpdateCaption}
            editingIndex={editingIndex}
          />
        )}

        {/* Captions List */}

        <CaptionsList
          isVideoLoaded={isVideoLoaded}
          captions={captions}
          handleDeleteCaption={handleDeleteCaption}
          handleEditCaption={handleEditCaption}
          convertToTimeFormat={convertToTimeFormat}
        />
      </div>
    </div>
  );
};

export default App;
