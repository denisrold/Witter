import useUserInfo from "@/hooks/useUserInfo";
import axios from "axios";
import { useState } from "react";
import Avatar from "./Avatar";
import Upload from "./Upload";

export default function PostForm({
  onPost,
  compact,
  parent,
  placeholder = "What's happening?",
}) {
  const [text, setText] = useState("");
  const { userInfo, status } = useUserInfo();
  const [images, setImages] = useState([]);
  if (status === "loading") {
    return "";
  }

  async function handlePostSubmit(e) {
    e.preventDefault();
    const userId = userInfo?._id;
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
            <textarea
              className={
                (compact ? "h-10 " : "h-24 ") +
                "w-full p-2 bg-transparent mt-1 text-twitterWhite"
              }
              placeholder={placeholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Upload>

          {images.length > 0 &&
            images.map((img) => {
              return (
                <div>
                  <img src={img} alt="" />
                </div>
              );
            })}

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
