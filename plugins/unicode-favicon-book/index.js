
const defaultIcon = "🕮";

function favicon (icon) {
  icon = icon || defaultIcon
  return `
<svg 
  xmlns="http://www.w3.org/2000/svg" 
  viewBox="0 0 100 100"
>
  <text y=".9em" font-size="90">${icon}</text>
</svg>
`
}

module.exports = function (owndir) {
  owndir.O.routes.push(
    ["/favicon.ico",
      ["get", async function (req, res, next) {
        res.setHeader("content-type", "image/svg+xml")
        res.send(favicon(this.favicon))
      }]
    ]
  )
}

