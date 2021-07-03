import { createGlobalStyle } from 'styled-components'

// TODO: Fix this error (not changed bc it will mess up our current ui since different weights are not imported)
const GlobalStyle = createGlobalStyle`
  body {
    color: #fafaf4
    font-family: Inter;
    background-color: #fafaf4;
  }

  html {
    --antd-wave-shadow-color: rgb(222, 95, 76) !important;
  }

  .ant-select-selector {
    border-color: rgb(222, 95, 76) !important;
  }

  .ant-input:hover {
    border-color: rgb(222, 95, 76) !important;
  }

  .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
    border-color: rgb(222, 95, 76) !important;
  }

  .ant-btn-dashed:hover, .ant-btn-dashed:focus {
    color: rgb(222, 95, 76) !important;
    border-color: rgb(222, 95, 76) !important;
`

export default GlobalStyle
