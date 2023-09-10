import useUserInfo from "@/hooks/useUserInfo";
import axios from "axios";
import { useState } from "react";
import Avatar from "./Avatar";
import Upload from "./Upload";

import { PulseLoader } from "react-spinners";

export default function PostForm({
  onPost,
  compact,
  parent,
  placeholder = "What's happening?",
}) {
  const [text, setText] = useState("");
  const { userInfo, userInfoStatus } = useUserInfo();
  const [images, setImages] = useState([]);

  if (userInfoStatus === "loading") {
    return "";
  }

  async function handlePostSubmit(e) {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    await axios.post("/api/posts", { text, userId, parent, images });
    setText("");
    setImages([]);
    if (onPost) {
      onPost();
    }
  }

  return (
    <form className="mx-4" onSubmit={handlePostSubmit}>
      <div className={(compact ? "items-center " : "") + "flex"}>
        <div>
          <Avatar src={userInfo?.image} />
        </div>
        <div className="grow pl-2">
          <Upload onUploadFinish={(src) => setImages((prev) => [...prev, src])}>
            {({ isUploading }) => (
              <div>
                <textarea
                  className={
                    (compact ? "h-10 " : "h-24 ") +
                    "w-full p-2 bg-transparent mt-1 text-twitterWhite resize-none outline-none"
                  }
                  placeholder={placeholder}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <div className="flex -mx-2">
                  {images.length > 0 &&
                    images.map((img) => {
                      return (
                        <div className="h-24 m-2" key={img}>
                          <img src={img} alt="" className="h-24 w-24" />
                        </div>
                      );
                    })}
                  {isUploading && (
                    <div className="h-24 w-24 m-2 bg-twitterBorder flex items-center justify-center">
                      <PulseLoader size={12} color="#fff" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </Upload>

          {!compact && (
            <div className="text-right border-t border-twitterBorder pt-2 pb-2">
              <button className="bg-twitterBlue text-white px-5 py-2 rounded-full">
                tweet
              </button>
            </div>
          )}
        </div>
        {compact && (
          <div className="pl-2">
            <button className="bg-twitterBlue text-white px-5 py-2 rounded-full">
              tweet
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
