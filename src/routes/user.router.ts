import express from "express";
import {UserController} from "../controllers/user.controller";

const userRouter = express.Router()

userRouter.post('/sign-in', UserController.signIn)
userRouter.post('/sign-up', UserController.signUp)
userRouter.get('/free-couriers', UserController.getFreeCouriers)

export default userRouter
