const axios = require("axios");

let instance = axios.create({
  baseURL: " http://localhost:5000",
  timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
});

export const getAllUsers = async () => {
  let response;
  try {
    response = await instance({
      method: "get",
      url: "/api/user",
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
  return response;
};

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
    console.error(error);
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
    console.error(error.response.data.message);
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
