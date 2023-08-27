import UsernameForm from "@/components/UsernameForm";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
//catch de userId for get userName.

export default function Home() {
  const { data: session, status } = useSession();
  const [userInfo, setUserInfo] = useState();
  const [userInfoStatus, setUserInfoStatus] = useState("loading");

  function getUserInfo() {
    if (status === "loading") {
      return;
    }
    fetch("/api/users?id=" + session.user.id).then((response) => {
      response.json().then((json) => {
        setUserInfo(json.user);
        setUserInfoStatus("done");
      });
    });
  }

  useEffect(() => {
    getUserInfo();
  }, [status]);

  if (userInfoStatus === "loading") {
    return "loading user info";
  }
  if (!userInfo.username) {
    return <UsernameForm />;
  }
  //dependency status of session.
  return <div className="flex items-center justify-center h-screen">Home</div>;
}
