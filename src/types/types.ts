export type User = {
  id: string,
  email: string,
  password: string,
  role: "ADMIN" | "COURIER" | "DEFAULT_USER",
  createdAt: Date,
  updatedAt: Date,
}

export type MenuItem = {
  id: string,
  name: string,
  description: string | null,
  price: number,
  image: string,
  createdAt: Date,
  updatedAt: Date,
}

export type Order = {
  id: string,
  defaultUserId: string,
  courierId: string | null,
  status: "PENDING" | "ASSIGNED" | "COMPLETED",
  createdAt: Date,
  updatedAt: Date,
  defaultUser: User,
  orderItems: Array<{
    id: string,
    orderId: string,
    menuItemId: string,
    quantity: number,
  }>,
}
