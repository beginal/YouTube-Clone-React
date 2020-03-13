const express = require("express");
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require("multer")
const ffmpeg = require('fluent-ffmpeg')

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`)
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    if(ext != '.mp4') {
      return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
    }
    cb(null, true)
  }
})

const upload = multer({ storage: storage }).single('file')

router.post('/uploadfiles', (req,res) => {

    upload(req,res,err => {
      if(err) {
        return res.json({ success: false, err})
      }
      return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename })
    })
})

router.post('/uploadVideo', (req,res) => {

  const video = new Video(req.body)
  video.save((err, doc) => {
    console.log(err)
    if(err) return res.json({ success: false, err})
    res.status(200).json({ succenss: true })
  })
})

router.post('/thumbnail', (req, res) => {

  let filePath = ""
  let fileDuration = ""

  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    console.dir(metadata);
    console.log(metadata.format.duration);
    fileDuration = metadata.format.duration
  })

  ffmpeg(req.body.url)
  .on('filenames', function (filenames) {
    console.log('Will generate ' + filenames.join(', '))
    console.log(filenames)

    filePath = "uploads/thumbnails/" + filenames[0]
  })
  .on('end', function () {
    console.log('Screenshot taken');
    return res.json({ success: true, url: filePath, fileDuration: fileDuration})
  })
  .on('error', function (err) {
    console.log(err);
    return res.json({ succenss: false, err})
  })
  .screenshots({
    count: 3,
    folder: 'uploads/thumbnails',
    size: '320x240',
    filename: 'thumbnail-%b.png'
  })
})


module.exports = router;