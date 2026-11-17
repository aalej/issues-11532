const { beforeSmsSent } = require("firebase-functions/v2/identity");

exports.authBlockingTest11532 = beforeSmsSent(() => {
  console.log("update this log 5")
});