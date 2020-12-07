import React from 'react'
import { Button } from 'antd'
import styled from 'styled-components'
import { useRouteMatch, Link } from 'react-router-dom'

import SignUpCard from '../../../components/SignUpCard'
import NavBar from '../../../components/NavBar'
import { PATHS } from '../../Routes'

const SignUpContainer = styled.div`
  height: 100%;
  width: 50%;
  background-color: #f2f7f7;
  margin: 0 auto;
`

export default class Signup extends React.Component {
  render() {
    return (
      <>
        <NavBar text="Sign up" />
        <SignUpContainer>
          <SignUpCard />
          <h1>Have an account?</h1>
          <Button type="primary" block>
            <Link to={PATHS.LOGIN_PAGE}>login </Link>
          </Button>
        </SignUpContainer>
      </>
    )
  }
}
