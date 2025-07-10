import jwt from "jsonwebtoken";

export const generateToken =  (payload: object) => {
  
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }
  
  if (!process.env.JWT_EXPIRES_IN) {
    throw new Error("JWT_EXPIRES_IN is not defined in environment variables.");
  }
  
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1d", // ya "7d", "12h" — tune jitna rakhna ho
  });
  return token;
};
export const TokenVerify = async (token: string)=> {
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  // return decoded as NewUser;
}