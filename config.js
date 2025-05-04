const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "", // Paste your session id here
ALIVE_IMG: process.env.ALIVE_IMG || "https://github.com/DANUWA-MD/DANUWA-MD/blob/main/images/DANUWA-MD.png?raw=true",
ALIVE_MSG: process.env.ALIVE_MSG || "*Hello👋 DANUWA-MD Is Alive Now😍*",
MOVIE_API_KEY: process.env.MOVIE_API_KEY || "sky|51c173810f25c71beb51b431867187b736b89c28",
GEMINI_API_KEY: process.env.GEMINI_API_KEY || "AIzaSyDOYDk9O6y_Jbgh0Q0YFoOQ2T8pFxHpBdw",
BOT_OWNER: '94776121326',  // Replace with the owner's phone number



};
