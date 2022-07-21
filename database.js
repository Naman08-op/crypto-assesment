const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    address:{
        type :String,
    },
    transactions:[{}],
    
})


module.exports = mongoose.model("Crypto",schema);
