/* eslint-disable prettier/prettier */
import React from 'react'
import 'antd/dist/antd.css'
import { Menu, Dropdown, Button, message, Space } from 'antd'
import { DownOutlined, UserOutlined } from '@ant-design/icons'
import { title } from 'process'

function handleMenuClick() {
  message.info('Click on menu item.')
  console.log('click')
}

function DropDownBar({
  MenuTitle,
  MenuArray,
}: {
  MenuTitle: string
  MenuArray: string[]
}) {
  const menu = (

    
    
    <Menu onClick={handleMenuClick}>

{MenuArray.map((person, index) => (
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
          {MenuTitle} <DownOutlined />
        </Button>
      </Dropdown>
    </Space>
  )
}

export default DropDownBar
