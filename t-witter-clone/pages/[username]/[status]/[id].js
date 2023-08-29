import PostContent from "@/components/PostContent";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
export default function PostPage() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState();

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

  return <div>{post && <PostContent {...post} />}</div>;
}
