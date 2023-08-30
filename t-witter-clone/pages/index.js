import UsernameForm from "@/components/UsernameForm";
import useUserInfo from "@/hooks/useUserInfo";
import PostForm from "@/components/PostForm";
import { useEffect, useState } from "react";
import axios from "axios";
import PostContent from "@/components/PostContent";
import Layout from "@/components/Layout";

export default function Home() {
  const { userInfo, status: userInfoStatus } = useUserInfo();
  const [posts, setPosts] = useState([]);
  const [idsLikedByMe, setIdsLikeByMe] = useState("");

  async function fetchHomePost() {
    const userId = await userInfo?._id;
    const post = await axios
      .get(`/api/posts?userId=${userId}`)
      .then((response) => {
        setPosts(response.data.posts);
        setIdsLikeByMe(response.data.idsLikedByMe);
      });
  }

  useEffect(() => {
    if (userInfoStatus != "loading") {
      fetchHomePost();
    }
  }, [userInfoStatus]);

  if (userInfoStatus === "loading") {
    return "loading user info";
  }
  if (!userInfo.username) {
    return <UsernameForm />;
  }

  return (
    <Layout>
      <h1 className="text-lg font-bold p-4">Home</h1>
      <PostForm
        onPost={() => {
          fetchHomePost();
        }}
      />
      <div className={`${!posts.length ? "hidden " : ""}`}>
        {posts.length &&
          posts.map((p) => {
            return (
              <div className="border-t border-twitterBorder p-5">
                <PostContent {...p} likedByMe={idsLikedByMe.includes(p._id)} />
              </div>
            );
          })}
      </div>
    </Layout>
  );
}
