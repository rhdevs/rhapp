import React, { useState } from 'react'

import { Menu } from 'antd'
import { PlusOutlined, SearchOutlined, ShareAltOutlined } from '@ant-design/icons'

import styled from 'styled-components'
import TopNavBar from '../../components/Mobile/TopNavBar'
import Tags from '../../components/Mobile/Tags'
import MenuDropdown from '../../components/Mobile/MenuDropdown'

const TimetableContainer = styled.div`
  height: 45vh;
`

const SmallContainer = styled.div`
  display: flex;
`

const GroupContainer = styled.div`
  height: 18vh;
  padding-left: 20px;
  width: 90vw;
`

const Background = styled.div`
  background-color: #fafaf4;
  height: 100vh;
  width: 100vw;
`

const BottomNavBar = styled.div`
  height: 64px;
`

const { SubMenu } = Menu

export default function Schedule() {
  const rightIcon = (
    <MenuDropdown
      menuItem={
        <>
          <SubMenu
            key="sub1"
            icon={<ShareAltOutlined />}
            title="Share"
            onTitleClick={() => {
              console.log('share')
            }}
          >
            <Menu.Item
              key="1"
              onClick={() => {
                console.log('menu.item')
              }}
            >
              Share with...
            </Menu.Item>
            <Menu.Item key="2">Save as png</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<PlusOutlined />} title="Add Events">
            <Menu.Item key="3">Import an ICalander File (.ics)</Menu.Item>
            <Menu.Item key="4">Add an event</Menu.Item>
          </SubMenu>
          <Menu.Item
            key="5"
            icon={<SearchOutlined />}
            onClick={() => {
              console.log('last menu.item')
            }}
          >
            Events
          </Menu.Item>
        </>
      }
    />
  )

  return (
    <Background>
      <TopNavBar title={'Timetable'} leftIcon={true} rightComponent={rightIcon} />

      <TimetableContainer>
        <h1>TIMETABLE</h1>
      </TimetableContainer>
      <GroupContainer>
        <SmallContainer>
          <h1 style={{ color: 'black', padding: '5px 15px 0px 0px', margin: '0px', fontSize: '24px' }}>Friends</h1>
        </SmallContainer>
        <Tags
          options={[
            'friend1',
            'friend2',
            'friend3',
            'friend4',
            'friend5',
            'friend6',
            'friend1',
            'friend2',
            'friend1',
            'friend2',
            'friend1',
            'friend2',
          ]}
        />
      </GroupContainer>
      <GroupContainer>
        <SmallContainer>
          <h1 style={{ color: 'black', padding: '5px 15px 0px 0px', margin: '0px', fontSize: '24px' }}>Groups</h1>
        </SmallContainer>
        <Tags options={['Group1', 'Group2']} />
      </GroupContainer>
      <BottomNavBar></BottomNavBar>
    </Background>
  )
}
