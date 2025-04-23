const asyncHandler = require("express-async-handler");
const User = require("../models/user.js");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

// Multer Configuration (Inside Controller)
const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
      // Ensure req.body is available
      const uniqueName = req.body.id + path.extname(file.originalname);
      cb(null, uniqueName);
    },
  }),
}).single("photo");

const post = asyncHandler(async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      // Check if user with the same ID already exists
      const existingUser = await User.findOne({ id: req.body.id });
      if (existingUser) {
        // Delete the uploaded file since ID is duplicate
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting file:", unlinkErr);
          }
        });

        return res
          .status(400)
          .json({ error: "Duplicate ID found. Choose a different ID." });
      }

      // Create new user with image path
      const user = new User({
        id: req.body.id,
        photo: req.file.path,
      });

      //Renaming the file to the ID
      const newFilePath = path.join(
        "uploads",
        `${req.body.id}${path.extname(req.file.originalname)}`
      );
      fs.rename(req.file.path, newFilePath, (renameErr) => {
        if (renameErr) {
          console.error("Error renaming file:", renameErr);
          return res.status(500).json({ error: "Error renaming file" });
        }
      });

      await user.save();
      res.status(201).json({ message: "Image uploaded successfully", user });
    } catch (error) {
      // If an error occurs, delete the uploaded file
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting file:", unlinkErr);
        }
      });

      res.status(500).json({ error: error.message });
    }
  });
});

const getimage = asyncHandler(async (req, res) => {
  try {
    const { token } = req.params;

    const userData = await User.findOne({ id: token });
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const finalData = {
      user: userData,
      imageUrl: `https://${req.get("host")}/uploads/${userData.id}.${userData.photo.split(".").pop()}`,
    };

    res.status(200).json(finalData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const approval = asyncHandler(async (req, res) => {
  try {
    const { token } = req.params;

    const userData = await User.findOne({ id: token });
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    userData.approved = true;
    await userData.save();

    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const allUsers = await User.find({});
    if(!allUsers) {
      return res.status(204).json({"data":null})
    }

    return res.status(200).json({"data":allUsers})
  } catch (error) {
    console.log(error)
  }
})

module.exports = { post, getimage, approval, getAllUsers };
