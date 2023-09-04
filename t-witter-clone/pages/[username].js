import Avatar from "@/components/Avatar";
import Layout from "@/components/Layout";
import TopNavLink from "@/components/TopNavLink";
import Cover from "@/components/Cover";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PostContent from "@/components/PostContent";
import useUserInfo from "@/hooks/useUserInfo";

export default function UserPage() {
  const { userInfo, status: userInfoStatus } = useUserInfo();
  const router = useRouter();
  const { username } = router.query;
  const [profileInfo, setProfileInfo] = useState();
  const [posts, setPosts] = useState([]);
  const [postsLikedByMe, setPostsLikedByMe] = useState([]);
  const [editMode, setEditMode] = useState(false);

  async function fetchProfile() {
    await axios.get("/api/users?username=" + username).then((response) => {
      setProfileInfo(response.data.user);
    });
  }
  async function fetchProfilePosts() {
    await axios
      .get("/api/posts?author=" + profileInfo?._id + "AND" + userInfo?._id)
      .then((response) => {
        setPosts(response.data.posts);
        setPostsLikedByMe(response.data.idsLikedByMe);
      });
  }

  useEffect(() => {
    if (!username) {
      return;
    }
    fetchProfile();
  }, [username]);

  useEffect(() => {
    if (!profileInfo?._id) {
      return;
    }
    if (userInfo && userInfoStatus != "loading") {
      fetchProfilePosts();
    }
  }, [userInfo || profileInfo]);

  function updateUserImage(type, src) {
    setProfileInfo((prev) => ({ ...prev, [type]: src }));
  }
  //edit Button
  const myProfile = profileInfo?._id === userInfo?._id;

  return (
    <Layout>
      {!!profileInfo && (
        <div>
          <div className="px-5 pt-2">
            <TopNavLink title={profileInfo?.name} />
          </div>
          <Cover
            src={profileInfo?.cover}
            onChange={(src) => updateUserImage("cover", src)}
            editable={true}
          />
          <div className="flex justify-between">
            <div className="ml-5 relative">
              <div className="absolute border-4 border-black rounded-full -top-12 overflow-hidden">
                <Avatar
                  big
                  src={profileInfo?.image}
                  editable={true}
                  onChange={(src) => updateUserImage("image", src)}
                />
              </div>
            </div>
            <div className="p-2">
              {!myProfile && (
                <button className="bg-twitterBlue text-white py-2 px-5 rounded-full">
                  Follow
                </button>
              )}
              {myProfile && (
                <div>
                  <button
                    onClick={() => {
                      setEditMode(true);
                    }}
                    className="bg-twitterBlue text-white py-2 px-5 rounded-full"
                  >
                    Edit Button
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="px-5 mt-2">
            <h1 className="font-bold text-xl leading-5">{profileInfo?.name}</h1>
            <h2 className="text-twitterLightGray text-sm">
              @{profileInfo?.username}
            </h2>
            <div className="text-sm mt-2 mb-2">Mars & Cars, Chips & Dips</div>
          </div>
        </div>
      )}
      {posts?.length > 0 &&
        posts.map((post) => {
          return (
            <div className="p-5 border-t border-twitterBorder" key={post._id}>
              <PostContent
                {...post}
                likedByMe={postsLikedByMe.includes(post._id)}
              />
            </div>
          );
        })}
    </Layout>
  );
}
