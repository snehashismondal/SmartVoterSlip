export function cacheControl(maxAgeSeconds = 0, isPrivate = true) {
  const visibility = isPrivate ? 'private' : 'public';
  return (_req, res, next) => {
    res.set('Cache-Control', `${visibility}, max-age=${maxAgeSeconds}, must-revalidate`);
    next();
  };
}

export function noCache(_req, res, next) {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  next();
}
