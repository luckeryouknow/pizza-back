import express from "express"
import {MenuController} from "../controllers/menu.controller";

const menuRouter = express.Router()

menuRouter.get('/', MenuController.getAllMenuItems)
menuRouter.post('/', MenuController.postMenuItem)

export default menuRouter
