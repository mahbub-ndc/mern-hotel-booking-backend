import express from "express";
import { Test } from "./test.model";
const router = express.Router();
import { cloudinaryImageUpload, upload } from "../utils/cloudinaryImageUpload";

router.post("/create-test", upload.single("file"), async (req, res) => {
  try {
    console.log(req.file);

    req.body = JSON.parse(req.body.data);
    console.log(req.body);

    const { name, email, password } = req.body;

    const path = req.file?.path;
    const imageName = `${Date.now()}-${name}`;

    const result = await cloudinaryImageUpload(path, imageName);
    const imageUrl = (result as { secure_url: string }).secure_url;

    const newTest = new Test({
      name,
      email,
      password,
      imageUrl,
    });
    await newTest.save();
    res.status(201).json(newTest);
  } catch (error) {
    res.status(500).json({ error: "Failed to create test" });
  }
});
export const TestRoute = router;
