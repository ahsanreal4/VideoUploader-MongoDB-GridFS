const asyncJsonController = (fn) => (request, response, next) => {
  Promise.resolve(fn(request))
    .then((result) => response.json(result))
    .catch(next);
};
module.exports = asyncJsonController;
