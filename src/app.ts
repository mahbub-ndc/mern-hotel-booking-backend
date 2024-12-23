import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./app/routes/route";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: "https://hotel-booking-brown-eight.vercel.app",

  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use("/api/v1/", router);

app.get("/", (req, res) => {
  res.send("Hello world from express!");
});

export default app;
