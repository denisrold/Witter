import { FileDrop } from "react-file-drop";
import { useEffect, useState } from "react";
import useUserInfo from "@/hooks/useUserInfo";
import { PulseLoader } from "react-spinners";

export default function Cover({ src }) {
  const { userInfo, status: userInfoStatus } = useUserInfo();
  const [isFileNearby, setIsFileNearby] = useState(false);
  const [isFileOver, setIsFileOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [userId, setUserId] = useState();
  const [newCover, setNewCover] = useState(src);

  async function getUserInfo() {
    let userID = await userInfo?._id;
    setUserId(userID);
  }
  useEffect(() => {
    getUserInfo();
  }, [userInfoStatus]);

  let extraClasses = "";
  if (isFileNearby) extraClasses = " bg-blue-500 opacity-30";
  if (isFileOver) extraClasses = "  bg-blue-500 opacity-60";

  async function updateImage(files, e) {
    e.preventDefault();
    setIsFileNearby(false);
    setIsFileOver(false);
    setIsUploading(true);
    const data = new FormData();
    data.append("userId", userId);
    data.append("cover", files[0]);
    fetch("/api/upload", {
      method: "POST",
      body: data,
    }).then(async (response) => {
      const json = await response.json();
      const cover = await json.source;
      setNewCover(cover);
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
      <div className={" bg-twitterBorder relative"}>
        <div className={"absolute inset-0" + extraClasses}></div>
        {isUploading && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: "rgb(48, 140, 216, 0.5)" }}
          >
            <PulseLoader size={16} color="#fff" />
          </div>
        )}
        {newCover && (
          <div className="flex items-center overflow-hidden  h-36">
            <img src={newCover} alt="" className="w-full"></img>
          </div>
        )}
      </div>
    </FileDrop>
  );
}
