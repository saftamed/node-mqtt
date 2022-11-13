require("dotenv").config();
let mongoose = require("mongoose");
const User = require("./models/User");
const bodyParser = require('body-parser')

const userRoute = require("./routes/user");
const mqtt = require('mqtt')

const host = 'broker.emqx.io'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'emqx',
  password: 'public',
  reconnectPeriod: 1000,
})

const topic = '/safta/mqtt'
client.on('connect', () => {
  console.log('Connected')
  client.subscribe(["/safta/mqtt2"], () => {
    console.log(`Subscribe to topic /safta/mqtt2`)
  })
  client.publish(topic, 'safta mqtt test', { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
})
client.on('message', async (topic, payload) => {
  console.log('Received Message:', topic, payload.toString())
  console.log(JSON.parse(payload.toString()).name);

  const newUser = new User(JSON.parse(payload.toString()));

  try {
    const savedUser = await newUser.save();
  } catch (err) {
    console.log(err);
  }
})


var cors = require('cors')

const express = require("express");
const app = express();
app.use(cors())

//app.use('/public', express.static('public'));
// Connect To DataBase
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error("Database connection error");
  });

  
  // parse application/x-www-form-urlencoded
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
      extended: false
  }));


app.use("/api/v1/user",userRoute)

function getLocalIp() {
  const os = require('os');

  for(let addresses of Object.values(os.networkInterfaces())) {
      for(let add of addresses) {
          if(add.address.startsWith('192.168.')) {
              return add.address;
          }
      }
  }
}
app.listen(process.env.PORT || 3000,getLocalIp(), function () {
  console.log(`server Started on ${getLocalIp()} port ${process.env.PORT || 3000} `);
});