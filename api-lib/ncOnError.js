export function onError(err, req, res) {
  console.error({ url: req.url, err: err.toString() });

  return res.status(500).end({ error: err.toString() });
}
