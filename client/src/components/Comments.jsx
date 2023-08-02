import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Comment from "./Comment";

const Container = styled.div``;
const NewComment = styled.div`
  align-items: center;
  display: flex;
`;
const Avatar = styled.img`
  border-radius: 50%;
  height: 50px;
  width: 50px;
`;
const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

function Comments({ videoId }) {
  const [comments, setComments] = useState([]);
  const { user: currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get("/comments/" + videoId);
        setComments(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchComments();
  }, [videoId]);
  return (
    <Container>
      <NewComment>
        {/* <Avatar src="https://yt3.ggpht.com/ytc/AMLnZu-XfgJarP2dR93bIN3WSRaKG2fBLOsSGwsf8HgOGA=s68-c-k-c0x00ffffff-no-rj" /> */}
        <Avatar src={currentUser.img} />
        <Input placeholder="Add a comment..." />
      </NewComment>
      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} />
      ))}
      {/* <Comment />
      <Comment />
      <Comment />
      <Comment />
      <Comment />
      <Comment />
      <Comment /> */}
    </Container>
  );
}

export default Comments;
