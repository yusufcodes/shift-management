const axios = require("axios");

let instance = axios.create({
  baseURL: " http://localhost:5000",
  timeout: 1000,
  // Add authentication header here
  // headers: {'X-Custom-Header': 'foobar'}
});

const init = (token) => {
  instance = axios.create({
    baseURL: " http://localhost:5000",
    timeout: 1000,
    headers: { "X-Authorization": token },
  });
};

export const getAllUsers = async () => {
  try {
    const response = await instance({
      method: "get",
      url: "/api/user",
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};

export const login = async (email, password) => {
  try {
    const response = await instance({
      method: "post",
      url: "/api/user/login",
      data: {
        email,
        password,
      },
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error(error.response.data.message);
  }
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
