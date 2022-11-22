import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("Authentication");
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

const initialState = {
  loading: false,
  createUser: null,
  userAccount: {},
  userAccounts: [],
  authToken: "",
  fileUpload: null,
  userFiles: [],
  message: null,
  messages: [],
  errorMessage: "",
  uploadError: null,
  downloadError: null,
  messageError: null,
  createUserError: null,
};

export const createUserAccount = createAsyncThunk(
  "user/createUserAccount",
  async (userInfo, { rejectWithValue }) => {
    try {
      return await axios.post(`${process.env.REACT_APP_SERVER_URL}/user`, userInfo);
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const loginUserAccount = createAsyncThunk(
  "user/loginUserAccount",
  async (credentials, { rejectWithValue }) => {
    try {
      return await axios.post(`${process.env.REACT_APP_SERVER_URL}/login`, credentials);
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const getUserAccount = createAsyncThunk(
  "user/getUserAccount",
  async (_, { rejectWithValue }) => {
    try {
      return await axios.get(`${process.env.REACT_APP_SERVER_URL}/user`);
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const getAllUserAccounts = createAsyncThunk(
  "user/getAllUserAccounts",
  async (_, { rejectWithValue }) => {
    try {
      return await axios.get(`${process.env.REACT_APP_SERVER_URL}/users`);
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const uploadFile = createAsyncThunk("user/uploadFile", async (file, { rejectWithValue }) => {
  try {
    return await axios.post(`${process.env.REACT_APP_SERVER_URL}/upload`, file);
  } catch (error) {
    return rejectWithValue(error.response);
  }
});

export const downloadFile = createAsyncThunk(
  "user/downloadFile",
  async (fileId, { rejectWithValue }) => {
    try {
      return await axios.get(`${process.env.REACT_APP_SERVER_URL}/download/${fileId}`, {
        responseType: "stream",
      });
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const getUserFiles = createAsyncThunk(
  "user/getUserFiles",
  async (_, { rejectWithValue }) => {
    try {
      return await axios.get(`${process.env.REACT_APP_SERVER_URL}/files`);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveMessage = createAsyncThunk(
  "user/saveMessage",
  async (message, { rejectWithValue }) => {
    try {
      return await axios.post(`${process.env.REACT_APP_SERVER_URL}/message`, message);
    } catch (error) {
      return rejectWithValue(error.response);
    }
  }
);

export const getMessages = createAsyncThunk("user/getMessages", async (_, { rejectWithValue }) => {
  try {
    return await axios.get(`${process.env.REACT_APP_SERVER_URL}/messages`);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    resetMessageError(state) {
      state.messageError = null;
    },

    resetUploadError(state) {
      state.uploadError = null;
    },

    resetCreateUserError(state) {
      state.createUserError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login account
      .addCase(loginUserAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUserAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.authToken = action.payload.data.token;
        localStorage.setItem("Authentication", state.authToken);
        localStorage.setItem("Role", action.payload.data.role);
        window.location = "/me";
      })
      .addCase(loginUserAccount.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload.data.message;
      })
      // create account
      .addCase(createUserAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUserAccount.fulfilled, (state, action) => {
        state.createUser = action.payload.data;
        state.loading = false;
      })
      .addCase(createUserAccount.rejected, (state, action) => {
        if (action.payload && action.payload.data && action.payload.data.code === 401) {
          localStorage.removeItem("Authentication");
          window.location = "/";
        }
        if (action.payload.data.info) {
          state.createUserError = action.payload.data.info;
        }
        if (action.payload.data.message) {
          state.createUserError = action.payload.data.message;
        }
        state.loading = false;
      })
      // get user account
      .addCase(getUserAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.userAccount = action.payload.data.user;
      })
      .addCase(getUserAccount.rejected, (state, action) => {
        if (action.payload && action.payload.data && action.payload.data.code === 401) {
          localStorage.removeItem("Authentication");
          window.location = "/";
        }
        state.loading = false;
      })
      // get all user accounts
      .addCase(getAllUserAccounts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUserAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.userAccounts = action.payload.data.users;
      })
      .addCase(getAllUserAccounts.rejected, (state, action) => {
        if (action.payload && action.payload.data && action.payload.data.code === 401) {
          localStorage.removeItem("Authentication");
          window.location = "/";
        }
        state.loading = false;
      })
      // upload file
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.fileUpload = action.payload.data;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        if (action.payload && action.payload.data && action.payload.data.code === 401) {
          localStorage.removeItem("Authentication");
          window.location = "/";
        }
        state.uploadError = action.payload.data.message;
        state.loading = false;
      })
      // download file
      .addCase(downloadFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(downloadFile.fulfilled, (state, action) => {
        state.loading = false;
        const url = window.URL.createObjectURL(new Blob([action.payload.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "fileName.pdf");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .addCase(downloadFile.rejected, (state, action) => {
        state.loading = false;
        state.downloadError = action.payload.data.message;
      })
      // get user files
      .addCase(getUserFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.userFiles = action.payload.data.files;
      })
      .addCase(getUserFiles.rejected, (state, action) => {
        if (action.payload && action.payload.data && action.payload.data.code === 401) {
          localStorage.removeItem("Authentication");
          window.location = "/";
        }
        state.loading = false;
      })
      // save message
      .addCase(saveMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveMessage.fulfilled, (state, action) => {
        state.message = action.payload.data;
      })
      .addCase(saveMessage.rejected, (state, action) => {
        if (action.payload && action.payload.data && action.payload.data.code === 401) {
          localStorage.removeItem("Authentication");
          window.location = "/";
        }
        if (action.payload.data.message) {
          state.messageError = action.payload.data.message;
        }
        if (action.payload.data.info) {
          state.messageError = action.payload.data.info;
        }
        state.loading = false;
      })
      // get messages
      .addCase(getMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.data.messages;
      })
      .addCase(getMessages.rejected, (state, action) => {
        if (action.payload && action.payload.data && action.payload.data.code === 401) {
          localStorage.removeItem("Authentication");
          window.location = "/";
        }
        state.loading = false;
      });
  },
});

export const { resetMessageError, resetUploadError, resetCreateUserError } = userSlice.actions;

export default userSlice.reducer;
