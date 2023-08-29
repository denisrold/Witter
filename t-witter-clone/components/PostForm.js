import useUserInfo from "@/hooks/useUserInfo";
import axios from "axios";
import { useEffect, useState } from "react";

export default function PostForm({ onPost }) {
  const [text, setText] = useState("");
  const { userInfo, status } = useUserInfo();
  if (status === "loading") {
    return "";
  }

  async function handlePostSubmit(e) {
    e.preventDefault();
    const userId = userInfo._id;
    await axios.post("/api/posts", { text, userId });
    setText("");
    if (onPost) {
      onPost();
    }
  }

  return (
    <form className="mx-4" onSubmit={handlePostSubmit}>
      <div className="flex">
        <div>
          <div className="rounded-full overflow-hidden w-12">
            <img src={userInfo?.image} alt="avatar" />
          </div>
        </div>
        <div className="grow pl-2">
          <textarea
            className="w-full p-2 bg-transparent text-twitterWhite"
            placeholder={"What's happening?"}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="text-right border-t border-twitterBorder pt-2 pb-2">
            <button className="bg-twitterBlue text-white px-5 py-2 rounded-full">
              tweet
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
