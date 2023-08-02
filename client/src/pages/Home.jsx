import React, { useEffect, useState } from "react";
import axios from "axios";

import styled from "styled-components";
import Card from "../components/Card";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const Home = ({ type }) => {
  const [videos, setVideos] = useState([]);

  // Reload videos on page reload
  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get("/videos/" + type);
      setVideos(res.data);
    };
    fetchVideos();
  }, [type]);
  return (
    <Container>
      {videos.map((video, index) => {
        return <Card key={video._id} video={video} />;
      })}
    </Container>
  );
};
