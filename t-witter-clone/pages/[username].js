import Avatar from "@/components/Avatar";
import Layout from "@/components/Layout";
import TopNavLink from "@/components/TopNavLink";
import Cover from "@/components/cover";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function UserPage() {
  const router = useRouter();
  const { username } = router.query;
  const [profileInfo, setProfileInfo] = useState();

  useEffect(() => {
    if (!username) {
      return;
    }
    axios.get("/api/users?username=" + username).then((response) => {
      setProfileInfo(response.data.user);
    });
  }, [username]);

  return (
    <Layout>
      {!!profileInfo && (
        <div>
          <div className="px-5 pt-2">
            <TopNavLink title={profileInfo?.name} />
          </div>
          <Cover />
          <div className="flex justify-between">
            <div className="ml-5 relative">
              <div className="absolute border-4 border-black rounded-full -top-12">
                <Avatar big src={profileInfo?.image} />
              </div>
            </div>
            <div className="p-2">
              <button className="bg-twitterBlue text-white py-2 px-5 rounded-full">
                Follow
              </button>
            </div>
          </div>
          <div className="px-5 mt-2">
            <h1 className="">{profileInfo?.name}</h1>
            <h2 className="">@{profileInfo?.username}</h2>
          </div>
        </div>
      )}
    </Layout>
  );
}
