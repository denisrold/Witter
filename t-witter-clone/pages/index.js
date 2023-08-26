import { useSession } from "next-auth/react";
import { useEffect } from "react";
//catch de userId for get userName.

export default function Home() {
  const { data: session, status } = useSession();

  function getUserInfo() {
    if (status === "loading") {
      return;
    }
    fetch("/api/users?id=" + session.user.id);
  }

  useEffect(() => {
    getUserInfo();
  }, [status]);

  //dependency status of session.
  return <div className="flex items-center justify-center h-screen">Home</div>;
}
