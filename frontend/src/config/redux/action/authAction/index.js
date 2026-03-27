import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post(`/login`, {
        email: user.email,
        password: user.password,
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      } else {
        return thunkAPI.rejectWithValue({ message: "token not provided" });
      }
      return thunkAPI.fulfillWithValue(response.data.token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      await clientServer.post("/register", {
        userName: user.userName,
        password: user.password,
        email: user.email,
        name: user.name,
      });
      // ✅ fulfillWithValue add karo — warna reducer mein fulfilled nahi aayega
      return thunkAPI.fulfillWithValue({ message: "Registered successfully" });
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async (_, thunkAPI) => {
    try {
      // ✅ token params se hata — interceptor handle karega
      const response = await clientServer.get("/get_user_and_profile");
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/get_all_users");
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const sendConnectionRequest = createAsyncThunk(
  "user/sendConnectionRequest",
  async (user, thunkAPI) => {
    try {
      // ✅ token hata — sirf connectionId chahiye
      const response = await clientServer.post("/user/send_connection_request", {
        connectionId: user.connectionId,
      });
      thunkAPI.dispatch(getConnectionRequest());
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const getConnectionRequest = createAsyncThunk(
  "user/getConnectionRequest",
  async (_, thunkAPI) => {
    try {
      // ✅ token params se hata
      const response = await clientServer.get("/user/getConnectionRequest");
      return thunkAPI.fulfillWithValue(response.data.connections);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const getMyConnectionsRequests = createAsyncThunk(
  "user/getMyConnectionsRequests",
  async (_, thunkAPI) => {
    try {
      // ✅ token params se hata
      const response = await clientServer.get("/user/user_connection_request");
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const AcceptConnection = createAsyncThunk(
  "user/AcceptConnection",
  async (user, thunkAPI) => {
    try {
      // ✅ token hata
      const response = await clientServer.post("/user/accept_connection_request", {
        requestId: user.connectionId,
        actionType: user.action,
      });
      thunkAPI.dispatch(getConnectionRequest());
      thunkAPI.dispatch(getMyConnectionsRequests());
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

