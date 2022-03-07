import React from "react";
import "./Post.css";
import { gql, useMutation } from "@apollo/client";

const PUBLISH_POST = gql`
  mutation PublishPost($postId: ID!, $published: Boolean!) {
  postPublish(postId: $postId, published: $published) {
    userErrors {
      message
    }
    post {
      title
    }
  }
}
`

export default function Post({
  title,
  content,
  date,
  user,
  published,
  id,
  isMyProfile,
}) {
  const [publishPost, { data, loading }] = useMutation(PUBLISH_POST)
  let formatedDate = new Date(Number(date));

  return (
    <div
      className="Post"
      style={published === false ? { backgroundColor: "hotpink" } : {}}
    >
      {isMyProfile && published === false && (
        <p className="Post__publish" onClick={() => {
          publishPost({
            variables: {
              postId: id,
              published: !published
            }
          })
        }}>
          publish
        </p>
      )}
      {isMyProfile && published === true && (
        <p className="Post__publish" onClick={() => {
          publishPost({
            variables: {
              postId: id,
              published: !published
            }
          })
        }}>
          unpublish
        </p>
      )}
      <div className="Post__header-container">
        <h2>{title}</h2>
        <h4>
        Created At {`${formatedDate}`.split(" ").splice(0, 3).join(" ")} by{" "} {user}
        </h4>
      </div>
      <p>{content}</p>
    </div>
  );
}