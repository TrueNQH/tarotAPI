const express = require('express');
const viewEngine = require('./configs/viewEngine')
const webRouter = require('./routes/web')
const bodyParser = require('body-parser') 
const app = express();
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());

const PORT = process.env.PORT || 8000



viewEngine(app);
webRouter(app);

app.listen(PORT, () => {
    console.log('app is running at the port', PORT);
})