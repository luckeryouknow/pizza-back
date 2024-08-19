import {prisma} from "../constants/constants"
import {Request, Response} from "express"
import {MenuItem} from "../types/types";

export class MenuController {
  static async getAllMenuItems(req: Request, res: Response) {
    try {
      const menuList: MenuItem[] | null = await prisma.menuItem.findMany({})
        .then((result) => result)

      if (!menuList) {
        return res.status(200).json({ message: "Menu is empty" })
      } else {
        return res.status(200).json(menuList)
      }
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: "Internal server error" })
    }
  }

  static async postMenuItem(req: Request, res: Response) {
    try {
      const { name, description, price, image } = req.body
      console.log(name)

      const menuItem: MenuItem = await prisma.menuItem.create({
        data: {
          name,
          description,
          price: Number(price),
          image,
        }
      }).then((result) => result)

      if (!menuItem) {
        return res.status(200).json({ message: "Menu item can't be created" })
      } else {
        return res.status(200).json({ message: "Item is created" })
      }
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}
