export const success = (res, data, message = "Success", status = 200) => {
  res.status(status).json({
    success: true,
    message,
    data
  });
};

export const error = (res, message = "Internal Server Error", status = 500) => {
  res.status(status).json({
    success: false,
    message
  });
};
