const React = require('react');
const {resolve} = require('path');

// https://github.com/flexdinesh/browser-or-node/blob/master/src/index.js
const isServerSide = (
  typeof process !== "undefined" &&
  process.versions != null &&
  process.versions.node != null
);

const defaultFrame = function () {
  return <>
      <h1>OwnDir, react client-side rendering plugin</h1>
      <p>You are seeing this page because no frame function has been provided.</p>
  </>
}

module.exports = function (owndir) {
  if (isServerSide) {

    if (!owndir.frame) {
      owndir.frame = defaultFrame
    }

    owndir.O.routes.push(['*', ['get',
      function (req, res, next) {
        // hardcode this shit for now, we'll get back to it later
        res.sendFile(resolve(__dirname, 'index.html'))
      }
    ]])

  }
}

