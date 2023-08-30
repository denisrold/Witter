import Link from "next/link";
import Avatar from "./Avatar";
import ReactTimeAgo from "react-time-ago";

export default function PostContent({
  text,
  author,
  createdAt,
  _id,
  big = false,
}) {
  const createdAtDate = new Date(createdAt);
  return (
    <div>
      <div className="flex">
        <div>
          <Avatar src={author?.image} />
        </div>
        <div className="pl-2">
          <div>
            <span className="pr-1 font-bold">{author?.name}</span>
            {big && <br />}
            <span className=" text-twitterLightGray">@{author?.username}</span>
            {createdAt && !big && (
              <span className="pl-1 text-twitterLightGray">
                <ReactTimeAgo date={createdAt} timeStyle={"twitter"} />
              </span>
            )}
          </div>
          {!big && (
            <div>
              <Link href={`/${author?.username}/status/${_id}`}>{text}</Link>
            </div>
          )}
        </div>
      </div>
      {big && (
        <div className="mt-2">
          <Link href={`/${author?.username}/status/${_id}`}>{text}</Link>
          {createdAt && (
            <div className="text-twitterLightGray text-sm">
              {new Date(createdAt)
                .toISOString()
                .replace("T", " ")
                .slice(0, 16)
                .split(" ")
                .reverse()
                .join(" ")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
