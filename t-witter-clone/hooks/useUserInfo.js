import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function useUserInfo() {
  //catch de userId for get userName.
  const [userInfo, setUserInfo] = useState();
  const { data: session, status: sessionStatus } = useSession();
  const [status, setStatus] = useState("loading");

  function getUserInfo() {
    if (sessionStatus === "loading") {
      return;
    }
    if (!session?.user?.id) {
      setStatus("unauthenticated");
      return;
    }
    fetch("/api/users?id=" + session?.user?.id).then((response) => {
      response.json().then((json) => {
        setUserInfo(json.user);
        setStatus("authenticted");
      });
    });
  }
  //dependency status of session.
  useEffect(() => {
    getUserInfo();
  }, [sessionStatus]);

  return { userInfo, setUserInfo, status };
}
