var express = require('express');
var router = express.Router();
var slackBot = require('slack-bot')(process.env.URL);

// Name map to send DMs to people about build failures
var nameMap = {
  alexmingoia: '@alex',
  bradfordh: '@bradfordh',
  cannoneyed: '@andycoenen',
  dsernst: '@david',
  HankMcCoy: '@thomas',
  jessepedler: '@jessepedler',
  joebalancio: '@joe',
  jontewks: '@jon'
};

router.post('/', function(req, res) {
  // Cheap security
  if (req.query.secret !== process.env.SECRET) {
    res.sendStatus(404).end();
  } else if (['waiting', 'testing', 'success'].indexOf(req.body.build.status) === -1) {
    var payload;

    if (req.body.build.branch === 'master' || req.body.build.branch === 'dev') {
      payload = {
        channel: '#hackers',
        username: 'Codeship',
        icon_emoji: ':codeship:',
        attachments: [{
          fallback: 'Alert',
          color: 'danger',
          title: 'Build Failed',
          title_link: req.body.build.build_url,
          fields: [{
            title: 'Branch',
            value: req.body.build.branch,
            short: 'true'
          }, {
            title: 'Shame upon',
            value: '<' + req.body.build.commit_url + '|' + req.body.build.committer + '>',
            short: 'true'
          }]
        }]
      };
    } else {
      payload = {
        channel: nameMap[req.body.build.committer],
        username: 'Codeship',
        icon_emoji: ':codeship:',
        attachments: [{
          fallback: 'Alert',
          color: 'danger',
          title: 'Build Failed',
          title_link: req.body.build.build_url,
          fields: [{
            title: 'Branch',
            value: req.body.build.branch,
            short: 'true'
          }, {
            title: 'This is the breaking commit',
            value: '<' + req.body.build.commit_url + '|Commit>',
            short: 'true'
          }]
        }]
      };
    }

    slackBot.send(payload, function() {
      res.sendStatus(201).end();
    });
  } else {
    res.sendStatus(201).end();
  }
});

module.exports = router;
