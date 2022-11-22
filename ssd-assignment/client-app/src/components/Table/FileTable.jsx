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

function createData(fileName, fileSize, status, createdAt, updatedAt, createdBy, updatedBy) {
  return { fileName, fileSize, status, createdAt, updatedAt, createdBy, updatedBy };
}

const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

function niceBytes(x) {
  let l = 0,
    n = parseInt(x, 10) || 0;

  while (n >= 1024 && ++l) {
    n = n / 1024;
  }

  return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
}

export default function BasicTable(props) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (props.userFiles && props.userFiles.length > 0) {
      let files = [];
      for (let file of props.userFiles) {
        files.push(
          createData(
            file.original_name,
            niceBytes(file.file_size),
            file.status,
            moment(file.createdAt).format("lll"),
            moment(file.updatedAt).format("lll"),
            file.meta_data.createdBy.user_name,
            file.meta_data.updatedBy.user_name
          )
        );
      }

      setRows(files);
    }
  }, [props.userFiles]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table" size="medium">
        <TableHead>
          <TableRow>
            <TableCell width="10%">File Name</TableCell>
            <TableCell width="5%" align="right">
              Size
            </TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Created At</TableCell>
            <TableCell align="right">Updated At</TableCell>
            <TableCell align="right">Created</TableCell>
            <TableCell align="right">Updated</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.fileName} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell width="10%">{row.fileName}</TableCell>
              <TableCell width="5%" align="right">
                {row.fileSize}
              </TableCell>
              <TableCell align="right">{row.status}</TableCell>
              <TableCell align="right">{row.createdAt}</TableCell>
              <TableCell align="right">{row.updatedAt}</TableCell>
              <TableCell align="right">{row.createdBy}</TableCell>
              <TableCell align="right">{row.updatedBy}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
