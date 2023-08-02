import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  color: ${({ theme }) => theme.text};
  height: calc(100vh - 56px);
`;
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.softHr};
  gap: 10px;
  padding: 20px 50px;
`;
const Title = styled.h1`
  font-size: 24px;
`;
const SubTitle = styled.h2`
  font-size: 20px;
  font-weight: 300;
`;
const Input = styled.input`
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.softHr};
  border-radius: 3px;
  padding: 10px;
  width: 100%;
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
const More = styled.div`
  display: flex;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
  margin-top: 10px;
`;
const Links = styled.div`
  margin-left: 50px;
`;
const Link = styled.span`
  margin-left: 30px;
`;

const Signin = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const signInWithGoogle = () => {
    dispatch(loginStart());
    // This will give a popup that we will use to sign in with auth and provider
    signInWithPopup(auth, provider)
      .then(async (result) => {
        await axios
          .post("/auth/google", {
            name: result.user.email.split("@")[0],
            email: result.user.email,
            img: result.user.photoURL,
          })
          .then((res) => {
            dispatch(loginSuccess(res.data));
          });
      })
      .catch((err) => dispatch(loginFailure()));
  };

  // This method will handle the login i.e. Signin
  const handleLogin = async (e) => {
    // This method stops the auto refresh of the webpage.
    e.preventDefault();

    // Not passing anything as we don't have any data.
    dispatch(loginStart());
    try {
      const res = await axios.post("/auth/signin", { name, password });
      // console.log(res.data);
      dispatch(loginSuccess(res.data));
    } catch (err) {
      console.log(err);

      // Can pass the error as a payload and then can use it inside the failure as payload
      dispatch(loginFailure());
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>Sign in</Title>
        <SubTitle>to continue to LamaTube</SubTitle>
        <Input
          placeholder="username"
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleLogin}>Sign in</Button>
        <Title>or</Title>
        <Button onClick={signInWithGoogle}>Signin with Google</Button>
        <Title>or</Title>
        <Input
          placeholder="username"
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="email"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button>Sign up</Button>
      </Wrapper>
      <More>
        English (USA)
        <Links>
          <Link>Help</Link>
          <Link>Privacy</Link>
          <Link>Terms</Link>
        </Links>
      </More>
    </Container>
  );
};

export default Signin;
