'use strict';

const express = require('express');
const port = process.env.PORT || 9001;

const app = express();
app.listen(port, () => {
    console.log(`Limoges listening on port ${port}`);
});

app.use(express.static('static'));
