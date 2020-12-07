import React from 'react'

import { Button, Input } from 'antd'
import 'antd/dist/antd.css'
import { Link } from 'react-router-dom'
import { PATHS } from '../routes/Routes'

function LoginCard() {
  return (
    <>
      <Input placeholder="Username"></Input> <br />
      <br />
      <Input placeholder="Password"></Input>
      <br /> <br />
      <Button type="primary" block>
        <Link to={PATHS.LANDING_PAGE}>Sign in</Link>
      </Button>
    </>
  )
}

export default LoginCard
