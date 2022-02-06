import withJoi from "next-joi";

export default withJoi({
  onValidationError: (req, res, error) => {
    console.info("validation error", { url: req.url, error });
    res.status(400).json({ error });
  },
});
