import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase";
import { async } from "@firebase/util";

const Container = styled.div`
  align-items: center;
  display: flex;
  background-color: #000000a7;
  justify-content: center;
  height: 100%;
  width: 100%;
  position: absolute;
  /* Gonna start from top left  */
  top: 0;
  left: 0;
`;
const Wrapper = styled.div`
  display: flex;
  /* Will be black on white and white on black theme  */
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  position: relative;
  height: 600px;
  width: 600px;
`;
const Close = styled.div`
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
`;
const Title = styled.h1`
  text-align: center;
`;
const Input = styled.input`
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.textSoft};
  border-radius: 3px;
  color: ${({ theme }) => theme.text};
  padding: 10px;
`;
const Desc = styled.textarea`
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.textSoft};
  border-radius: 3px;
  color: ${({ theme }) => theme.text};
  padding: 10px;
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.softHr};
  border: none;
  border-radius: 3px;
  color: ${({ theme }) => theme.textSoft};
  cursor: pointer;
  font-weight: 500;
  padding: 10px 20px;
`;

const Label = styled.label`
  font-size: 14px;
`;

const Upload = ({ setOpen }) => {
  const [img, setImg] = useState(null);
  const [video, setVideo] = useState(null);
  const [videoPerc, setVideoPerc] = useState(0);
  const [imgPerc, setImgPerc] = useState(0);

  const navigate = useNavigate();
  // It will include our video title, desc, its url and for pics as well
  const [inputs, setInputs] = useState({});

  // const [title, setTitle] = useState("");
  // const [desc, setDesc] = useState("");
  const [tags, setTags] = useState([]);

  // ** Change this later on remove return try
  const handleInputs = (e) => {
    setInputs((prev) => {
      // target.name could be like description and value will be value
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const uploadFile = (file, urlType) => {
    const storage = getStorage(app);
    // Creating a unique file name to avoid conflicts in names
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, file);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(urlType);
        urlType === "imgUrl" ? setImgPerc(progress) : setVideoPerc(progress);
        // console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (err) => {
        console.log(err);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // console.log("File available at", downloadURL);
          setInputs((prev) => {
            return { ...prev, [urlType]: downloadURL };
          });
        });
      }
    );
  };
  useEffect(() => {
    video && uploadFile(video, "videoUrl");
  }, [video]);
  useEffect(() => {
    img && uploadFile(img, "imgUrl");
  }, [img]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/videos", { ...inputs, tags });
      setOpen(false);
      res.status === 200 && navigate(`/video/${res.data._id}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container>
      {/* Container will be full screen and wrapper will be small  */}
      <Wrapper>
        <Close onClick={() => setOpen(false)}>X</Close>
        <Title>Upload a New Video</Title>
        <Label>Video:</Label>
        {/* here 0 index means only get the first file  */}
        {videoPerc > 0 ? (
          `Uploading ${videoPerc}`
        ) : (
          <Input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
          />
        )}
        <Input
          type="text"
          placeholder="Title"
          name="title"
          // onChange={(e) => setTitle(e.target.value)}
          onChange={handleInputs}
        />
        <Desc
          placeholder="Description"
          rows={8}
          name="desc"
          onChange={handleInputs}

          // onChange={(e) => setDesc(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Separate the tags with commas."
          //   Split the tags based on the comma
          onChange={(e) => e.target.value.split(",")}
        />
        <Label>Image:</Label>
        {imgPerc > 0 ? (
          `Uploading ${imgPerc}%`
        ) : (
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImg(e.target.files[0])}
          />
        )}
        <Button onClick={handleUpload}>Upload</Button>
      </Wrapper>
    </Container>
  );
};

export default Upload;
