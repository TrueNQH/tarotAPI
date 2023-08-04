
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
          console.log('Đã gửi tin nhắn trả lời thành công!');
        })
        .catch(error => {
          console.error('Lỗi khi gửi tin nhắn:', error);
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
        res.sendStatus(404);
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
    }

}
