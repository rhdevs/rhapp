import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import BottomNavBar from '../../components/Mobile/BottomNavBar'
import { Menu } from 'antd'
import { PlusOutlined, SearchOutlined, ShareAltOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import TopNavBar from '../../components/Mobile/TopNavBar'
import Tags from '../../components/Mobile/Tags'
import MenuDropdown from '../../components/Mobile/MenuDropdown'
import Timetable from '../../components/timetable/Timetable'

import { fetchUserEvents } from '../../store/scheduling/action'
import { RootState } from '../../store/types'
import { PATHS } from '../Routes'
import LoadingSpin from '../../components/LoadingSpin'
// import SearchBar from '../../components/Mobile/SearchBar'

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

const { SubMenu } = Menu

export default function Schedule() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { userEvents, userEventsStartTime, userEventsEndTime, isLoading } = useSelector(
    (state: RootState) => state.scheduling,
  )

  useEffect(() => {
    dispatch(fetchUserEvents())
  }, [dispatch])

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
                history.push(PATHS.SHARE_TIMETABLE_PAGE)
              }}
            >
              Share with...
            </Menu.Item>

            <Menu.Item key="2">Save as png</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<PlusOutlined />} title="Add Events">
            <Menu.Item
              key="3"
              onClick={() => {
                history.push(PATHS.IMPORT_FROM_NUSMODS)
              }}
            >
              Import from NUSMods
            </Menu.Item>
            <Menu.Item
              key="4"
              onClick={() => {
                history.push(PATHS.CREATE_EVENT)
              }}
            >
              Add an event
            </Menu.Item>
          </SubMenu>
          <Menu.Item
            key="5"
            icon={<SearchOutlined />}
            onClick={() => {
              history.push(PATHS.EVENT_LIST_PAGE)
            }}
          >
            Events
          </Menu.Item>
        </>
      }
    />
  )

  // const [searchFriendsValue, setSearchFriendsValue] = useState('')
  // const [searchGroupValue, setSearchGroupValue] = useState('')

  // const friendsOnChange = (input: string) => {
  //   setSearchFriendsValue(input)
  //   console.log(searchFriendsValue)
  // }

  // const groupOnChange = (input: string) => {
  //   setSearchGroupValue(input)
  //   console.log(searchGroupValue)
  // }

  return (
    <Background>
      <TopNavBar title={'Timetable'} leftIcon={true} rightComponent={rightIcon} />
      {isLoading && <LoadingSpin />}
      <TimetableMainContainer>
        <TimetableContainer>
          <Timetable events={userEvents} eventsStartTime={userEventsStartTime} eventsEndTime={userEventsEndTime} />
        </TimetableContainer>
      </TimetableMainContainer>
      <GroupContainer>
        <SmallContainer>
          <h1
            style={{
              color: 'black',
              padding: '5px 15px 0px 0px',
              margin: '0px',
              fontSize: '24px',
              fontFamily: 'Inter',
            }}
          >
            Friends
          </h1>
          {/* <div style={{ width: '25rem' }}>
            <SearchBar placeholder={'Add to timetable'} value={searchFriendsValue} onChange={friendsOnChange} />
          </div> */}
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
          <h1
            style={{
              color: 'black',
              padding: '5px 15px 0px 0px',
              margin: '0px',
              fontSize: '24px',
              fontFamily: 'Inter',
            }}
          >
            Groups
          </h1>
          {/* <div style={{ width: '25rem' }}>
            <SearchBar placeholder={'Add to timetable'} value={searchGroupValue} onChange={groupOnChange} />
          </div> */}
        </SmallContainer>
        <Tags options={['Group1', 'Group2']} />
      </GroupContainer>
      <BottomNavBar />
    </Background>
  )
}
