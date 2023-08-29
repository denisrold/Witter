import useUserInfo from "@/hooks/useUserInfo";

export default function PostForm() {
  const { userInfo } = useUserInfo();
  return (
    <form className="mx-4">
      <div className="flex">
        <div>
          <div className="rounded-full overflow-hidden w-12">
            <img src={userInfo?.image} alt="avatar" />
          </div>
        </div>
        <div className="grow pl-2">
          <textarea
            className="w-full p-2 bg-transparent text-twitterWhite"
            placeholder={"What's happening?"}
          />
          <div className="text-right border-t border-twitterBorder pt-2">
            <button className="bg-twitterBlue text-white px-5 py-2 rounded-full">
              tweet
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
