import Module from "./hello3.js"
document
  .querySelector(".mybutton")

  .addEventListener("click", function () {
    Module().then((module) => {
      var result = module.ccall("myFunction", 1, null, null)
      console.log(result)
    })
  })
