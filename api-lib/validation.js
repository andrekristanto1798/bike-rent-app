import withJoi from "next-joi";

export default withJoi({
  onValidationError: (_, res, error) => {
    res.status(400).json({ error });
  },
});
