import { createError } from "../error.js";
import Video from "../models/Video.js";
import User from "../models/User.js";

export const addVideo = async (req, res, next) => {
  const newVideo = new Video({ userId: req.user.id, ...req.body });
  try {
    console.log(newVideo);
    const video = await newVideo.save();
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

export const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (video.userId === req.user.id) {
      const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedVideo);
    } else {
      return next(createError(403, "You can only update your video!"));
    }
  } catch (err) {
    next(err);
  }
};
export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (video.userId === req.user.id) {
      const updatedVideo = await Video.findByIdAndDelete(req.params.id);
      res.status(200).json("The Video has been deleted.");
    } else {
      return next(createError(403, "You can delete only your video!"));
    }
  } catch (err) {
    next(err);
  }
};
export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

export const addView = async (req, res, next) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.status(200).json("The View has been increased.");
  } catch (err) {
    next(err);
  }
};

export const random = async (req, res, next) => {
  try {
    // MongoDB function to randomly take given size videos from the given Video model.
    const videos = await Video.aggregate([{ $sample: { size: 3 } }]);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const trend = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 });
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const getByTags = async (req, res, next) => {
  /* localhost:8800/api/videos/tags?tags=js,py,csharp
   * It will return it as a plain string with commas
   * Now the chained split method will convert the values into array based on comma
   */
  const tags = req.query.tags.split(",");
  console.log(tags);
  try {
    // $in will loop in the array and find if the element is in array or not
    // limit() method will limit the returned videos
    const videos = await Video.find({ tags: { $in: tags } }).limit(20);
    videos.sort((a, b) => b.createdAt - a.createdAt);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};
export const search = async (req, res, next) => {
  try {
    const query = req.query.q;
    // $options i means lower or uppercase doesn't matter
    const videos = await Video.find({
      title: { $regex: query, $options: "i" },
    });
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const sub = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const subscribedChannels = user.subscribedUsers;

    // Using promise because finding all the videos of the subscribed users
    const list = await Promise.all(
      subscribedChannels.map(async (channelId) => {
        return Video.find({ userId: channelId });
      })
    );
    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    next(err);
  }
};
