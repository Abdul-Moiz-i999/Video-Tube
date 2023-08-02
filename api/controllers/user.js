import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const test = (req, res) => res.json("This is working");

export const update = async (req, res, next) => {
  // user.id is the id that was assigned using the verifyToken middleware
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        // New true will give back the updated document
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  } else {
    next(createError(403, "You can only update your own user!"));
  }
};
export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Successfully deleted the user");
    } catch (err) {
      next(err);
    }
  } else {
    next(createError(403, "You can only delete your own user!"));
  }
};
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    user
      ? res.status(200).json(user)
      : next(createError(404, "User not Found in the database"));
  } catch (err) {
    console.log("Error is here");
    next(err);
  }
};
export const subscribe = async (req, res, next) => {
  try {
    console.log("first" + req.params.channelId);
    await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: { subscribedUsers: req.params.channelId },
      },
      { new: true }
    );
    await User.findByIdAndUpdate(req.params.channelId, {
      $inc: { subscribers: 1 },
    });
    res.status(200).json("Successfully Subscribed the user.");
    console.log("subs");
  } catch (err) {
    next(err);
  }
};
export const unsubscribe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { subscribedUsers: req.params.channelId },
    });
    await User.findByIdAndUpdate(req.params.channelId, {
      $inc: { subscribers: -1 },
    });
    res.status(200).json("Unsubscription Successful ");
  } catch (err) {
    next(err);
  }
};
export const like = async (req, res, next) => {
  const userId = req.user.id;
  const videoId = req.params.videoId;

  try {
    // await Video.findByIdAndUpdate(videoId, {
    //   $addToSet: { likes: userId },
    //   $pull: { dislikes: userId },
    // });
    const findVideo = await Video.findById(videoId);
    // Checking if the video already has the like, if it does just remove it otherwise add like and remove dislike if exists
    // $addToSet only push the id if it's not already present there
    findVideo.likes.includes(userId)
      ? await Video.findByIdAndUpdate(videoId, { $pull: { likes: userId } })
      : await Video.findByIdAndUpdate(videoId, {
          $addToSet: { likes: userId },
          $pull: { dislikes: userId },
        });
    res.status(200).json("The Video has been Liked!");
  } catch (err) {
    next(err);
  }
};
export const dislike = async (req, res, next) => {
  const userId = req.user.id;
  const videoId = req.params.videoId;

  try {
    //   await Video.findByIdAndUpdate(videoId, {
    //     $addToSet: { dislikes: userId },
    //     $pull: { likes: userId },
    //   });
    const findVideo = await Video.findById(videoId);
    // Checking if the video already has the like, if it does just remove it otherwise add like and remove dislike if exists
    // $addToSet only push the id if it's not already present there
    findVideo.dislikes.includes(userId)
      ? await Video.findByIdAndUpdate(videoId, { $pull: { dislikes: userId } })
      : await Video.findByIdAndUpdate(videoId, {
          $addToSet: { dislikes: userId },
          $pull: { likes: userId },
        });
    res.status(200).json("The Video has been disliked!");
  } catch (err) {
    next(err);
  }
};
