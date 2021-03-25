const axios = require("axios");

let instance = axios.create({
  baseURL: " http://localhost:5000",
  timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
});

export const getCurrentShifts = async (token) => {
  let response;
  try {
    response = await instance({
      method: "get",
      url: "/api/shift/current",
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
    if (!error.response) {
      console.error(error);
    } else {
      console.error(error.response.data.message);
    }
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
