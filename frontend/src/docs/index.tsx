import React from 'react'
import { useHistory } from 'react-router-dom'

import styled from 'styled-components'
import { PATHS } from '../routes/Routes'

const MainContainer = styled.div`
  display: flex;
  min-height: 100vh;
  height: 100%;
  width: 100vw;
`

const Button = styled.button`
  margin: auto;
`

const Docs = () => {
  const history = useHistory()
  return (
    <MainContainer>
      <Button onClick={() => history.push(`${PATHS.DOCS_SUPPER}/actions`)}>supper actions</Button>
    </MainContainer>
  )
}

export default Docs
