import { FileDrop } from "react-file-drop";
import { useState } from "react";

export default function Cover() {
  const [isFileNearby, setIsFileNearby] = useState(false);
  const [isFileOver, setIsFileOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  let extraClasses = "";
  if (isFileNearby) extraClasses += " opacity-80";
  if (isFileOver) extraClasses += " opacity-60";

  function updateImage(files, e) {
    e.preventDefault();
    setIsUploading(true);
    const data = new FormData();
    data.append("cover", files[0]);
    fetch("/api/upload", {
      method: "POST",
      body: data,
    }).then(() => {
      setIsUploading(false);
    });
  }
  return (
    <FileDrop
      onDrop={updateImage}
      onDragOver={() => {
        setIsFileOver(true);
      }}
      onDragLeave={() => {
        setIsFileOver(false);
      }}
      onFrameDragEnter={() => setIsFileNearby(true)}
      onFrameDragLeave={() => setIsFileNearby(false)}
    >
      <div className={"h-36 bg-twitterBorder" + extraClasses}>
        {isFileNearby ? "Nearby" : "No Nearby"}
      </div>
    </FileDrop>
  );
}
