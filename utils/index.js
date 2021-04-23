document.addEventListener("DOMContentLoaded", function() {
  let string = `
  <svg>
    <symbol id="icon-bold-left" viewBox="0 0 1024 1024">
      <path d="M762.9 52.1c-30.4-31.3-79.7-31.3-110.2 0L261 455.3c-30.4 31.3-30.4 82.1 0 113.4l391.7 403.2c30.5 31.3 79.8 31.3 110.2 0 30.4-31.3 30.4-82.1 0-113.4L426.3 512l336.6-346.5c30.5-31.3 30.5-82.1 0-113.4z"  ></path>
    </symbol>
  </svg>
  `

  let div = (document.createElement("div")).innerHTML = string
  string = null

  let svg = div.getElementsByTagName("svg")[0]
  svg.setAttribute("aria-hidden","true")

  svg.style.position = "absolute"
  svg.style.width = 0
  svg.style.height = 0,
  svg.style.overflow = "hidden"

  let body = document.body

  body.firstChild ? svg = body.firstChild : body.firstChild.parentNode.insertBefore(div, svg)
})






