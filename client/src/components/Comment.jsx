import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { format } from "timeago.js";

const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 30px 0px;
`;

const Avatar = styled.img`
  border-radius: 50%;
  height: 50px;
  width: 50px;
`;

const Details = styled.div`
  color: ${({ theme }) => theme.text};
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
`;
const Date = styled.span`
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
  font-weight: 400;
  margin-left: 5px;
`;
const Text = styled.span`
  font-size: 14px;
`;

function Comment({ comment }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const res = await axios.get(`/users/find/${comment.userId}`);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
  }, [comment.userId]);
  return (
    <Container>
      {/* <Avatar src="https://yt3.ggpht.com/ytc/AMLnZu_QV1t3XXEiLdRtk6NJjBtS-JoukILey2N6PUt0xI4=s68-c-k-c0x00ffffff-no-rj" /> */}
      <Avatar src={user.img} />
      <Details>
        <Name>
          {user.name} <Date>{format(comment.createdAt)}</Date>
        </Name>
        <Text>{comment.desc}</Text>
      </Details>
    </Container>
  );
}

export default Comment;
