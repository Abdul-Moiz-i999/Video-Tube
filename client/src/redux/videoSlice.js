import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  video: {},
  // video: {
  //   _id: "63b429e0718dc186fd36e0be",
  //   userId: "63b3f8dc68d5a73b912519f3",
  //   title: "Video No 3 from 3rd user",
  //   desc: "test Desc",
  //   imgUrl: "test",
  //   videoUrl: "test",
  //   tags: ["js", "c"],
  //   likes: [],
  //   dislikes: [],
  //   views: 49,
  //   createdAt: "2023-01-03T13:13:04.807Z",
  //   updatedAt: "2023-01-03T13:13:04.807Z",
  //   __v: 0,
  // },
  loading: false,
  error: false,
};

export const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
    },
    fetchSuccess: (state, action) => {
      state.loading = false;
      state.video = action.payload;
    },
    fetchFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    like: (state, action) => {
      // If video is already liked just remove the like
      if (state.video.likes.includes(action.payload)) {
        // Using splice method to remove the element from the array.
        // inside findIndex to find the index of the userId
        state.video.likes.splice(
          state.video.dislikes.findIndex((userId) => userId === action.payload)
        );
      }
      // If video is not liked, like it and remove dislike from dislike array if exists
      else {
        state.video.likes.push(action.payload);
        state.video.dislikes.splice(
          state.video.dislikes.findIndex((userId) => userId === action.payload),
          1
        );
      }
    },

    dislike: (state, action) => {
      // If video is already disliked just remove the dislike
      if (state.video.dislikes.includes(action.payload)) {
        // Using splice method to remove the element from the array.
        // inside findIndex to find the index of the userId
        state.video.dislikes.splice(
          state.video.dislikes.findIndex((userId) => userId === action.payload)
        );
      }
      // If not disliked, dislike it and remove the like if exists
      else {
        state.video.dislikes.push(action.payload);
        state.video.likes.splice(
          state.video.likes.findIndex((userId) => userId === action.payload),
          1
        );
      }
    },
  },
});

export const { fetchStart, fetchSuccess, fetchFailure, like, dislike } =
  videoSlice.actions;
export default videoSlice.reducer;
