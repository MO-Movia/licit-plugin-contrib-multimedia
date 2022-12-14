// needed to mock this due to execute during loading
document.execCommand = document.execCommand || function execCommandMock() {};
global.document.createElement = (function (create) {
    return function () {
      const element = create.apply(this, arguments)
      
      if (element.tagName === 'IMG') {
        setTimeout(() => {
          element.onload(new Event('load'))
        }, 100)
      }
      return element
   }
  })(document.createElement)