import fs from "fs";
import _ from "lodash";
import { File, User } from "../models";

export const saveFile = (req, res) => {
  if (_.includes(["admin", "manager"], req.user.role)) {
    if (req.user.permissions.some((value) => value === "allow_upload")) {
      File.create({
        user: req.user._id,
        file_name: req.file.filename,
        file_path: req.file.path,
        original_name: req.file.originalname,
        file_size: req.file.size,
        file_des: req.file.destination,
        status: req.body.status,
      }).then((file) => {
        file
          .saveMetaData(req.user, "create")
          .then(() => {
            return res.status(201).json({
              code: 201,
              message: "File created successfully",
              dev_message: "file_created",
            });
          })
          .catch((error) => {
            return res.status(500).json({
              code: 500,
              message: error.message,
              dev_message: "file_create_failed",
            });
          });
      });
    } else {
      return res.status(400).json({
        code: 400,
        message: "You do not have permissions to upload files",
        dev_message: "unauthorized_user_action",
      });
    }
  } else {
    return res.status(400).json({
      code: 400,
      message: "Only admin and manager can upload files",
      dev_message: "unauthorized_user_action",
    });
  }
};

export const getFile = (req, res) => {
  if (_.includes(["admin", "manager"], req.user.role)) {
    if (req.user.permissions.some((value) => value === "allow_download")) {
      File.findById(req.params.id)
        .then((fileInfo) => {
          const file = fs.createReadStream(fileInfo.file_path);
          res.setHeader(
            "Content-Disposition",
            'attachment: filename="' + fileInfo.original_name + '"'
          );
          file.pipe(res);
        })
        .catch((error) => {
          return res.status(404).json({
            code: 404,
            message: error.message,
            dev_message: "file_not_found",
          });
        });
    } else {
      return res.status(401).json({
        code: 401,
        message: "You do not have permissions to download files",
        dev_message: "unauthorized_user_action",
      });
    }
  } else {
    return res.status(401).json({
      code: 401,
      message: "Only admin and manager can fetch files",
      dev_message: "unauthorized_user_action",
    });
  }
};

export const getFileInfo = (req, res) => {
  if (_.includes(["admin", "manager"], req.user.role)) {
    File.findById(req.params.id)
      .select("-user -__v")
      .populate({
        path: "meta_data",
        populate: [
          {
            path: "createdBy",
            model: User,
            select: "-_id first_name last_name user_name",
          },
          {
            path: "updatedBy",
            model: User,
            select: "-_id first_name last_name user_name",
          },
        ],
      })
      .then((file) => {
        return res.status(200).json({
          code: 200,
          message: "File info fetch successfully",
          dev_message: "file_info_fetch",
          file: file,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          code: 500,
          message: error.message,
          dev_message: "file_info_fetch_error",
        });
      });
  } else {
    return res.status(401).json({
      code: 401,
      message: "Only admin and manager can fetch file info",
      dev_message: "unauthorized_user_action",
    });
  }
};

export const getFileInfoForUser = (req, res) => {
  if (_.includes(["admin", "manager"], req.user.role)) {
    File.find({ user: req.user._id })
      .select("-user -__v")
      .populate({
        path: "meta_data",
        populate: [
          {
            path: "createdBy",
            model: User,
            select: "-_id first_name last_name user_name",
          },
          {
            path: "updatedBy",
            model: User,
            select: "-_id first_name last_name user_name",
          },
        ],
      })
      .then((files) => {
        return res.status(200).json({
          code: 200,
          message: "Files info fetch successfully",
          dev_message: "files_info_fetch",
          files: files,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          code: 500,
          message: error.message,
          dev_message: "files_info_fetch_error",
        });
      });
  } else {
    return res.status(401).json({
      code: 401,
      message: "Only admin and manager can fetch files",
      dev_message: "unauthorized_user_action",
    });
  }
};
