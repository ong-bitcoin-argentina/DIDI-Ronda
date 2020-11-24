const multiparty = require("multiparty");
const { ENABLE_SC_FEATURES } = process.env;

exports.SC_FEATURES = !!parseInt(ENABLE_SC_FEATURES, 10);

exports.asyncForEach = async (array, callback) => {
  for (let index = 0; index < array[0].length; index++) {
    await callback(array[0][index], index, array[0]);
  }
};

exports.parseValues = req => {
  let form = new multiparty.Form();
  const promise = new Promise(resolve => {
    let data = {};
    form.parse(req, async (err, fields, files) => {
      Object.keys(fields).forEach(function(name) {
        data.userId = fields[name][0];
      });
      Object.keys(files).forEach(function(name) {
        data.image = files[name][0];
      });

      return resolve(data);
    });
  });
  return promise;
};

exports.responseHandler = (res, result) => {
  return result && result.error
    ? res.status(500).jsonp({ error: result.error })
    : res.status(200).jsonp(result);
};
