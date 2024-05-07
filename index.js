import {initializeApp,   } from 'firebase-admin/app';
import { getMessaging } from "firebase-admin/messaging";
import express, { json } from "express";
import cors from "cors";
import admin from "firebase-admin";
import serviceAccount  from './chave.json'assert { type: "json" };



const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

app.use(function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  next();
});

const appp = initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'jsmx-dev',
});

app.post("/send", function (req, res) {
  const {title, messageSend, tokens} = req.body
  
  const message = {
    notification: {
      title: title,
      body: messageSend
    },
    tokens: tokens,
  };
  
  getMessaging()
    .sendEachForMulticast(message)
    .then((response) => {
      res.status(200).json({
        message: "Successfully sent message",
        token: tokens,
      });
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      res.status(400);
      res.send(error);
      console.log("Error sending message:", error);
    });
  
  
});

app.listen(9000, function () {
  console.log("Server started on port 9000");
});