const express = require('express')
const app = express()
const port = 9999
const path = require('path')
const fs = require('fs');

// Environment Variables
require('dotenv-safe').load({
    sample: path.join(path.dirname(fs.realpathSync(__filename)), '.env.example'),
  });
  
app.get('/findMatch', require('./api/findMatch'));

app.listen(port, () => console.log(`GB finder app listening on port ${port}!`))