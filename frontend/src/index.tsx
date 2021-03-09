import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import LocalServiceWorkerRegister from './registerServiceWorker'

ReactDOM.render(<App />, document.getElementById('root'))

LocalServiceWorkerRegister()
