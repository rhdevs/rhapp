import React from 'react'
import styled from 'styled-components'

import { Button, Input, Dropdown, Menu, message } from 'antd'
import { DownOutlined, UserOutlined } from '@ant-design/icons'
import 'antd/dist/antd.css'

const CardContainer = styled.div`
  height: 30%;
  width: 50%;
  margin-left: 40%;
  background-color: #fafaf4;
`

function handleMenuClick() {
  message.info('Click on menu item.')
}

const menu = (
  <Menu onClick={handleMenuClick}>
    <Menu.Item key="1" icon={<UserOutlined />}>
      1st menu item
    </Menu.Item>
    <Menu.Item key="2" icon={<UserOutlined />}>
      2nd menu item
    </Menu.Item>
    <Menu.Item key="3" icon={<UserOutlined />}>
      3rd menu item
    </Menu.Item>
  </Menu>
)

function SignUpCard() {
  return (
    <CardContainer>
      <Input placeholder="Email"></Input>
      <br /> <br />
      <Input placeholder="Username"></Input> <br />
      <br />
      <Input placeholder="Password"></Input>
      <br /> <br />
      <Dropdown overlay={menu}>
        <Button>
          Button <DownOutlined />
        </Button>
      </Dropdown>
      <br /> <br />
      <Button type="primary" block>
        Sign in
      </Button>
    </CardContainer>
  )
}

export default SignUpCard
