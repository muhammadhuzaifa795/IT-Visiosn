import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { promises as fs } from "fs";
import path from "path";
import { v4 as uuid } from "uuid";
import multer from "multer";
import faceapi from "@vladmandic/face-api/dist/face-api.node-wasm.js";
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-wasm';
import canvas from "canvas";
import cloudinary from "../lib/cloudinary.js";

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

await tf.setBackend('wasm');
await tf.ready();



await faceapi.nets.ssdMobilenetv1.loadFromDisk(path.join(process.cwd(), "model"));
await faceapi.nets.faceLandmark68Net.loadFromDisk(path.join(process.cwd(), "model"));
await faceapi.nets.faceRecognitionNet.loadFromDisk(path.join(process.cwd(), "model"));


const upload = multer({ storage: multer.memoryStorage() });

async function bufferToCvImage(b) { return canvas.loadImage(b); }

export async function addFace(req, res) {
  try {
    const { userId } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: "No image" });
    const img = await bufferToCvImage(req.file.buffer);
    const d = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    if (!d) return res.status(400).json({ success: false, message: "No face" });
    const dir = path.join("faces", userId);
    await fs.mkdir(dir, { recursive: true });
    const local = path.join(dir, `${uuid()}.jpg`);
    await fs.writeFile(local, req.file.buffer);
    const cld = await new Promise((res, rej) =>
      cloudinary.uploader.upload_stream({ folder: `faces/${userId}` }, (e, r) =>
        e ? rej(e) : res(r)
      ).end(req.file.buffer)
    );
    await User.findByIdAndUpdate(userId, {
      $push: { faces: { descriptor: [...d.descriptor], localPath: local, cloudinaryUrl: cld.secure_url, publicId: cld.public_id } }
    });
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false });
  }
}

export async function loginWithFace(req, res) {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No image" });

    const img = await bufferToCvImage(req.file.buffer);
    const d = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    if (!d) return res.status(400).json({ success: false, message: "No face" });

    const users = await User.find();
    let best = null, min = 0.6;

    for (const u of users) {
      for (const f of u.faces) {
        const dist = faceapi.euclideanDistance(d.descriptor, new Float32Array(f.descriptor));
        if (dist < min) {
          min = dist;
          best = u;
        }
      }
    }

    if (!best) return res.status(400).json({ success: false, message: "No match" });

    const token = jwt.sign({ userId: best._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    const user = await User.findById(best._id).select("-password");
    res.json({ success: true, user });
  } catch (e) {
    res.status(500).json({ success: false });
  }
}


export { upload };