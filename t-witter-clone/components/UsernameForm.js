import useUserInfo from "../hooks/useUserInfo";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function UsernameForm() {
  const router = useRouter();
  const { userInfo, status } = useUserInfo();
  const [username, setUserName] = useState("");
  const { data } = useSession();

  useEffect(() => {
    if (status === "loading") {
      return;
    }
    if (username === "") {
      const defaultUseranme = userInfo?.email?.split("@")[0];
      setUserName(defaultUseranme.replace(/[^a-z]+/gi, ""));
    }
  }, [status]);

  async function handleFormSubmit(e) {
    const { user } = data;
    e.preventDefault();
    fetch("/api/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, user }),
    });
    router.reload();
  }

  if (status === "loading") {
    return "";
  }
  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleFormSubmit} className="text-center">
        <h1 className="text-xl mb-2">Pick a username</h1>
        <input
          type="text"
          className="block mb-1 bg-twitterBorder px-3 py-1 rounded-full"
          placeholder={"username"}
          value={username}
          onChange={(e) => {
            setUserName(e.target.value);
          }}
        ></input>
        <button className="block bg-twitterBlue w-full rounded-full py-1">
          Continue
        </button>
      </form>
    </div>
  );
}
