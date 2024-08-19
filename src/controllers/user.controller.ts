import { prisma } from "../constants/constants";
import { Request, Response } from 'express';
import {User} from "../types/types";

export class UserController {
  static async signIn(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      const signInUser: User | null = await prisma.user.findFirst({
        where: {
          email,
        },
      }).then((result) => result)

      if (!signInUser) {
        return res.status(200).json({ message: 'User not found' })
      }

      if (signInUser.password === password && signInUser.email) {
        if (signInUser.role === "DEFAULT_USER") {
          const typedUser = await prisma.defaultUser.findFirst({
            where: {
              userId: signInUser.id,
            }
          }).then(result => result)

          return res.status(200).json(
            {
              userId: signInUser.id,
              id: typedUser?.id,
              email: signInUser.email,
              role: signInUser.role
            })
        } else if (signInUser.role === "COURIER") {
          const typedUser = await prisma.courier.findFirst({
            where: {
              userId: signInUser.id,
            }
          }).then(result => result)

          return res.status(200).json(
            {
              userId: signInUser.id,
              id: typedUser?.id,
              email: signInUser.email,
              role: signInUser.role
            })
        } else {
          const typedUser = await prisma.admin.findFirst({
            where: {
              userId: signInUser.id,
            }
          }).then(result => result)

          return res.status(200).json(
            {
              userId: signInUser.id,
              id: typedUser?.id,
              email: signInUser.email,
              role: signInUser.role
            })
        }
      } else {
        console.log({ email, password })
        return res.status(200).json({ message: "The password or email is incorrect" })
      }
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async signUp(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      if (email && password) {
        const user: User = await prisma.user.create({
          data: {
            email,
            password,
            role: "DEFAULT_USER",
          },
        }).then(async (result) => {
          await prisma.defaultUser.create({
            data: {
              userId: result.id,
            }
          })

          return result
        })

        if (user) {
          const typedUser = await prisma.defaultUser.findFirst({
            where: {
              userId: user.id,
            }
          }).then(result => result)

          return res.status(200).json(
            {
            userId: user.id,
            id: typedUser?.id,
            email: user.email,
            role: user.role
          })
        } else {
          return res.status(200).json({ message: "User is not created" })
        }
      } else {
        return res.status(200).json({ message: "Password or email is not provided" })
      }
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async getFreeCouriers(req: Request, res: Response) {
    try {
      const couriers = await prisma.courier.findMany({
        include: {
          orders: true,
        },
      })

      const filteredCouriers = couriers
        .filter(item => item.orders.length < 3)

      const updatedCouriers = await Promise.all(
        filteredCouriers.map(async (item) => {
          const user = await prisma.user.findFirst({
            where: {
              id: item.userId,
            },
          })

          return {
            ...item,
            email: user?.email,
          }
        })
      )

      if (updatedCouriers.length) {
        return res.status(200).json(updatedCouriers)
      } else {
        return res.status(200).json({ message: "No free couriers" })
      }
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}

