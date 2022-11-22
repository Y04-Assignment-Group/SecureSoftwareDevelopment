import { DeleteOutlineOutlined, FileUploadOutlined } from "@mui/icons-material";
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NewAccordion from "../../components/Accordion";
import { FileTable } from "../../components/Table";
import {
  getMessages,
  getUserAccount,
  getUserFiles,
  resetMessageError,
  resetUploadError,
  saveMessage,
  uploadFile,
} from "../../redux/userSlice";

const MAX_MESSAGE_COUNT = "2000";

const UserAccount = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userSlice = useSelector((state) => state.userSlice);
  const [userAccount, setUserAccount] = useState();
  const [userFiles, setUserFiles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");
  const [isMessageError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    dispatch(getUserAccount());
    dispatch(getUserFiles());
    dispatch(getMessages());

    const userRole = localStorage.getItem("Role");
    if (userRole) {
      setUserRole(userRole);
    } else {
      localStorage.removeItem("Authentication");
      navigate("/");
    }
  }, []);

  useEffect(() => {
    setUserAccount(userSlice.userAccount);
  }, [userSlice.userAccount]);

  useEffect(() => {
    setUserFiles(userSlice.userFiles);
  }, [userSlice.userFiles]);

  useEffect(() => {
    setMessages(userSlice.messages);
  }, [userSlice.messages]);

  useEffect(() => {
    dispatch(getMessages());
    setMessage("");
  }, [userSlice.message]);

  useEffect(() => {
    setFile(null);
    setFileName("");
    dispatch(getUserFiles());
  }, [userSlice.fileUpload]);

  useEffect(() => {
    if (userSlice.messageError) {
      setErrorMessage(userSlice.messageError);
      setIsErrorOpen(true);
      dispatch(resetMessageError());
    }
  }, [userSlice.messageError]);

  useEffect(() => {
    if (userSlice.uploadError) {
      setErrorMessage(userSlice.uploadError);
      setIsErrorOpen(true);
      dispatch(resetUploadError());
    }
  }, [userSlice.uploadError]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsErrorOpen(false);
    setErrorMessage("");
  };

  const changeValue = (e) => {
    setMessage(e.target.value);
  };

  const handleClear = (e) => {
    e.preventDefault();
    setMessage("");
  };

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const handleUploadFile = (e) => {
    e.preventDefault();
    if (file) {
      let formData = new FormData();
      formData.append("file", file);
      dispatch(uploadFile(formData));
    }
  };

  const handleSaveMessage = (e) => {
    e.preventDefault();
    if (message) {
      dispatch(saveMessage({ message: message }));
    }
  };

  const handleRedirect = () => {
    navigate("/users");
  };

  const handleLogout = () => {
    localStorage.removeItem("Authentication");
    localStorage.removeItem("Role");
    navigate("/");
  };

  return (
    <>
      {userAccount && (
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex" }}>
              <Typography variant="h5">
                Hi, {userAccount.first_name} {userAccount.last_name}
              </Typography>
              <Badge
                color="warning"
                overlap="rectangular"
                badgeContent={userAccount.role}
                anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
                sx={{ ml: 4, mb: 1.75 }}
              />
            </Box>
            <Box>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                style={{ marginRight: 10 }}
                onClick={handleLogout}
              >
                Logout
              </Button>
              {userRole === "admin" && (
                <Button
                  variant="outlined"
                  size="small"
                  color="secondary"
                  style={{ marginRight: 10 }}
                  onClick={handleRedirect}
                >
                  View all users
                </Button>
              )}
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Your Information
                  </Typography>
                  <Typography sx={{ mb: 1 }} color="text.secondary">
                    Username - {userAccount.user_name}
                  </Typography>
                  <Typography sx={{ mb: 1 }} color="text.secondary">
                    Email - {userAccount.email}
                  </Typography>
                  <Typography sx={{ mb: 1 }} color="text.secondary">
                    Phone Number - {userAccount.phone_number}
                  </Typography>
                </CardContent>
              </Card>
              <Box sx={{ mt: 2 }}>
                <Box>
                  <Typography sx={{ mb: 2 }} variant="h6">
                    Save Message
                  </Typography>
                  <TextField
                    label="Create a new message"
                    inputProps={{ maxLength: MAX_MESSAGE_COUNT }}
                    name="message"
                    onChange={changeValue}
                    multiline
                    maxRows={7}
                    rows={7}
                    fullWidth
                    placeholder="Enter the message"
                    value={message}
                    variant="filled"
                    helperText={
                      <Box sx={{ display: "flex", justifyContent: "space-between", marginLeft: 0 }}>
                        <Typography color={"#e91e63"}>
                          {isMessageError && "Test message"}
                        </Typography>
                        <Typography>
                          {message.trim().length}/ {MAX_MESSAGE_COUNT}
                        </Typography>
                      </Box>
                    }
                    FormHelperTextProps={{
                      style: { marginRight: 0, marginLeft: 0 },
                    }}
                  />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                  {message.trim().length > 0 && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteOutlineOutlined />}
                      sx={{ mr: 1 }}
                      onClick={handleClear}
                    >
                      Clear
                    </Button>
                  )}
                  <Button variant="outlined" onClick={handleSaveMessage}>
                    Save Message
                  </Button>
                </Box>
                <Box>
                  <Typography sx={{ mb: 2 }} variant="h6">
                    Save Files
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography>Select the file/ files</Typography>

                    <Box>
                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="label"
                        size="small"
                      >
                        <input
                          hidden
                          accept="image/*,.doc,.docx,application/pdf"
                          type="file"
                          multiple={false}
                          onChange={handleFileUpload}
                        />
                        <FileUploadOutlined />
                      </IconButton>
                      <Button
                        variant="outlined"
                        component="label"
                        size="small"
                        onClick={handleUploadFile}
                      >
                        Upload new files
                      </Button>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography sx={{ color: "#bdbdbd", fontSize: 12 }}>{fileName}</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box>
                <Box sx={{ mt: 2 }}>
                  <Typography component="span" variant="body1" sx={{ mb: 1 }}>
                    Saved Messages
                  </Typography>
                  <NewAccordion messages={messages} />
                </Box>

                <Box sx={{ mt: 2, mb: 4 }}>
                  <Typography sx={{ mb: 2 }} component="span" variant="body1">
                    Saved Files
                  </Typography>
                  <FileTable userFiles={userFiles} />
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Snackbar
            autoHideDuration={4000}
            open={isErrorOpen}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            onClose={handleClose}
          >
            <Alert onClose={handleClose} severity="warning">
              {errorMessage}
            </Alert>
          </Snackbar>
        </Box>
      )}
    </>
  );
};

export default UserAccount;
