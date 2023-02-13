// const {S3Client, PutObjectCommand, GetObjectCommand} = require('@aws-sdk/client-s3');
// const {getSignedUrl} = require("@aws-sdk/s3-request-presigner")
const AWS = require('aws-sdk')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const s3 = new AWS.S3({
    credentials: {
        accessKeyId: process.env.AWS_PUBLIC_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
})

async function uploadFile(archivo, coleccion){
    try {
        console.log(coleccion)
        const stream = fs.createReadStream(archivo.tempFilePath)
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length -1];
        const nombreTemp = uuidv4() + '.' + extension;
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${coleccion}/${nombreTemp}`,
            Body: stream,
            ContentType: archivo.mimetype,
            ACL: 'public-read'
        }
        const data = await s3.upload(uploadParams).promise();
        console.log(data)
        return data.Location

    } catch (error) {
        console.log(error)
    }
 

    
}



module.exports = {
    uploadFile
}
