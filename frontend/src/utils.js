export const getError = (error) => {
  /* responsible for handling all error output text formations,
  functions to export errors from native JavaScript and Axios which embed errors in different object structures */
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};
