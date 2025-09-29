export function logRequest(req: any, servedVersion: string) {
  const meta = {
    timestamp: new Date().toISOString(),
    ip: req.ip || req.connection?.remoteAddress,
    path: req.path,
    method: req.method,
    headers: {
      "x-version": req.headers["x-version"]
    },
    servedVersion
  };
  console.log(JSON.stringify(meta));
}
