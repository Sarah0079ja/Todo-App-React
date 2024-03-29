require('dotenv').config()

const express = require( 'express' );
const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );
const multer = require('multer');
const path = require( 'path' );


const router = express.Router();

//  file Storing Starts
const s3 = new aws.S3({
accessKeyId: 'process.env.accessKeyId;',
secretAccessKey: 'process.env.secretAccessKey',
Bucket: 'sga6-test'
});

// Multiple File Uploads ( max 5 )
const quizzAppUpload = multer({
    storage: multerS3({
     s3: s3,
     bucket: 'sga6-test',
     acl: 'public-read',
     key: function (req, file, cb) {
      cb( null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
     }
    }),
    limits:{ fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
    fileFilter: function( req, file, cb ){
     checkFileType( file, cb );
    }
   }).array( 'quizzData', 5 );
   /**
    * @route POST /api/quizzApp/Qbank-upload
    * @desc Upload quizz-App
    * @access public
    */
   router.post('/quizzApp-upload', ( req, res ) => {
   quizzAppUpload( req, res, ( error ) => {
     console.log( 'files', req.files );
     if( error ){
      console.log( 'errors', error );
      res.json( { error: error } );
     } else {
      // If File not found
      if( req.files === undefined ){
       console.log( 'Error: No File Selected!' );
       res.json( 'Error: No File Selected' );
      } else {
       // If Success
       let fileArray = req.files,
        fileLocation;
   const fileLocationArray = [];
       for ( let i = 0; i < fileArray.length; i++ ) {
        fileLocation = fileArray[ i ].location;
        console.log( 'filenm', fileLocation );
        fileLocationArray.push( fileLocation )
       }
       // Save the file name into database
   res.json( {
        filesArray: fileArray,
        locationArray: fileLocationArray
       } );
      }
     }
    });
   });
   // We export the router so that the server.js file can pick it up
   module.exports = router;