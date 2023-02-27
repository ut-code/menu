self.addEventListener("fetch", function (e) {
  console.log(e.request.url)
})
