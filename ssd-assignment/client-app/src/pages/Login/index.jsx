import { Fingerprint } from "@mui/icons-material";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUserAccount } from "../../redux/userSlice";

const Login = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    user_name: "",
    password: "",
    is_user_name_error: false,
    is_password_error: false,
  });

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const validation = validateForm();
    if (!validation.is_password_error && !validation.is_user_name_error) {
      // submit
      const { user_name, password } = state;
      dispatch(loginUserAccount({ user_name, password }));
      setState({
        ...state,
        is_user_name_error: validation.is_user_name_error,
        is_password_error: validation.is_password_error,
      });
    } else {
      setState({
        ...state,
        is_user_name_error: validation.is_user_name_error,
        is_password_error: validation.is_password_error,
      });
      return;
    }
  };

  const validateForm = () => {
    const { user_name, password } = state;
    const data = {
      is_user_name_error: user_name && user_name.trim().length > 0 ? false : true,
      is_password_error: password && password.trim().length > 0 ? false : true,
    };

    return data;
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", marginTop: 5 }}>
      <Stack spacing={4}>
        <Typography variant="h4">Login</Typography>
        <TextField
          label="Username"
          variant="outlined"
          onChange={onChange}
          name="user_name"
          error={state.is_user_name_error}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          onChange={onChange}
          name="password"
          error={state.is_password_error}
        />
        <Button variant="contained" onClick={onSubmit} startIcon={<Fingerprint />}>
          Login
        </Button>
      </Stack>
    </Box>
  );
};

export default Login;
