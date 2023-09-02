import { FileDrop } from "react-file-drop";
import { useEffect, useState } from "react";
import useUserInfo from "@/hooks/useUserInfo";

export default function Cover({ src }) {
  const { userInfo, status: userInfoStatus } = useUserInfo();
  const [isFileNearby, setIsFileNearby] = useState(false);
  const [isFileOver, setIsFileOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [userId, setUserId] = useState();
  const [newCover, setNewCover] = useState();

  async function getUserInfo() {
    let userID = await userInfo?._id;
    setUserId(userID);
  }
  useEffect(() => {
    getUserInfo();
    setNewCover(src);
  }, [userInfoStatus]);

  let extraClasses = "";
  if (isFileNearby) extraClasses += " opacity-80";
  if (isFileOver) extraClasses += " opacity-60";

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
      const cover = await json.userCover.cover;
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
      <div
        className={
          "flex items-center overflow-hidden h-36 bg-twitterBorder" +
          extraClasses
        }
      >
        {isUploading && <div>upload</div>}
        {!isUploading && <img src={newCover} alt="" className="w-full"></img>}
      </div>
    </FileDrop>
  );
}
