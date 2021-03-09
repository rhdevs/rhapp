if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('service-worker.js').then(
      function (registration) {
        console.log('Service worker registration successful with scope: ', registration.scope)
      },
      function (err) {
        console.log('Service worker registration failed: ', err)
      },
    )
  })
}
