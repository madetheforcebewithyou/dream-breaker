export default (req) => () => {
  const { host } = req.headers;

  return {
    host,
  };
};
