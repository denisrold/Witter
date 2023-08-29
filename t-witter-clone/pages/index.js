import UsernameForm from "@/components/UsernameForm";
import useUserInfo from "@/hooks/useUserInfo";
import PostForm from "@/components/PostForm";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const { userInfo, status: userInfoStatus } = useUserInfo();
  const [posts, setPosts] = useState([]);

  async function fetchHomePost() {
    const post = await axios
      .get("/api/posts")
      .then((response) => setPosts(response.data));
  }
  useEffect(() => {
    fetchHomePost();
  }, []);

  if (userInfoStatus === "loading") {
    return "loading user info";
  }
  if (!userInfo.username) {
    return <UsernameForm />;
  }

  return (
    <div className="max-w-lg mx-auto border-l border-r border-twitterBorder min-h-screen">
      <h1 className="text-lg font-bold p-4">Home</h1>
      <PostForm
        onPost={() => {
          fetchHomePost();
        }}
      />
      <div className="">
        {posts.length &&
          posts.map((p) => {
            return (
              <div className="border-t border-twitterBorder p-5">{p.text}</div>
            );
          })}
      </div>
    </div>
  );
}
