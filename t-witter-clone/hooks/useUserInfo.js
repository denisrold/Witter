import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function useUserInfo() {
  //catch de userId for get userName.
  const { data: session, status: sessionStatus } = useSession();

  const [userInfo, setUserInfo] = useState();
  const [status, setStatus] = useState("loading");

  function getUserInfo() {
    if (sessionStatus === "loading") {
      return;
    }

    fetch("/api/users?id=" + session.user.id).then((response) => {
      response.json().then((json) => {
        setUserInfo(json.user);
        setStatus("done");
      });
    });
  }
  //dependency status of session.
  useEffect(() => {
    getUserInfo();
  }, [sessionStatus]);

  return { userInfo, status };
}
