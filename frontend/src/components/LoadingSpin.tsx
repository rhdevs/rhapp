import React from 'react'
import styled from 'styled-components'
import loadingdog from '../assets/loading_dog.gif'

const Spinner = styled.div`
  text-align: center;
  padding: 23px;
`

function LoadingSpin() {
  return (
    <Spinner>
      <img src={loadingdog} alt="loading..." width="250" />
    </Spinner>
  )
}

export default LoadingSpin
