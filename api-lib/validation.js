import withJoi from "next-joi";

export default withJoi({
  onValidationError: (req, res, error) => {
    console.info("validation error", {
      url: req.url,
      error: error.details.map((d) => d.message).join("\n"),
    });
    res
      .status(400)
      .json({ error: error.details.map((d) => d.message).join("\n") });
  },
});
