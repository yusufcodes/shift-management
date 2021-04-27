const axios = require("axios");

let instance = axios.create({
  baseURL: " http://localhost:5000",
  timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
});

export const getCurrentShifts = async (token, month = false, week = false) => {
  let response;
  let url = "/api/shift/current";

  try {
    response = await instance({
      method: "get",
      url: url,
      timeout: 1000 * 5, // Wait for 5 seconds
      headers: {
        "X-Authorization": token,
      },
    });
    console.log(response);
  } catch (error) {
    if (!error.response) {
      console.error(error);
    } else {
      console.error(error.response.data.message);
    }
  }
  return response;
};

export const getUsers = async () => {
  let response;
  try {
    response = await instance({
      method: "get",
      url: "/api/user",
    });
    console.log(response);
  } catch (error) {
    if (!error.response) {
      console.error(error);
    } else {
      console.error(error.response.data.message);
    }
  }
  return response;
};

export const getShiftsByUserId = async (token, userId) => {
  let response;
  try {
    response = await instance({
      method: "get",
      url: `/api/shift/user/${userId}`,
      headers: {
        "X-Authorization": token,
      },
    });
    console.log(response);
  } catch (error) {
    if (!error.response) {
      console.error(error);
    } else {
      console.error(error.response.data.message);
    }
  }
  return response;
};

export const getAllShifts = async (token) => {
  let response;
  try {
    response = await instance({
      method: "get",
      url: `/api/shift/all`,
      headers: {
        "X-Authorization": token,
      },
    });
    console.log(response);
  } catch (error) {
    if (!error.response) {
      console.error(error);
    } else {
      console.error(error.response.data.message);
    }
  }
  return response;
};

export const deleteShift = async (token, shiftId) => {
  let response;
  try {
    response = await instance({
      method: "delete",
      url: `/api/shift/${shiftId}`,
      headers: {
        "X-Authorization": token,
      },
    });
    console.log(response);
  } catch (error) {
    if (!error.response) {
      console.error(error);
    } else {
      console.error(error.response.data.message);
    }
  }
  return response;
};

export const updateShift = async (token, shiftId, starttime, endtime) => {
  let response;
  try {
    response = await instance({
      method: "patch",
      url: `/api/shift/${shiftId}`,
      headers: {
        "X-Authorization": token,
      },
      data: {
        starttime,
        endtime,
      },
    });
    console.log(response);
  } catch (error) {
    if (!error.response) {
      console.error(error);
    } else {
      console.error(error.response.data.message);
    }
  }
  return response;
};

export const updateUserDetails = async (
  userId,
  token,
  email = null,
  currentPassword = null,
  newPassword = null
) => {
  let response;
  try {
    response = await instance({
      method: "patch",
      url: `/api/user/update/${userId}`,
      headers: {
        "X-Authorization": token,
      },
      data: {
        email,
        currentPassword,
        newPassword,
      },
    });
    console.log(response);
  } catch (error) {
    if (!error.response) {
      console.error(error);
    } else {
      console.error(error.response.data.message);
    }
  }
  return response;
};

export const addShift = async (token, employeeId, starttime, endtime) => {
  let response;
  try {
    response = await instance({
      method: "post",
      url: `/api/shift/`,
      headers: {
        "X-Authorization": token,
      },
      data: {
        starttime,
        endtime,
        employeeId,
      },
    });
    console.log(response);
  } catch (error) {
    if (!error.response) {
      console.error(error);
    } else {
      console.error(error.response.data.message);
    }
  }
  return response;
};

export const login = async (email, password) => {
  let response;

  try {
    response = await instance({
      method: "post",
      url: "/api/user/login",
      data: {
        email,
        password,
      },
    });
  } catch (error) {
    if (error.response) {
      // client received an error response (5xx, 4xx)
      console.log(error.response);
      return error.response;
    } else if (error.request) {
      // client never received a response, or request never left
      console.log(error.request);
    } else {
      console.log(error);
      // anything else
    }
    // console.log("login: catch block running...");
    // console.log("error object: ");
    // if (!error.response) {
    //   console.error(error);
    //   return error;
    // } else {
    //   console.error(error.response.data.message);
    //   return error;
    // }
  }
  return response;
};

/* TEMPLATE */
/*

GET

const response = await instance({
  method: 'get',
  url: 'http://bit.ly/2mTM3nY',
})

POST

const response = await instance({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
});

*/
