const axios = require("axios");

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
exports.generateReply = async (prompt) => {
  try{
    const response = await axios.post(GEMINI_API_URL, {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ],
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": process.env.GEMINI_API_KEY
      },
    });
    const content = response.data?.candidates?.[0]?.content;
    const text = content?.parts?.[0]?.text;
    
    if(!text){
      throw new Error("Gemini reply not found");
    }
    return text;
  }catch(error){
    console.log(error);
    throw error;
  }
}
