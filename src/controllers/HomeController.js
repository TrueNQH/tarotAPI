
require('dotenv').config();
const axios = require('axios');
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN
module.exports = {
    getHomePage: (req, res) => {
        return res.render('homepage.ejs')
    },
    postWebHook: (req,res) => {
      const body = req.body;
      function sendMessage(recipientId, messageText) {
        const messageData = {
          "field": "messages",
          recipient: {
            id: recipientId,
          },
          message: {
            text: messageText,
          },
        };
      
        axios.post(
          `https://graph.facebook.com/v3.3/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
          messageData
        )
        .then(response => {
          res.send('post success');
        })
        .catch(error => {
          res.send(error);
        });
      }
      if (body.object === 'page') {
        body.entry.forEach(function (entry) {
          const webhookEvent = entry.messaging[0];
          const senderId = webhookEvent.sender.id;
          const message = webhookEvent.message;
    
          if (message && message.text) {
            // Xử lý thông điệp từ khách hàng
            const receivedText = message.text;
    
            // Gửi tin nhắn trả lời
            sendMessage(senderId, 'Chào! Bạn vừa nói: ' + receivedText);
          }
        });
        res.status(200).send('EVENT_RECEIVED');
      } else {
        console.log(body.object);
        res.status(404).send('post error'  );
       
      }
    },
    getWebHook: (req, res) => {
        let VERIFY_TOKEN = process.env.VERIFY_TOKEN
        let mode = req.query["hub.mode"];
        let token = req.query["hub.verify_token"];
        let challenge = req.query["hub.challenge"];
      
        // Check if a token and mode is in the query string of the request
        if (mode && token) {
          // Check the mode and token sent is correct
          if (mode == "subscribe" && token == VERIFY_TOKEN) {
            // Respond with the challenge token from the request
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
          } else {
            // Respond with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
          }
        }
    },
     
    demoPost: (req, res) => {
      res.send('post success')
    }, 
    postwh: (req, res) => {
      let body = req.body;

  console.log(`\u{1F7EA} Received webhook:`);
  console.dir(body, { depth: null });

  // Check if this is an event from a page subscription
  if (body.object === "page") {
    // Returns a '200 OK' response to all requests
    res.status(200).send("EVENT_RECEIVED"); 
  }
    }, 

}
