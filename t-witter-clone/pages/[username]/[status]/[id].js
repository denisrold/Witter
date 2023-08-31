import PostContent from "@/components/PostContent";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Link from "next/link";
import useUserInfo from "@/hooks/useUserInfo";
import PostForm from "@/components/PostForm";
export default function PostPage() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState();
  const { userInfo } = useUserInfo();

  async function getPost() {
    const post = await axios.get("/api/posts?id=" + id).then((response) => {
      setPost(response.data);
    });
  }
  useEffect(() => {
    if (!id) {
      return;
    }
    getPost();
  }, [id]);

  return (
    <Layout>
      {post && (
        <div className="px-5 py-2">
          <Link href="/">
            <div className="flex mb-5 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mr-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              Tweet
            </div>
          </Link>
          <PostContent {...post} big={true} />
        </div>
      )}
      {!!userInfo && (
        <div className="border-t border-twitterBorder p-5">
          <PostForm
            onPost={() => {}}
            compact
            parent={id}
            placeholder={"Tweet your reply"}
          />
        </div>
      )}
      <div>Repplies goes here</div>
    </Layout>
  );
}
