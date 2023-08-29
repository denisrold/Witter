import { useRouter } from "next/router";
export default function PostPage() {
  const router = useRouter();
  const { id } = router.query;

  return <div>{id}</div>;
}
