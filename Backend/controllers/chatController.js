const messageModel = require('../models/message');


// get all the chat history of the user
async function getChatHistory(req, res){
    try {
        const user = req.user;

        const messages = await messageModel.find({ user: user._id }).sort({ updatedAt: 1 }).limit(80).lean();
        res.status(200).json({
            success: true, 
            messages,
            message: 'Chat history fetched successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching chat history'
        });
    }
}

module.exports = {getChatHistory};