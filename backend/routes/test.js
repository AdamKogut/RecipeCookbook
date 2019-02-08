var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  const resp = {
    message: "TEST SUCCESSFUL"
  };

  res.json(resp);
});

module.exports = router;