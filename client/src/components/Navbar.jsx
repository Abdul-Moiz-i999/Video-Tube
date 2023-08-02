import React, { useState } from "react";
import styled from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import Upload from "./Upload";

const Container = styled.div`
  background-color: ${({ theme }) => theme.bgLighter};
  height: 56px;
  position: sticky;
  top: 0;
`;

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: flex-end;
  padding: 0px 20px;
  position: relative;
`;
const Search = styled.div`
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 3px;
  color: ${({ theme }) => theme.text};
  display: flex;
  justify-content: space-between;
  padding: 5px;
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  width: 40%;
`;
const Input = styled.input`
  background-color: transparent;
  border: none;
  outline: none;
`;
const Button = styled.button`
  align-items: center;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  cursor: pointer;
  display: flex;
  gap: 5px;
  padding: 5px 15px;
`;

// This is the top sign in in the navbar
const User = styled.div`
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  font-weight: 500;
  gap: 10px; ;
`;

const Avatar = styled.img`
  background-color: #999;
  border-radius: 50%;
  height: 32px;
  width: 32px;
`;

function Navbar() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    // This will reload the page
    window.location.reload();
  };
  return (
    <>
      <Container>
        <Wrapper>
          <Search>
            <Input
              type="text"
              placeholder="Search"
              onChange={(e) => setQ(e.target.value)}
            />
            <SearchOutlinedIcon onClick={() => navigate(`/search?q=${q}`)} />
          </Search>

          {user ? (
            <User>
              <VideoCallOutlinedIcon
                className="logoutIcon"
                onClick={() => setOpen(!open)}
              />
              <Avatar src={user.img} />
              {user.name}
              <LogoutIcon onClick={handleLogout} className="logoutIcon" />
            </User>
          ) : (
            <Link to="signin" style={{ textDecoration: "none" }}>
              <Button>
                <AccountCircleOutlinedIcon />
                SIGN IN
              </Button>
            </Link>
          )}
        </Wrapper>
      </Container>
      {open && <Upload setOpen={setOpen} />}
    </>
  );
}

export default Navbar;
