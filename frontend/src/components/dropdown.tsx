/* eslint-disable prettier/prettier */
import React from 'react'
import 'antd/dist/antd.css'
import { Menu, Dropdown, Button, message, Space } from 'antd'
import { DownOutlined, UserOutlined } from '@ant-design/icons'

function handleMenuClick() {
  message.info('Click on menu item.')
  console.log('click')
}

function DropDownBar({ menutitle, menuarray }: { menutitle: string; menuarray: string[] }) {
  const menu = (
    <Menu onClick={handleMenuClick}>
      {menuarray.map((person, index) => (
        <Menu.Item key={index} icon={<UserOutlined />}>
          {person}
        </Menu.Item>
      ))}
    </Menu>
  )
  return (
    <Space wrap>
      <Dropdown overlay={menu}>
        <Button>
          {menutitle} <DownOutlined />
        </Button>
      </Dropdown>
    </Space>
  )
}

export default DropDownBar
