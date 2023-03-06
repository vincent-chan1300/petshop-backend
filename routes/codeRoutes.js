const router = require('express').Router();
const Code = require('../models/Code');

//creating an order

router.get('/', async (req, res) => {
  try {
    const code = await Code.find({index: 1});
    res.status(200).json(code);

  } catch (e) {
    res.status(400).send(e.message);
  }
})
router.patch('/update', async (req, res) => {
  const { codeName, codeValue } = req.body;
  
  try {
    const code = await Code.updateOne({index: 1}, { $set: {codeName: codeName, codeValue: codeValue}});
    res.json(await Code.find());
  } catch (e) {
    res.status(400).send(e.message);
  }
})



module.exports = router;