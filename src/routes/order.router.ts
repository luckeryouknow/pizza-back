import express from "express"
import {OrderController} from "../controllers/order.controller";

const orderRouter = express.Router()

orderRouter.post('/', OrderController.createOrder)
orderRouter.get('/', OrderController.getAllOrders)
orderRouter.get('/user-orders', OrderController.getDefaultUserOrders)
orderRouter.get('/courier-orders', OrderController.getCourierOrders)
orderRouter.get('/admin-orders', OrderController.getAdminOrders)
orderRouter.put('/assign-order', OrderController.assignOrder)
orderRouter.put('/complete-order', OrderController.completeOrder)
orderRouter.put('/call-order', OrderController.callOrder)
orderRouter.put('/after-call', OrderController.afterCall)

export default orderRouter
