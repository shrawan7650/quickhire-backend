import express from "express";
import {
  createUser,
  // getUsers,
  // getUserById,
  // updateUser,
  // deleteUser,
} from "../controllers/user.controller";
import { upload } from "../utils/multerStorage";
// import upload from "../utils/multerStorage";

const router = express.Router();

router.post(
  "/signup",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "resumeFile", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  createUser
);
// router.get('/', getUsers);
// router.get('/:id', getUserById);
// router.put('/:id', updateUser);
// router.delete('/:id', deleteUser);

export default router;
