import React, { useState, useRef, useEffect } from "react";

const AudioPlayer = ({
  playlist,
  currentTrack,
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    // Load last playing audio file and continue playing from the last position
    const savedTime = parseFloat(localStorage.getItem("lastTime")) || 0;
    setCurrentTime(savedTime);
    audioRef.current.currentTime = savedTime;
  }, [currentTrack]);

  const handlePlay = () => {
    onPlay();
    audioRef.current.play();
  };

  const handlePause = () => {
    onPause();
    audioRef.current.pause();
  };

  const handleEnded = () => {
    const nextTrack = (currentTrack + 1) % playlist.length;
    onEnded(nextTrack);
  };

  const handleTimeUpdate = () => {
    const time = audioRef.current.currentTime;
    setCurrentTime(time);
    onTimeUpdate(time);
    // Save current time to localStorage
    localStorage.setItem("lastTime", time.toString());
  };

  return (
    <div>
      <audio
        ref={audioRef}
        src={playlist[currentTrack]}
        controls
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
      />
    </div>
  );
};

const App = () => {
  const [files, setFiles] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

    // Create an object URL for each selected file
    const selectedPlaylist = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setPlaylist((prevPlaylist) => [...prevPlaylist, ...selectedPlaylist]);
  };

  const handleRemoveTrack = (index) => {
    const updatedPlaylist = [...playlist];
    updatedPlaylist.splice(index, 1);
    setPlaylist(updatedPlaylist);

    // If the removed track is the current track, move to the next track
    if (index === currentTrack && updatedPlaylist.length > 0) {
      setCurrentTrack((prevTrack) => (prevTrack + 1) % updatedPlaylist.length);
    }
  };

  const handlePlay = () => {
    // Do any additional play logic if needed
  };

  const handlePause = () => {
    // Do any additional pause logic if needed
  };

  const handleEnded = (nextTrack) => {
    setCurrentTrack(nextTrack);
  };

  const handleTimeUpdate = (currentTime) => {
    setCurrentTime(currentTime);
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
      {playlist.length > 0 && (
        <div>
          <AudioPlayer
            playlist={playlist}
            currentTrack={currentTrack}
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleEnded}
            onTimeUpdate={handleTimeUpdate}
          />
          <h3>Playlist</h3>
          <ul>
            {playlist.map((track, index) => (
              <li key={index}>
                <button onClick={() => setCurrentTrack(index)}>
                  {index === currentTrack ? "Now Playing: " : ""}
                  {track}
                </button>
                <button onClick={() => handleRemoveTrack(index)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
