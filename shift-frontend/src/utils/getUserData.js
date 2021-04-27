const getUserData = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  if (!userData) {
    return null;
  }
  return userData;
};

export default getUserData;
