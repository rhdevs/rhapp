import React from 'react'
import styled from 'styled-components'
import 'antd/dist/antd.css'
import NotFoundCatImg from '../../../assets/notFound.svg'
import { useHistory } from 'react-router-dom'
import { PATHS } from '../../Routes'
import { Button } from 'antd'

const MainContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #fafaf4;
  text-align: center;
`

export default function InvalidToken() {
  const history = useHistory()

  return (
    <MainContainer>
      <img src={NotFoundCatImg} />
      <h1>Token is invalid or has expired, please request for a new one.</h1>
      <Button
        type="default"
        shape="round"
        size="large"
        block
        onClick={() => {
          history.push(PATHS.FORGET_PASSWORD_PAGE)
        }}
      >
        Forget Password
      </Button>
    </MainContainer>
  )
}
