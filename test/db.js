const { MongoMemoryServer } = require("mongodb-memory-server")
const { default: mongoose } = require("mongoose")


let mongod

exports.connectDB = async () => {
    if (!mongod) {
        mongod = await MongoMemoryServer.create()
        let uri = mongod.getUri()
        let config = {
            useUndefineTopology: true,
            maxPoolSize: 10
        }
        mongoose.connect(uri, config)
    }
}


exports.closeDB = () => {
    mongoose.connection.dropDatabase()
    mongoose.connection.close()
    if (mongod) {
        mongod.stop()
    }
}

exports.clearDB = () => {
    let collections = mongoose.connection.collections
    for (const key in collections) {
        let coll = collections[key]
        coll.deleteMany()
    }
}