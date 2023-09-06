import PostContent from "@/components/PostContent";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import useUserInfo from "@/hooks/useUserInfo";
import PostForm from "@/components/PostForm";
import TopNavLink from "@/components/TopNavLink";

export default function PostPage() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState();
  const [replies, setReplies] = useState([]);
  const [repliesLikedByMe, setRepliesLikedByMe] = useState([]);
  const { userInfo } = useUserInfo();

  async function fetchData() {
    await axios
      .get("/api/posts?id=" + id + "&userInfo =" + userInfo?._id)
      .then((response) => {
        setPost(response.data);
        console.log(response.data);
      });
    if (!userInfo) {
      return;
    }
    await axios
      .get("/api/posts?parent=" + id + "&userInfo=" + userInfo?._id)
      .then((response) => {
        setReplies(response.data.posts);
        setRepliesLikedByMe(response.data.idsLikedByMe);
      });
  }
  useEffect(() => {
    if (!id) {
      return;
    }
    fetchData();
  }, [id, userInfo]);

  return (
    <Layout>
      {!!post?._id && (
        <div className="px-5 py-2">
          <TopNavLink />
          {post.parent && (
            <div className="pb-1">
              <PostContent {...post.parent} />
              <div className="ml-5 h-12 relative">
                <div
                  className="h-20 border-l-2 border-twitterBorder absolute -top-5"
                  style={{ marginLeft: "2px" }}
                ></div>
              </div>
            </div>
          )}
          <div>
            <PostContent {...post} big={true} />
          </div>
        </div>
      )}
      {!!userInfo && (
        <div className="border-t border-twitterBorder p-5">
          <PostForm
            onPost={fetchData}
            compact
            parent={id}
            placeholder={"Tweet your reply"}
          />
        </div>
      )}
      <div>
        {replies.length > 0 &&
          replies.map((reply) => {
            return (
              <div className="p-5 border-t border-twitterBorder" key={reply}>
                <PostContent
                  {...reply}
                  likedByMe={repliesLikedByMe.includes(reply._id)}
                />
              </div>
            );
          })}
      </div>
    </Layout>
  );
}
