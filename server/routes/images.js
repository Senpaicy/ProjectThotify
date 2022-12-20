const express = require("express");
const router = express.Router();
// const AWS = require('aws-sdk');
// AWS.config.loadFromPath('./aws_config.json');
// var s3Bucket = new AWS.S3( { params: {Bucket: 'xxxx'} } );
var im = require('imagemagick');


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
        const rawPath = '.\\tmp\\raw\\' + name; 
        uploaded.mv(rawPath);
        //IMAGE MAGICK:
        im.resize({
            srcPath: rawPath,
            dstPath: '.\\tmp\\proc\\' + name,
            width:   256
          }, function(err, stdout, stderr){
            if (err) throw err;
            console.log('resized ',rawPath,' to fit within 256x256px');
          });
        // console.log(rawPath);
        // im.convert([rawPath, '-resize', '256x256', '.\\tmp\\proc\\' + name], 
        //     function(err, stdout){
        //     if (err) throw err;
        //     console.log('stdout:', stdout);
        //     });

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
