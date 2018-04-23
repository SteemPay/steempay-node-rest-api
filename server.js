const express = require('express');
const app = express();
const steem = require('steem');
const coinmarketcap = require('coinmarketcap-api')
const cmc = new coinmarketcap()

//set steem api server
steem.api.setOptions({url: 'https://api.steemit.com'});

//prettify json
app.set('json spaces', 2)

//ignore favicon
app.use(function(req, res, next) {
  if (req.originalUrl === '/favicon.ico') {
    res.status(204).json({
      nope: true
    });
  } else {
    next();
  }
});

//access control allow headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//docs at '/'
app.get('/', function(req, res) {
  res.sendFile('docs/index.html', {
    root: __dirname
  });
});

//get user
app.get('/:username', function(req, res) {
  const username = req.params.username;
  console.log(`get user: ${username}`);

  steem.api.getAccounts([username], function(err, result) {
    if (result[0] !== undefined) {
      let output = {
        balance_sbd: result[0].sbd_balance,
        balance_steem: result[0].balance
      };

      try {
        const metadata = JSON.parse(result[0].json_metadata);

        output.avatar = metadata.profile.profile_image || null;
        output.location = metadata.profile.location || null;
      } catch (error) {
        console.log(error);
      }
      res.json(output);
    } else {
      res.send(false);
    }
  });
})

//get user public keys
app.get('/:username/pub', function(req, res) {
  const username = req.params.username;
  console.log(`get ${username}'s pub keys`);

  steem.api.getAccounts([username], function(err, result) {
    if (result[0] !== undefined) {
      res.json({
        active_pub: result[0].active.key_auths[0][0],
        owner_pub: result[0].owner.key_auths[0][0],
        memo_pub: result[0].memo_key
      });
    } else {
      res.send(false);
    }
  });
})

//get user history - optional limit up to 10000 todo: add a "from" param, to paginate data
app.get('/:username/history/:limit?', function(req, res) {
  const username = req.params.username;
  const limit = req.params.limit;
  console.log(`get ${username}'s history`);

  if (!limit || limit > 10000) {
    steem.api.getAccountHistory(username, -1, 30, function(err, result) {
      const output = [];

      if (err) {
        output.push(`${err}`);
        console.log(err);
      } else {
        const transfers = result.filter(element => element[1].op[0] === "transfer");

        for (var i = 0; i < transfers.length; i++) {
          let object = {
            tx_id: transfers[i][1].trx_id,
            timestamp: transfers[i][1].timestamp,
            details: transfers[i][1].op[1]
          };
          output.push(object);
        }
      }
      res.json(output.reverse());
    });
  } else {
    steem.api.getAccountHistory(username, -1, limit, function(err, result) {
      const output = [];

      if (err) {
        output.push(`${err}`);
        console.log(err);
      } else {
        const transfers = result.filter(element => element[1].op[0] === "transfer");

        for (var i = 0; i < transfers.length; i++) {
          let object = {
            tx_id: transfers[i][1].trx_id,
            timestamp: transfers[i][1].timestamp,
            details: transfers[i][1].op[1]
          };
          output.push(object);
        }
      }
      res.json(output.reverse());
    });
  }
})

//get user account values
app.get('/rates/:token', function(req, res) {
  const token = req.params.token;
  const output = {};
  console.log(`get ${token} exchange rate`);

  cmc.getTicker({
    currency: token
  }).then(function(object) {
    output.price_usd = object[0].price_usd;
    res.json(output);
  }).catch(console.error);
})

//set server
const server = app.listen(8081, function() {
  const port = server.address().port;
  console.log(`SteemPay API v0.0.1 running on port ${port}`);

});
