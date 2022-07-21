const express = require("express");
const app = express();
const axios = require("axios").create({baseUrl: "https://api.etherscan.io/api/"});
const url = require('url');
const mongoose = require('mongoose');
const Crypto = require("./database.js");

const databaseurl = "mongodb://localhost/cryp_assesment";
mongoose.connect(databaseurl, { useNewUrlParser: true });
const con = mongoose.connection;
con.on("open", () => {
    console.log("CONNECTED TO DATABASE");
  });

app.listen(2400, () => {
    console.log("Server started at port 2400");
});

async function getTransactionList() {
    let payload = {
        module: "account",
        action:"txlist",
   address:"0xce94e5621a5f7068253c42558c147480f38b5e0d",
   //address: req.body.address,
   startblock:0,
   endblock:99999999,
   page:1,
   offset:10,
   sort:"asc",
   apikey:"31KH6A33UJR6EN1D9PZX4HR14NB4EIKVP8",
    }
    const params = new url.URLSearchParams(payload);

    let res = await axios.get(`https://api.etherscan.io/api?${params}`);
    let result = res.data.result;
    Crypto.create({
        address: "0xce94e5621a5f7068253c42558c147480f38b5e0d",
        transactions:[{result}]
    }
    )
     balance = 0;
    for(let i = 0; i < result.length; i++) {
        let elements = result[i];
        const obj = JSON.stringify(elements.from);
        
        const address = "0xce94e5621a5f7068253c42558c147480f38b5e0d"
        
          if(obj == address){
               value = Number(elements.value)
               balance = balance - value
          }
          else{
              value = Number(elements.value)
              balance = balance + value
          }
    }
    console.log(result);
    console.log("Balance: "+balance)
}

async function getPrice(){
    let res = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr`);
    let data = res.data.ethereum.inr;
    let value = data.toString();
    console.log(data);
    Crypto.insertMany(
        {  values: data  }
    )
}

getTransactionList();
setInterval(getPrice,600000);
//getPrice();

