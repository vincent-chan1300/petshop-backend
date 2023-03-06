const mongoose = require('mongoose');
const CodeSchema = mongoose.Schema({
     codeName: {
        types: String,
      },
      codeValue: {
        types: Number
      },
      firstName: {
        types: String
      }
     ,
}, {minimize: false});

const Code = mongoose.model('Code', CodeSchema);
/* run()
async function run() {
  try {
    const code = await Code.create({
      promoCode: {
        testing123: 100
      }
    })
    console.log(code);
  } catch (error) {
    console.log(error);
  }
  
} */
module.exports = Code;