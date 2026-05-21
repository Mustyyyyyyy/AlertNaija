/* express + helmet + rate-limit */
app.use((req, res, next) => {
  res.removeHeader('X-Powered-By');
  next();
});

module.exports = (req, res, next) => {
  // Rate-limit headers already handled by express-rate-limit
  next();
};
