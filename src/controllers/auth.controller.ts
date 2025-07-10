import { Request, Response } from "express";

import { googleOAuth } from "../services/googlOAuth";
import { createUserWithFormData } from "../utils/createUserWithFormData";
import { User } from "../models/user.model";
import { comparePassword, hashPassword } from "../utils/hashPassword";
import { generateToken } from "../utils/jsonWebTokenGenrate";
export const manualSignup = async (req: Request, res: Response) => {
  const { email, password, name, username } = req.body;
   console.log("body",req.body)
  if (!email || !password || !name || !username) {
    return res
      .status(400)
      .json({ message: "Name, email and password are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await hashPassword(password);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    provider: "manual",
    profileCompleted: false,
    username,
  });

  await newUser.save();
     const user = {
      email:newUser.email,
      name:newUser.name,
      id:newUser._id 
     }
  const token = generateToken({ id: newUser._id, email: newUser.email });
    console.log("token",token)
  res.status(201).json({
    message: "Signup successful",
    token,
    profileCompleted: false,
    user
  });
};

// export const googleSignup = async (req: Request, res: Response) => {
//   try {
//     const googleData:any = await googleOAuth(req, res);
//     if (!googleData) return;
//     console.log("googleData", googleData);
//     const existingUser:any = await User.findOne({ email: googleData.email });

//     if (existingUser) {
//       // if user already exists, login karwa de
//       const token = generateToken({
//         id: existingUser._id,
//         email: existingUser.email,
//         profileCompleted: existingUser.profileCompleted,
//       });
//       return res.status(200).json({
//         message: "Login successful",
//         token,
//         profileCompleted: existingUser.profileCompleted,
//       });
//     }

//     const newUser = new User({
//       name: googleData.name,
//       email: googleData.email,
//       username: googleData.name,
//       avatar: googleData.picture,
//       provider: "google",
//       providerId: googleData.sub,
//       profileCompleted: false,
//     });

//     await newUser.save();

//     const token = generateToken({ id: newUser._id, email: newUser.email });

//     res.status(201).json({
//       message: "Google signup successful",
//       token,
//       profileCompleted: false,
//     });
//   } catch (error) {
//     console.error("Google signup error:", error);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };

export const googleLoginOrSignup = async (req: Request, res: Response) => {
  try {
    const googleData: any = await googleOAuth(req, res);
    if (!googleData) return;

    // ✅ check existing user
    const existingUser: any = await User.findOne({ email: googleData.email });

    if (existingUser) {
      const token = generateToken({
        id: existingUser._id,
        email: existingUser.email,
        profileCompleted: existingUser.profileCompleted,
      });

      const user = {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        avatar: existingUser.avatar,
      };

      return res.status(200).json({
        message: "Login successful",
        token,
        profileCompleted: existingUser.profileCompleted,
        user,
      });
    }

    // ✅ if user doesn't exist — create one
    const newUser = new User({
      name: googleData.name,
      email: googleData.email,
      username: googleData.name,
      avatar: googleData.picture,
      provider: "google",
      providerId: googleData.sub,
      profileCompleted: false,
    });

    await newUser.save();

    const token = generateToken({
      id: newUser._id,
      email: newUser.email,
    });

    const user = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
    };

    res.status(201).json({
      message: "Google signup successful",
      token,
      profileCompleted: false,
      user,
    });
  } catch (error) {
    console.error("Google login/signup error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // ✅ Check email exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Account not found. Please signup.",
      });
    }

    // ✅ Password match (only for manual users)
    if (user.provider === "manual") {
      const isMatch = comparePassword(password, user.password!);
      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid credentials.",
        });
      }
    } else {
      // ✅ Google users can't login manually
      return res.status(400).json({
        message: "This email is registered with Google. Please login via Google.",
      });
    }

    // ✅ JWT generate
    const token = generateToken({
      id: user._id,
      email: user.email,
      profileCompleted: user.profileCompleted,
    });

    // ✅ Response
    res.status(200).json({
      message: "Login successful",
      token,
      profileCompleted: user.profileCompleted,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
