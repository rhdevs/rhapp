import { Button } from 'antd'
import React from 'react'
import { useRouteMatch, Link } from 'react-router-dom'
import styled from 'styled-components'

import NavBar from '../../../components/NavBar'
import LoginCard from '../../../components/LoginCard'
import { PATHS } from '../../Routes'

const LoginContainer = styled.div`
  height: 100%;
  width: 50%;
  background-color: #f2f7f7;
  margin: 0 auto;
`

export default class Login extends React.Component {
  render() {
    return (
      <>
        <NavBar text="Sign in" />
        <LoginContainer>
          <LoginCard />
          <h1>Do not have an account?</h1>
          <Button type="primary" block>
            <Link to={PATHS.SIGNUP_PAGE}>Sign Up </Link>
          </Button>
        </LoginContainer>
      </>
    )
  }
}
