import { Message } from "../models";

export const saveMessage = async (req, res) => {
  if (req.user.permissions.some((value) => value === "allow_message")) {
    const messageData = {
      user_id: req.user._id,
      message: req.body.message,
    };

    Message.create(messageData)
      .then(() => {
        return res.status(201).json({
          code: 201,
          message: "Message saved",
          dev_message: "message_create_success",
        });
      })
      .catch((error) => {
        return res.status(500).json({
          code: 500,
          message: "Message save failed",
          dev_message: "message_create_failed",
        });
      });
  } else {
    return res.status(400).json({
      code: 400,
      message: "You do not have permissions save messages",
      dev_message: "unauthorized_user_action",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    await Message.find({ user_id: req.user._id })
      .then((messages) => {
        return res.status(200).json({
          code: 200,
          message: "Messages fetch success",
          dev_message: "messages_fetch_success",
          messages: messages,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          code: 500,
          message: error.message,
          dev_message: "message_fetch_failed",
        });
      });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Message fetch failed",
      dev_message: "fetch_messages_process_failed",
    });
  }
};
