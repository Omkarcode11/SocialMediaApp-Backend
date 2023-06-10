const upload = require('./../middleware/fileUploads')
const MongoClient = require('mongodb').MongoClient
const GridFsBucket = require('mongodb').GridFSBucket
require('dotenv').config()

const url = process.env.DB_URL

const baseUrl = "http://localhost:8008/files/"



const mongoClient = new MongoClient(url)


exports.uploadFiles = async (req, res) => {
    try {

        let result = await upload(req, res)
        console.log(result)

        if (req.file == undefined) {
            return res.send({ meg: "you must select a file" })
        }

        return res.send({
            msg: ' file has been uploaded',
            fileName: req.file
        })
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}

exports.getListFiles = async (req, res) => {
    try {
        await mongoClient.connect()

        const database = mongoClient.db('Freedom')
        const images = database.collection("photo.files")

        const cursor = images.find({})

        if ((await cursor.count()) === 0) {
            return res.status(500).send({
                msg: "No files Found!"
            })
        }

        let fileInfos = []

        await cursor.forEach((doc) => {
            fileInfos.push({
                name: doc.filename,
                url: baseUrl + doc.filename
            })
        })

        return res.status(200).send(fileInfos)
    } catch (err) {
        return res.status(500).send({
            msg: 'internal Error'
        })
    }
}


exports.download = async (req, res) => {
    try {

        await mongoClient.connect()

        const database = mongoClient.db("Freedom")
        const bucket = new GridFsBucket(database, {
            bucketName: 'photo'
        })

        let downloadStream = bucket.openDownloadStreamByName(req.params.name)

        downloadStream.on('data', function (data) {
            return res.status(200).write(data);
        })

        downloadStream.on('error', function (err) {
            return res.status(404).send({ msg: 'cannot download the image' })
        })

        downloadStream.on('end', () => {
            return res.end()
        })


    } catch (err) {
        return res.send(err)
    }
}