const express = require("express");
const router = express.Router();
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./routes/aws_config.json');
var s3Bucket = new AWS.S3( { params: {Bucket: 'thotify-images'} } );
const fs = require('fs');
var im = require('imagemagick');
const { SAMLCredentials } = require("aws-sdk");


router.post("/ingest-image", async (req, res) => {
    console.log(typeof req.body.name);
    const name = req.body.name.replace(/\s/g, "");;
  try{
    if(!req.files){
        res.send({
            status:false,
            message:"No file uploaded"
        })
    } else{
        let uploaded = req.files.pfp;
        const rawPath = 'tmp/raw/' + name; 
        const small = '../tmp/small/' + name;
        const large = '../tmp/large/' + name;

        uploaded.mv(rawPath);
        //IMAGE MAGICK:
        im.resize({
            srcPath: './' + rawPath,
            dstPath: small,
            width:   "256"
          }, function(err, stdout, stderr){
            if (err) throw err;
            console.log('resized ',rawPath,' to fit within 256x256px');
            
            const fileContent = fs.readFileSync(small);
            // Setting up S3 upload parameters
            const params = {
                Key: req.body.account_type + '/' + req.body.id + '/small' , // File name you want to save as in S3
                Body: fileContent
            };
            // Uploading files to the bucket
            s3Bucket.upload(params, function(err, data) {
                if (err) {
                    throw err;
                }
                console.log(`File uploaded successfully. ${data.Location}`);
            });
            fs.unlink(small);

          });
          im.resize({
            srcPath: './' + rawPath,
            dstPath: large,
            width:   "256"
          }, function(err, stdout, stderr){
            if (err) throw err;
            console.log('resized ',rawPath,' to fit within 256x256px');

            const fileContent2 = fs.readFileSync(large);
            // Setting up S3 upload parameters
            const params2 = {
                Key: req.body.account_type + '/' + req.body.id + '/large' , // File name you want to save as in S3
                Body: fileContent2
            };
            // Uploading files to the bucket
            s3Bucket.upload(params2, function(err, data) {
                if (err) {
                    throw err;
                }
                console.log(`File uploaded successfully. ${data.Location}`);
            });
            fs.unlink(large);

          });

        /*
        src="https://thotify-images.s3.us-west-2.amazonaws.com/profile/id/small"
            /profile/id/
                small
                large
            /artist/id/
                picture
        */
       
        
        
        fs.unlink(rawPath);
        res.send({
            status: true,
            message: 'File is uploaded',
            data: {
                name: req.body.name,
                mimetype: uploaded.mimetype,
                size: uploaded.size
            }
        });
    }
  } catch(e){
    res.status(500).send(e);
  }
});


module.exports = router;
