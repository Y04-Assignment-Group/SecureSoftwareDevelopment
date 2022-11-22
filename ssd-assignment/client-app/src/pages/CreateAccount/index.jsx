import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUserAccount, getAllUserAccounts, resetCreateUserError } from "../../redux/userSlice";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  border: "1px solid #0d47a1",
  borderRadius: 1,
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  userName: "",
  password: "",
  role: "",
  permissions: [],
};

const names = ["allow_message", "allow_upload", "allow_download", "allow_delete"];

const CreateAccount = (props) => {
  const dispatch = useDispatch();
  const userSlice = useSelector((state) => state.userSlice);
  const [openModal, setOpenModal] = useState(false);
  const [state, setState] = useState(initialState);
  const [errorMessage, setErrorMessage] = useState("");
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const closeModal = (event) => {
    event.preventDefault();
    setOpenModal(false);
    setState(initialState);
    props.handleCloseModal(false);
  };

  useEffect(() => {
    setOpenModal(props.openModal);
  }, [props.openModal]);

  useEffect(() => {
    if (userSlice.createUserError) {
      setIsErrorOpen(true);
      setErrorMessage(userSlice.createUserError);
      dispatch(resetCreateUserError());
    }
  }, [userSlice.createUserError]);

  useEffect(() => {
    if (userSlice.createUser) {
      dispatch(getAllUserAccounts());
      setOpenModal(false);
      setState(initialState);
    }
  }, [userSlice.createUser]);

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handlePermissionChange = (event) => {
    const {
      target: { value },
    } = event;
    setState({ ...state, permissions: typeof value === "string" ? value.split(",") : value });
  };

  const handleRoleChange = (event) => {
    setState({ ...state, role: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const data = {
      first_name: state.firstName,
      last_name: state.lastName,
      email: state.email,
      phone_number: state.phoneNumber,
      user_name: state.userName,
      password: state.password,
      role: state.role,
      permissions: state.permissions,
    };

    dispatch(createUserAccount(data));
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsErrorOpen(false);
    setErrorMessage("");
  };

  return (
    <Box>
      <Modal open={openModal} onClose={closeModal} hideBackdrop>
        <Box sx={{ ...style }}>
          <Typography variant="h6">Create New User</Typography>

          <Box sx={{ mt: 2 }}>
            <TextField
              label="First Name"
              variant="outlined"
              onChange={onChange}
              name="firstName"
              fullWidth
              style={{ marginBottom: 10 }}
              // error={state.is_user_name_error}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              onChange={onChange}
              name="lastName"
              fullWidth
              style={{ marginBottom: 10 }}
              // error={state.is_user_name_error}
            />

            <TextField
              label="Email"
              variant="outlined"
              onChange={onChange}
              name="email"
              fullWidth
              style={{ marginBottom: 10 }}
              // error={state.is_user_name_error}
            />

            <TextField
              label="Phone number"
              variant="outlined"
              onChange={onChange}
              name="phoneNumber"
              fullWidth
              style={{ marginBottom: 10 }}
              // error={state.is_user_name_error}
            />

            <TextField
              label="User Name"
              variant="outlined"
              onChange={onChange}
              name="userName"
              fullWidth
              style={{ marginBottom: 10 }}
              // error={state.is_user_name_error}
            />

            <TextField
              label="Password"
              variant="outlined"
              onChange={onChange}
              type="password"
              name="password"
              fullWidth
              style={{ marginBottom: 10 }}
              // error={state.is_user_name_error}
            />

            <FormControl fullWidth style={{ marginBottom: 10 }}>
              <InputLabel id="demo-simple-select-label">User Role</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={state.role}
                label="User Role"
                onChange={handleRoleChange}
              >
                <MenuItem value="worker">Worker</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth style={{ marginBottom: 10 }}>
              <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={state.permissions}
                onChange={handlePermissionChange}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {names.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={state.permissions.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={closeModal} variant="outlined" style={{ marginRight: 10 }}>
              Close
            </Button>
            <Button onClick={onSubmit} variant="contained">
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
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
  );
};

export default CreateAccount;
