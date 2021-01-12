import React from 'react'

import { PATHS } from '../routes/Routes'
import { Button, Input } from 'antd'
import 'antd/dist/antd.css'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

const AccountText = styled.text`
  margin-top: 10px;
  font-size: 21px;
  display: flex;
  justify-content: center;
`

function SignUpCard() {
  const history = useHistory()

  return (
    <>
      <Input placeholder="Email"></Input>
      <br /> <br />
      <Input placeholder="Username"></Input> <br />
      <br />
      <Input placeholder="Password"></Input>
      <br /> <br />
      <Button
        type="primary"
        block
        onClick={() => {
          history.push(PATHS.HOME_PAGE)
        }}
      >
        Sign Up
      </Button>
      <AccountText>Have an account?</AccountText>
      <Button
        type="primary"
        block
        onClick={() => {
          history.push(PATHS.LOGIN_PAGE)
        }}
      >
        Login
      </Button>
    </>
  )
}

export default SignUpCard
