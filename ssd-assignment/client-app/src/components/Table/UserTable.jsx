import { Chip } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import moment from "moment";
import * as React from "react";
import { useEffect, useState } from "react";

function createData(
  firstName,
  lastName,
  email,
  userName,
  role,
  phoneNumber,
  createdAt,
  updatedAt,
  createdBy,
  updatedBy,
  permissions
) {
  return {
    firstName,
    lastName,
    email,
    userName,
    role,
    phoneNumber,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
    permissions,
  };
}

export default function BasicTable(props) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (props.userAccounts && props.userAccounts.length > 0) {
      let users = [];
      for (let user of props.userAccounts) {
        let permissions = [];
        if (user.permissions && user.permissions.length > 0) {
          for (let permission of user.permissions) {
            permissions.push(permission);
          }
        }
        console.log(permissions);
        users.push(
          createData(
            user.first_name,
            user.last_name,
            user.email,
            user.user_name,
            user.role,
            user.phone_number,
            moment(user.createdAt).format("lll"),
            moment(user.updatedAt).format("lll"),
            user.meta_data.createdBy.user_name,
            user.meta_data.updatedBy.user_name,
            permissions
          )
        );
      }

      setRows(users);
    }
  }, [props.userAccounts]);

  return (
    <TableContainer component={Paper} style={{ width: "auto" }}>
      <Table aria-label="simple table" size="small" style={{ width: "max-content" }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Updated At</TableCell>
            <TableCell>Created By</TableCell>
            <TableCell>Updated By</TableCell>
            <TableCell>Permissions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.fileName} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell>
                {row.firstName} {row.lastName}
              </TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.userName}</TableCell>
              <TableCell>{row.role}</TableCell>
              <TableCell>{row.phoneNumber}</TableCell>
              <TableCell>{row.createdAt}</TableCell>
              <TableCell>{row.updatedAt}</TableCell>
              <TableCell>{row.createdBy}</TableCell>
              <TableCell>{row.updatedBy}</TableCell>
              <TableCell>
                {row.permissions &&
                  row.permissions.length > 0 &&
                  row.permissions.map((permission, index) => (
                    <Chip
                      label={permission}
                      key={index}
                      size="small"
                      style={{ marginRight: 5 }}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
