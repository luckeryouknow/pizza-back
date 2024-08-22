import { prisma } from "../constants/constants";
import { Request, Response } from 'express';

export class OrderController {
  static async createOrder(req: Request, res: Response) {
    try {
      const { defaultUserId, items, name, phoneNumber } = req.body

      const order = await prisma.order.create({
        data: {
          defaultUserId,
          status: "PENDING",
          orderItems: {
            create: items.map((item: any) => (
              {
                menuItemId: item.menuItemId,
                quantity: Number(item.quantity),
              }
            ))
          },
          name,
          phoneNumber,
        }
      }).then(response => response)

      if (order) {
        return res.status(200).json(order)
      } else {
        return res.status(200).json({ message: "Order is not created" })
      }
    } catch(error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async getAllOrders(req: Request, res: Response) {
    try {
      const orders = await prisma.order.findMany()
        .then(response => response)

      if (orders.length) {
        return res.status(200).json(orders)
      } else {
        return res.status(200).json({ message: "No orders found" })
      }
    } catch(error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async getDefaultUserOrders(req: Request, res: Response) {
    const { defaultUserId } = req.body

    try {
      const orders = await prisma.order.findMany({
        where: {
          defaultUserId,
        }
      }).then(response => response)

      if (orders.length) {
        return res.status(200).json(orders)
      } else {
        return res.status(200).json({ message: "Orders not found" })
      }
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async getCourierOrders(req: Request, res: Response) {
    const { courierId } = req.query
    console.log(courierId)

    try {
      if (courierId) {
        const orders = await prisma.order.findMany({
          where: {
            AND: [
              { courierId: courierId as string },
              { status: "ASSIGNED" },
            ]
          },
          include: {
            orderItems: true,
          }
        }).then(response => response)

        const updatedOrders = await Promise.all(
          orders.map(async (order) => {
            const updatedOrderItems = await Promise.all(
              order.orderItems.map(async (item) => {
                const menuItem = await prisma.menuItem.findFirst({
                  where: {
                    id: item.menuItemId,
                  }
                })
                return menuItem
              })
            )

            return {
              ...order,
              orderItems: updatedOrderItems,
            }
          })
        )


        console.log(updatedOrders)

        if (orders.length) {
          return res.status(200).json(updatedOrders)
        } else {
          return res.status(200).json({ message: "Orders not found" })
        }
      }
    } catch(error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async getAdminOrders(req: Request, res: Response) {
    try {
      const orders = await prisma.order.findMany({
        where: {
          AND: [
            { courierId: null },
            { OR: [
                { status: "PENDING" },
                { status: "READY_TO_DELIVER" },
                { status: "IN_PROGRESS" },
            ] },
          ]
        },
        include: {
          orderItems: true,
        }
      }).then(result => result)
      const updatedOrders = await Promise.all(
        orders.map(async (order) => {
          const updatedOrderItems = await Promise.all(
            order.orderItems.map(async (item) => {
              const menuItem = await prisma.menuItem.findFirst({
                where: {
                  id: item.menuItemId,
                }
              })
              return menuItem
            })
          )

          return {
            ...order,
            orderItems: updatedOrderItems,
          }
        })
      )

      if (orders.length) {
        return res.status(200).json(updatedOrders)
      } else {
        return res.status(200).json({ message: "Orders not found" })
      }
    } catch(error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async assignOrder(req: Request, res: Response) {
    const { orderId, courierId } = req.body

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId as string,
      },
      data: {
        courierId: courierId,
        status: "ASSIGNED",
      },
    })

    console.log(updatedOrder)

    if (!updatedOrder) {
      return res.status(200).json({ message: "Order is not updated :(" })
    } else {
      return res.status(200).json(updatedOrder)
    }
  }

  static async callOrder(req: Request, res: Response) {
    const { orderId } = req.body

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId as string,
      },
      data: {
        status: "IN_PROGRESS",
      }
    })

    if (!updatedOrder) {
      return res.status(200).json({ message: "Order is not updated :(" })
    } else {
      return res.status(200).json(updatedOrder)
    }
  }

  static async afterCall(req: Request, res: Response) {
    const { orderId } = req.body

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId as string,
      },
      data: {
        status: "READY_TO_DELIVER",
      },
    })

    if (!updatedOrder) {
      return res.status(200).json({ message: "Order is not updated :(" })
    } else {
      return res.status(200).json(updatedOrder)
    }
  }

  static async completeOrder(req: Request, res: Response) {
    try {
      const { id } = req.body

      const updatedOrder = await prisma.order.update({
        where: {
          id,
        },
        data: {
          courierId: null,
          status: "COMPLETED"
        }
      })

      if (!updatedOrder) {
        return res.status(200).json({ message: "Order not found" })
      } else {
        return res.status(200).json(updatedOrder)
      }

    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}
