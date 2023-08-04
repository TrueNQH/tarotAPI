const express = require('express');
const router = express.Router();
const HomeController = require('../controllers/HomeController')

let initWebRoute = (app) => {
    router.get('/', HomeController.getHomePage  )
    
    router.get('/webhooks', HomeController.getWebHook)
    router.post('/messaging-webhook', HomeController.postWebHook)


    return app.use(router)
};
module.exports = initWebRoute;