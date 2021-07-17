import { createGlobalStyle } from 'styled-components'
import Inter from './assets/Inter/Inter-VariableFont_slnt,wght.ttf'

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Inter';
    src: url(${Inter}) format('truetype');
    font-weight: 125 950;
    font-stretch: 100%;
    font-style: normal;
  }

  body {
    font-family: Inter;
    background-color: #fafaf4 !important;
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
