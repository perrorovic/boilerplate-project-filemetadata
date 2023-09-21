var express = require('express');
var cors = require('cors');
require('dotenv').config()
//multer package
const multer = require('multer');

var app = express();

//multer configuration
const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); //directory location
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); //filename without any changes. this need to be listed here because of default multer behaviour on auto generated-name
  },
});

const multerUpload = multer({
  storage: multerConfig,
});

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', multerUpload.single('upfile'), (req, res) => {
  //object: name, type, size
  if (!req.file) {
    return res.json({error: 'missing file'});
  }

  const uploadInfo = {
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size,
  };

  res.json(uploadInfo);
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
