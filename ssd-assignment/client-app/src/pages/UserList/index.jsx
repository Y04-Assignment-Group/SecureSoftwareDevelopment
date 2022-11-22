import { Box, Button, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserTable } from "../../components/Table";
import { getAllUserAccounts } from "../../redux/userSlice";
import CreateAccount from "../CreateAccount";

const UserList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userSlice = useSelector((state) => state.userSlice);
  const [userAccounts, setUserAccounts] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    dispatch(getAllUserAccounts());
  }, []);

  useEffect(() => {
    if (userSlice.userAccounts && userSlice.userAccounts.length > 0) {
      setUserAccounts(userSlice.userAccounts);
    }
  }, [userSlice.userAccounts]);

  const handleRedirect = () => {
    navigate("/me");
  };

  const handleOpenModal = (event) => {
    event.preventDefault();
    setOpenModal(true);
  };

  const handleCloseModal = (value) => {
    setOpenModal(value);
  };

  return (
    <Box sx={{ mt: 5 }}>
      <Grid continer spacing={2}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="outlined"
            size="small"
            color="secondary"
            style={{ marginRight: 10 }}
            onClick={handleRedirect}
          >
            Back
          </Button>
          <Button variant="outlined" size="small" onClick={handleOpenModal}>
            Add new User
          </Button>
        </Box>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}></Grid>
        <UserTable userAccounts={userAccounts} />
      </Grid>

      <CreateAccount openModal={openModal} handleCloseModal={handleCloseModal} />
    </Box>
  );
};

export default UserList;
