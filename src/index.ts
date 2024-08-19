import express from 'express';
import userRouter from "./routes/user.router";
import menuRouter from "./routes/menu.router";
import orderRouter from "./routes/order.router";

const app = express()
const port = process.env.PORT || 8001
const cors = require('cors');

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));

app.use(express.json());
app.use('/user', userRouter)
app.use('/menu', menuRouter)
app.use('/order', orderRouter)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
