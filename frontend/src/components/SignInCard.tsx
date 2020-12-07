import React from 'react'
import styled from 'styled-components'

import { Button, Input } from 'antd'
import 'antd/dist/antd.css'

const CardContainer = styled.div`
  height: 30%;
  width: 50%;
  margin: 0 auto;
  background-color: #fafaf4;
`

function SignInCard() {
  return (
    <CardContainer>
      <Input placeholder="Username"></Input> <br />
      <br />
      <Input placeholder="Password"></Input>
      <br /> <br />
      <Button type="primary" block>
        Sign in
      </Button>
    </CardContainer>
  )
}

export default SignInCard
