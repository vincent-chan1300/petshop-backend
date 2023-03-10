const express = require('express');
const cors = require('cors');
const app = express();

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'https://petshop-frontend-pf42.onrender.com/');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

const http = require('http');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET);
require('./connection')
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server, {
  cors: 'https://petshop-frontend-pf42.onrender.com/',
  methods: ['GET', 'POST', 'PATCH', "DELETE"]
})


const User = require('./models/User');
const Code = require('./models/Code');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const imageRoutes = require('./routes/imageRoutes');
const codeRoutes = require('./routes/codeRoutes');

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/images', imageRoutes);
app.use('/codes', codeRoutes);


app.post('/create-payment', async(req, res)=> {
  const {amount} = req.body;
  
  console.log(amount);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'hkd',
      payment_method_types: ['card']
    });
    res.status(200).json(paymentIntent)
  } catch (e) {
    console.log(e.message);
    res.status(400).json(e.message);
   }
})


server.listen(8080, ()=> {
  console.log('server running at port', 8080)
})

app.set('socketio', io);
