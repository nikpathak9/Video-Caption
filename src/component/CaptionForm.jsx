import React from "react";

const CaptionForm = ({
  caption,
  setCaption,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  handleAddOrUpdateCaption,
  editingIndex,
}) => {
  return (
    <>
      <label htmlFor='caption'>Enter Caption</label>
      <input
        id='caption'
        type='text'
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <label htmlFor='start-time'>Enter Start Time (HH:MM:SS or MM:SS)</label>
      <input
        id='start-time'
        type='text'
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />
      <label htmlFor='end-time'>Enter End Time (HH:MM:SS or MM:SS)</label>
      <input
        id='end-time'
        type='text'
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />
      <button onClick={handleAddOrUpdateCaption}>
        {editingIndex !== null ? "Update Caption" : "Add Caption"}
      </button>
    </>
  );
};

export default CaptionForm;
