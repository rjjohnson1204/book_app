'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const superagent = require('superagent');


require('dotenv').config();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

app.set('view engine', 'ejs');


