const router = require('express').Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Code = require('../models/Code');

//creating an order

router.post('/', async(req, res)=> {
  const io = req.app.get('socketio');
  const {userId, cart, country, address, codeName, codeValue} = req.body;
  try {
    /* const code = await Code.find()[0].promoCode;
    const codeValue = Object.values(code) */
    
    const user = await User.findById(userId);
    const order = await Order.create({owner: user._id, products: cart, country, address});
    order.count = cart.count;
    
    order.total = cart.total;
    if (user.hasDiscount) {
      order.total -= Number(codeValue)
    }
    user.point += order.total;
    await order.save();
    user.cart =  {total: 0, count: 0};
    user.orders.push(order);
    const notification = {status: 'unread', message: `New order from ${user.name}`, time: new Date()};
    io.sockets.emit('new-order', notification);
    user.markModified('orders');
    await user.save();
    res.status(200).json(user)

  } catch (e) {
    res.status(400).json(e.message)
  }
})
 
router.post('/admin', async(req, res)=> {
  const io = req.app.get('socketio');
  const {userId, adminId, cart, country, address} = req.body;
  try {
    const user = await User.findById(userId);
    const admin = await User.findById(adminId);
    const order = await Order.create({owner: user ? user._id: admin._id, products: cart, country, address});
    order.count = cart.count;
    order.total = cart.total;
    await order.save();
    admin.cart =  {total: 0, count: 0};
    admin.orders.push(order);
    const notification = {status: 'unread', message: `New order from ${admin.name}`, time: new Date()};
    io.sockets.emit('new-order', notification);
    admin.markModified('orders');
    await admin.save();
    res.status(200).json(admin)

  } catch (e) {
    res.status(400).json(e.message)
  }
})

// getting all orders;
router.get('/', async(req, res)=> {
  try {
    const orders = await Order.find().populate('owner', ['email', 'name']);
    res.status(200).json(orders);
  } catch (e) {
    res.status(400).json(e.message)
  }
})


//shipping order

router.patch('/:id/mark-shipped', async(req, res)=> {
  const io = req.app.get('socketio');
  const {ownerId} = req.body;
  const {id} = req.params;
  try {
    const user = await User.findById(ownerId);
    await Order.findByIdAndUpdate(id, {status: 'shipped'});
    const orders = await Order.find().populate('owner', ['email', 'name']);
    const notification = {status: 'unread', message: `Order ${id} shipped with success`, time: new Date()};
    io.sockets.emit("notification", notification, ownerId);
    user.notifications.push(notification);
    await user.save();
    res.status(200).json(orders)
  } catch (e) {
    res.status(400).json(e.message);
  }
})
module.exports = router;
