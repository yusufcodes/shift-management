class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); // Message property based to Error
    this.code = errorCode; // Add code property
  }
}

module.exports = HttpError;
