const withManagerMiddleware = () => async (req, res, next) => {
  try {
    if (req.user?.isManager) {
      return next();
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
  return res.status(403).json({ error: "Not authorized" });
};

export default withManagerMiddleware;
