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
  const [originalUserInfo, setOriginalUserInfo] = useState();
  const [posts, setPosts] = useState([]);
  const [postsLikedByMe, setPostsLikedByMe] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [isFollowing, setIsfollowing] = useState(false);

  async function fetchProfile() {
    await axios
      .get("/api/users?username=" + username + "&userInfo=" + userInfo?._id)
      .then((response) => {
        setProfileInfo(response.data.user);
        setOriginalUserInfo(response.data.user);
        setIsfollowing(!!response.data.follow);
      });
  }
  async function fetchProfilePosts() {
    await axios
      .get(
        "/api/posts?author=" + profileInfo?._id + "&userInfo=" + userInfo?._id
      )
      .then((response) => {
        setPosts(response.data.posts);
        setPostsLikedByMe(response.data.idsLikedByMe);
      });
  }

  useEffect(() => {
    if (userInfoStatus == "loading") {
      return;
    }
    if (!username && !userInfo) {
      return;
    }
    if (userInfo && userInfoStatus != "loading") {
      fetchProfile();
    }
  }, [userInfoStatus]);

  useEffect(() => {
    if (!profileInfo?._id) {
      return;
    }
    if (userInfo && userInfoStatus != "loading") {
      fetchProfilePosts();
    }
  }, [profileInfo]);

  function updateUserImage(type, src) {
    setProfileInfo((prev) => ({ ...prev, [type]: src }));
  }
  //save profile
  async function updateProfile() {
    const { bio, name, username } = profileInfo;
    const userId = userInfo?._id;

    await axios.put("/api/profile", {
      bio,
      name,
      username,
      userId,
    });
    setEditMode(false);
  }
  //cancel editProfile
  function cancel() {
    setProfileInfo((prev) => {
      const { name, username } = originalUserInfo;
      let bio = "";
      if (originalUserInfo.bio) {
        bio = originalUserInfo.bio;
      }
      return { ...prev, bio, name, username };
    });
    setEditMode(false);
  }

  function toggleFollow() {
    const userId = userInfo?._id;
    setIsfollowing((prev) => !prev);
    axios.post("/api/followers", {
      destination: profileInfo._id,
      userId: userId,
    });
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
            editable={myProfile}
          />
          <div className="flex justify-between">
            <div className="ml-5 relative">
              <div className="absolute border-4 border-black rounded-full -top-12 overflow-hidden">
                <Avatar
                  big
                  src={profileInfo?.image}
                  editable={myProfile}
                  onChange={(src) => updateUserImage("image", src)}
                />
              </div>
            </div>
            <div className="p-2">
              {!myProfile && (
                <button
                  onClick={toggleFollow}
                  className={
                    (isFollowing
                      ? "bg-twitterWhite text-black "
                      : "bg-twitterBlue text-white ") +
                    " py-2 px-4 rounded-full"
                  }
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
              {myProfile && (
                <div>
                  {!editMode && (
                    <button
                      onClick={() => {
                        setEditMode(true);
                      }}
                      className="bg-twitterBlue text-white py-2 px-5 rounded-full"
                    >
                      Edit Button
                    </button>
                  )}
                  {editMode && (
                    <div>
                      {" "}
                      <button
                        onClick={() => {
                          cancel();
                        }}
                        className="bg-twitterWhite text-black py-2 px-5 rounded-full mr-2"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          updateProfile();
                        }}
                        className="bg-twitterBlue text-white py-2 px-5 rounded-full"
                      >
                        Save profile
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="px-5 mt-2">
            {!editMode && (
              <h1 className="font-bold text-xl leading-5">
                {profileInfo?.name}
              </h1>
            )}
            {editMode && (
              <div>
                <input
                  type="text"
                  value={profileInfo?.name}
                  onChange={(ev) => {
                    setProfileInfo((prev) => ({
                      ...prev,
                      name: ev.target.value,
                    }));
                  }}
                  className="bg-twitterBorder p-2 rounded-full mb-2"
                ></input>
              </div>
            )}
            {!editMode && (
              <h2 className="text-twitterLightGray text-sm">
                @{profileInfo?.username}
              </h2>
            )}
            {editMode && (
              <div>
                <input
                  type="text"
                  value={profileInfo?.username}
                  onChange={(ev) => {
                    setProfileInfo((prev) => ({
                      ...prev,
                      username: ev.target.value,
                    }));
                  }}
                  className="bg-twitterBorder p-2 rounded-full mb-2"
                ></input>
              </div>
            )}
            {!editMode && (
              <div className="text-sm mt-2 mb-2">{profileInfo?.bio}</div>
            )}
            {editMode && (
              <div>
                <textarea
                  type="text"
                  value={profileInfo?.bio}
                  onChange={(ev) => {
                    setProfileInfo((prev) => ({
                      ...prev,
                      bio: ev.target.value,
                    }));
                  }}
                  className="bg-twitterBorder p-2 rounded-2xl mb-2 w-full block"
                />
              </div>
            )}
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
