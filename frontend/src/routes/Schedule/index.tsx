import React from 'react'

import { Menu } from 'antd'
import { PlusOutlined, SearchOutlined, ShareAltOutlined } from '@ant-design/icons'

import styled from 'styled-components'
import TopNavBar from '../../components/Mobile/TopNavBar'
import Tags from '../../components/Mobile/Tags'
import MenuDropdown from '../../components/Mobile/MenuDropdown'
import { Link } from 'react-router-dom'

import EventCell from '../../components/timetable/EventCell'
import Timetable from '../../components/timetable/Timetable'

const TimetableMainContainer = styled.div`
  box-sizing: border-box;
`

const TimetableContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 0 15px;
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
  height: 100%;
  width: 100%;
`

const BottomNavBar = styled.div`
  height: 64px;
  background-color: #fafaf4;
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
            <Menu.Item key="1">
              <Link to={'/shareTimetable'}>Share with...</Link>
            </Menu.Item>

            <Menu.Item key="2">Save as png</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<PlusOutlined />} title="Add Events">
            <Menu.Item key="3">Import an ICalander File (.ics)</Menu.Item>
            <Menu.Item key="4">Add an event</Menu.Item>
          </SubMenu>
          <Menu.Item key="5" icon={<SearchOutlined />}>
            <Link to={'/eventList'}>Events</Link>
          </Menu.Item>
        </>
      }
    />
  )

  return (
    <Background>
      <TopNavBar title={'Timetable'} leftIcon={true} rightComponent={rightIcon} />
      <TimetableMainContainer>
        <TimetableContainer>
          <Timetable
            monChildren={
              <>
                <EventCell
                  numberOfHours={1}
                  eventTitle={'title title title title title title title title title title title title '}
                  eventDescription={
                    'description description description description description description description description description description '
                  }
                ></EventCell>
                {/* <EventCell
                  numberOfHours={1}
                  eventTitle={'title title title title title title title title title title title title '}
                  eventDescription={
                    'description description description description description description description description description description '
                  }
                ></EventCell> */}
              </>
            }
            tueChildren={
              <EventCell
                numberOfHours={2}
                eventTitle={'title title title title title title title title title title title title '}
                eventDescription={
                  'description description description description description description description description description description '
                }
              ></EventCell>
            }
          />
        </TimetableContainer>
      </TimetableMainContainer>
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
