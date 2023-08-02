import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import Comments from "../components/Comments";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { dislike, fetchStart, fetchSuccess, like } from "../redux/videoSlice";

import { subscription } from "../redux/userSlice";

import { format } from "timeago.js";
import Recommendations from "../components/Recommendations";

const Container = styled.div`
  display: flex;
  gap: 24px;
`;
const Content = styled.div`
  flex: 5;
`;

const VideoWrapper = styled.div``;
const Title = styled.h1`
  color: ${({ theme }) => theme.text};
  font-size: 18px;
  font-weight: 400;
  margin-bottom: 10px;
  margin-top: 20px;
`;
const Details = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;
const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;
const Buttons = styled.div`
  color: ${({ theme }) => theme.text};
  display: flex;
  gap: 20px;
`;
const Button = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  gap: 5px;
`;

const Hr = styled.hr`
  border: 1px solid ${({ theme }) => theme.soft};
  margin: 15px 0px;
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;
const ChannelImage = styled.img`
  border-radius: 50%;
  height: 50px;
  width: 50px;
`;
const ChannelDetails = styled.div`
  color: ${({ theme }) => theme.text};
  display: flex;
  flex-direction: column;
`;
const ChannelName = styled.span`
  font-weight: 500;
`;
const ChannelCounter = styled.span`
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
  margin-top: 5px;
  margin-bottom: 20px;
`;
const ChannelDescription = styled.p`
  font-size: 14px;
`;
const Subscribe = styled.button`
  background-color: #cc1a00;
  border: none;
  border-radius: 3px;
  color: white;
  cursor: pointer;
  font-weight: 500;
  height: max-content;
  padding: 10px 20px;
`;
const Unsubscribe = styled.button`
  background-color: gray;
  border: none;
  border-radius: 3px;
  color: white;
  cursor: pointer;
  font-weight: 500;
  height: max-content;
  padding: 10px 20px;
`;

const VideoFrame = styled.video`
  max-height: 720px;
  object-fit: cover;
  width: 100%;
`;

function Video() {
  const { video } = useSelector((state) => state.video);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  // It had two parts 1 index video and 2nd = video id
  const path = useLocation().pathname.split("/")[2];
  console.log("Path outside " + path);
  // Will not be able to use this video directly as it won't refresh immediately.
  // So, we will use videoSlice
  // const [video, setVideo] = useState({});
  const [channel, setChannel] = useState({});

  const handleLike = async () => {
    try {
      await axios.put("/users/like/" + video._id);
      dispatch(like(user._id));
    } catch (err) {
      console.log(err);
    }
  };
  const handleDislike = async () => {
    try {
      await axios.put("/users/dislike/" + video._id);
      dispatch(dislike(user._id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubscribe = async () => {
    try {
      await axios.put("/users/sub/" + channel._id);
      dispatch(subscription(channel._id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await axios.put("/users/unsub/" + channel._id);
      dispatch(subscription(channel._id));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log("inside useEffect");
    const fetchData = async () => {
      try {
        dispatch(fetchStart());
        const videoRes = await axios.get("/videos/find/" + path);
        const channelRes = await axios.get(
          "/users/find/" + videoRes.data.userId
        );

        // setVideo(videoRes.data);
        setChannel(channelRes.data);
        dispatch(fetchSuccess(videoRes.data));
      } catch (err) {
        console.log("error occured");
      }
    };
    fetchData();
  }, [path, dispatch]);

  return (
    <Container>
      <Content>
        <VideoWrapper>
          {/* <iframe
            width="100%"
            height="720"
            src="https://www.youtube.com/embed/k3Vfj-e1Ma4"
            title="YouTube Video Player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe> */}
          <VideoFrame src={video.videoUrl} controls />
        </VideoWrapper>
        <Title>{video.title}</Title>
        <Details>
          <Info>
            {video.views} views • {format(video.createdAt)}
          </Info>
          <Buttons>
            {/* Question mark as in the start video may not be loaded  */}
            <Button onClick={handleLike}>
              {video.likes?.includes(user._id) ? (
                <ThumbUpIcon />
              ) : (
                <ThumbUpOutlinedIcon />
              )}

              {video.likes?.length}
            </Button>
            <Button onClick={handleDislike}>
              {video.dislikes?.includes(user._id) ? (
                <ThumbDownIcon />
              ) : (
                <ThumbDownOffAltOutlinedIcon />
              )}

              {video.dislikes?.length}
            </Button>
            <Button>
              <ReplyOutlinedIcon /> Share
            </Button>
            <Button>
              <AddTaskOutlinedIcon /> Save
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <ChannelImage src={channel.img} />
            <ChannelDetails>
              <ChannelName>{channel.name}</ChannelName>
              <ChannelCounter>{channel.subscribers} subscribers</ChannelCounter>
              <ChannelDescription>{video.desc}</ChannelDescription>
            </ChannelDetails>
          </ChannelInfo>
          <div>
            {user.subscribedUsers?.includes(channel._id) ? (
              <Unsubscribe onClick={handleUnsubscribe}>UNSUBSCRIBE</Unsubscribe>
            ) : (
              <Subscribe onClick={handleSubscribe}>SUBSCRIBE</Subscribe>
            )}
          </div>
        </Channel>
        <Hr />
        <Comments videoId={video._id} />
      </Content>
      <Recommendations tags={video.tags} />
    </Container>
  );
}

export default Video;
