import UsernameForm from "@/components/UsernameForm";
import useUserInfo from "@/hooks/useUserInfo";
import PostForm from "@/components/PostForm";
import { useEffect, useState } from "react";
import axios from "axios";
import PostContent from "@/components/PostContent";
import Layout from "@/components/Layout";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home() {
  const { userInfo, setUserInfo, status: userInfoStatus } = useUserInfo();
  const [posts, setPosts] = useState([]);
  const [idsLikedByMe, setIdsLikeByMe] = useState("");
  const router = useRouter();

  async function fetchHomePost() {
    const userId = localStorage.getItem("userId");
    if (userId) {
      await axios.get(`/api/posts?userId=${userId}`).then((response) => {
        setPosts(response?.data?.posts);
        setIdsLikeByMe(response?.data?.idsLikedByMe);
      });
    }
  }
  async function logOut() {
    setUserInfo(null);
    localStorage.removeItem("userId");
    await signOut();
  }

  useEffect(() => {
    if (userInfo && userInfoStatus != "loading") {
      fetchHomePost();
    }
  }, [userInfoStatus]);

  if (userInfoStatus === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <img src="/witterlogo.jpg" alt="" className="items-center w-20" />
      </div>
    );
  }
  if (userInfo && !userInfo?.username) {
    return <UsernameForm />;
  }
  if (!userInfo) {
    router.push("/login");
    return (
      <div className="flex items-center justify-center h-screen ">
        <img src="/witterlogo.jpg" alt="" className="items-center w-20" />
      </div>
    );
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
              <div className="border-t border-twitterBorder p-5" key={p._id}>
                {p.parent && (
                  <div>
                    <PostContent
                      {...p.parent}
                      likedByMe={idsLikedByMe.includes(p?.parent?._id)}
                    />
                    <div className="relative h-8">
                      <div className="absolute border-l-2 border-twitterBorder h-11 -top-5 ml-6"></div>
                    </div>
                  </div>
                )}

                <PostContent {...p} likedByMe={idsLikedByMe.includes(p?._id)} />
              </div>
            );
          })}
      </div>
      <div className="p-5 text-center border-t border-twitterBorder">
        {userInfo && (
          <button
            onClick={logOut}
            className="bg-twitterWhite text-black rounded-full px-5 py-1"
          >
            Logout
          </button>
        )}
      </div>
    </Layout>
  );
}
