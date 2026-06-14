const mongoose = require('mongoose')

async function connectdb() {
    await mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("Database is connected");
        
    })
    .catch(err=>{
        console.log("Database is not connected")
        process.exit(1)
})
}
module.exports = connectdb