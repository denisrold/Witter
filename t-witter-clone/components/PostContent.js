import Link from "next/link";
import Avatar from "./Avatar";
import ReactTimeAgo from "react-time-ago";
import PostButtons from "./PostButtons";
import { useState, useEffect } from "react";
import axios from "axios";

export default function PostContent({
  text,
  author,
  createdAt,
  _id,
  likesCount,
  likedByMe,
  commentsCount,
  images,
  big = false,
}) {
  const [idsLikedByMe, setIdsLikeByMe] = useState("");
  const [likePost, setLikePost] = useState(false);
  const [flag, setFlag] = useState("no");
  function showImages() {
    if (!images?.length) {
      return;
    }
    return (
      <div className="flex -mx-2">
        {images.length > 0 &&
          images.map((img) => {
            return (
              <div className="m-1" key={img}>
                <img src={img} alt="" />
              </div>
            );
          })}
      </div>
    );
  }

  //Funcion de comparar likedpost con id post
  function LikedPost() {
    if (idsLikedByMe) {
      const id = _id;
      const response = idsLikedByMe?.includes(id);
      setLikePost(response);
      if (response == true) {
        setFlag("Ok");
      }
      console.log(likePost);
    }
  }
  async function fetchHomePost() {
    if (idsLikedByMe.length > 0) {
      return;
    }
    if (likePost == "true") {
      return;
    }
    const userId = localStorage.getItem("userId");
    await axios.get(`/api/posts?userId=${userId}`).then((response) => {
      setIdsLikeByMe(response.data.idsLikedByMe);
      LikedPost();
    });
  }
  //Fin de la funcion
  useEffect(() => {
    if (!_id || likePost == true) {
      return;
    }
    if (_id) {
      fetchHomePost();

      LikedPost();
    }
  }, [flag]);
  return (
    <div>
      <div className="flex w-full">
        <div>
          <Link href={"/" + author?.username}>
            <div>
              <Avatar src={author?.image} />
            </div>
          </Link>
        </div>
        <div className="pl-2 grow">
          <div>
            <Link href={"/" + author?.username}>
              <span className="pr-1 font-bold">{author?.name}</span>
            </Link>
            {big && <br />}
            <Link href={"/" + author?.username}>
              <span className=" text-twitterLightGray">
                @{author?.username}
              </span>
            </Link>
            {createdAt && !big && (
              <span className="pl-1 text-twitterLightGray">
                <ReactTimeAgo
                  date={Date.parse(createdAt)}
                  timeStyle={"twitter"}
                />
              </span>
            )}
          </div>
          {!big && (
            <div>
              <Link href={`/${author?.username}/status/${_id}`}>
                <div>
                  {text}
                  {showImages()}
                </div>
              </Link>
              <PostButtons
                username={author?.username}
                id={_id}
                likesCounts={likesCount}
                likedByMe={likedByMe}
                commentsCount={commentsCount}
              />
            </div>
          )}
        </div>
      </div>
      {big && (
        <div className="mt-2">
          <Link href={`/${author?.username}/status/${_id}`}>
            <div className="w-full">
              <div>
                {text}
                {showImages()}
              </div>
            </div>
          </Link>
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
          {/*A Solucionar Este  */}
          estoyAca {console.log({ esteId: _id })}
          {console.log({ EstoyProbandoEste: idsLikedByMe.includes(_id) })}
          {console.log({ EstePost: likePost })}
          {console.log({ EsteArray: idsLikedByMe })}
          {console.log({ likedyme: likedByMe })}
          <PostButtons
            username={author?.username}
            id={_id}
            likesCounts={likesCount}
            likedByMe={true} //este Lograr conseguir el id del post y comparar con el ids de idslikebyme
            commentsCount={commentsCount}
          />
        </div>
      )}
    </div>
  );
}
