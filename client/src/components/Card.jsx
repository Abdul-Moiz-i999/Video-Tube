import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { format } from "timeago.js";

const Container = styled.div`
  cursor: pointer;
  display: ${({ type }) => type === "small" && "flex"};
  gap: 10px;
  margin-bottom: ${({ type }) => (type === "small" ? "10px" : "45px")};
  width: ${({ type }) => type !== "small" && "360px"};
`;

const Image = styled.img`
  background-color: #999;
  flex: 1;
  height: ${({ type }) => (type === "small" ? "120px" : "202px")};
  width: 100%;
`;

const Details = styled.div`
  display: flex;
  flex: 1;
  gap: 12px;
  margin-top: ${({ type }) => type !== "small" && "16px"};
`;

const ChannelImage = styled.img`
  background-color: #999;
  border-radius: 50%;
  height: 36px;
  width: 36px;
`;

const Texts = styled.div``;
const Title = styled.h1`
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  font-weight: 500;
`;
const ChannelName = styled.h2`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
  margin: 9px 0px;
`;
const Info = styled.div`
  color: ${({ theme }) => theme.textSoft};
  font-size: 14px;
`;

const Card = ({ type, video }) => {
  const [channel, setChannel] = useState({});
  useEffect(() => {
    const getChannel = async () => {
      const res = await axios.get(`/users/find/${video.userId}`);
      setChannel(res.data);
    };
    getChannel();
  }, [video.userId]);

  return (
    <Link
      to={`/video/${video._id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Container type={type}>
        <Image
          type={type}
          // src="https://i.ytimg.com/vi/A4tEVfQSa94/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDMgEpSdJfQWRwD0VydSJ8ZHqhQyg"
          src={video.imgUrl}
        />
        <Details type={type}>
          <ChannelImage
            style={{ display: type === "small" && "none" }}
            // src="https://yt3.ggpht.com/ytc/AMLnZu-XfgJarP2dR93bIN3WSRaKG2fBLOsSGwsf8HgOGA=s68-c-k-c0x00ffffff-no-rj"
            src={channel.img}
          />
          <Texts>
            <Title>{video.title}</Title>
            <ChannelName>{channel.name}</ChannelName>
            <Info>
              {video.views} views • {format(video.createdAt)}
            </Info>
          </Texts>
        </Details>
      </Container>
    </Link>
  );
};

export default Card;
