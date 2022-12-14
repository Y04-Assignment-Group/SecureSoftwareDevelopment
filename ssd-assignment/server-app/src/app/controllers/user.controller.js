import { User } from "../models";

export const createUser = async (req, res) => {
  User.findOne({ user_name: req.body.user_name }).then((user) => {
    if (user) {
      return res.status(400).json({
        code: 400,
        message: "User name already exists",
        dev_message: "user_name_already_exits",
      });
    } else {
      User.create(req.body)
        .then((user) => {
          user
            .generateAuthToken()
            .then(() => {
              user
                .saveMetaData(req.user, "create")
                .then(() => {
                  return res.status(201).json({
                    code: 201,
                    message: "User account created",
                    dev_message: "acount_created",
                  });
                })
                .catch((_erorr) => {
                  return res.status(500).json({
                    code: 500,
                    message: "Metadata saving issue",
                    dev_message: "metadata_save_issue",
                  });
                });
            })
            .catch((_error) => {
              return res.status(500).json({
                code: 500,
                message: "Auth token generation failed",
                dev_message: "token_generate_failed",
              });
            });
        })
        .catch((error) => {
          if (error.name === "ValidationError") {
            if (error.errors.password) {
              return res.status(400).json({
                code: 400,
                message: error.errors.password.message,
                dev_message: "account_create_failed",
              });
            }

            if (error.errors.email) {
              return res.status(400).json({
                code: 400,
                message: error.errors.email.message,
                dev_message: "account_create_failed",
              });
            }

            if (error.errors.phone_number) {
              return res.status(400).json({
                code: 400,
                message: error.errors.phone_number.message,
                dev_message: "account_create_failed",
              });
            }
          } else {
            return res.status(500).json({
              code: 500,
              message: error.message,
              dev_message: "account_create_failed",
            });
          }
        });
    }
  });
};

export const login = (req, res) => {
  const { user_name, password } = req.body;
  User.findByUsernamePassword(user_name, password)
    .then(([token, role]) => {
      return res.status(200).json({
        code: 200,
        message: "User credentials are correct",
        dev_message: "valid_credentials",
        token: token,
        role: role,
      });
    })
    .catch((error) => {
      const errorInfo = JSON.parse(error.message);
      return res.status(errorInfo.code).json({
        code: errorInfo.code,
        message: errorInfo.message,
        dev_message: errorInfo.dev_message,
      });
    });
};

export const getAllUsers = (req, res) => {
  User.find({})
    .select("-password -auth_token")
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
    .then((users) => {
      return res.status(200).json({
        code: 200,
        message: "Users fetched",
        dev_message: "users_fetched",
        users: users,
      });
    })
    .catch((_error) => {
      return res.status(500).json({
        code: 500,
        message: "User accounts fetching failed",
        dev_message: "user_accounts_fetch_failed",
      });
    });
};

export const getAccount = (req, res) => {
  User.findById(req.user._id)
    .select("-password -auth_token -meta_data -createdAt -updatedAt -__v")
    .then((user) => {
      return res.status(200).json({
        code: 200,
        message: "Users fetched",
        dev_message: "users_fetched",
        user: user,
      });
    })
    .catch((_error) => {
      return res.status(500).json({
        code: 500,
        message: "User account fetching failed",
        dev_message: "user_account_fetch_failed",
      });
    });
};
