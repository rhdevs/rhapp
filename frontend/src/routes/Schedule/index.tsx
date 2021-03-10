import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import styled from 'styled-components'
import { Menu } from 'antd'
import { DeleteOutlined, PlusOutlined, SearchOutlined, ImportOutlined } from '@ant-design/icons'
import BottomNavBar from '../../components/Mobile/BottomNavBar'
import TopNavBar from '../../components/Mobile/TopNavBar'
import Tags from '../../components/Mobile/Tags'
import MenuDropdown from '../../components/Mobile/MenuDropdown'
import Timetable from '../../components/timetable/Timetable'

import {
  deleteUserNusModsEvents,
  fetchAllCCAs,
  // fetchAllProfiles,
  fetchCurrentUserEvents,
  setIsLoading,
  setNusModsStatus,
  setSelectedCCAIds,
  setSelectedProfileIds,
} from '../../store/scheduling/action'
import { RootState } from '../../store/types'
import { PATHS } from '../Routes'
import LoadingSpin from '../../components/LoadingSpin'
import ConfirmationModal from '../../components/Mobile/ConfirmationModal'
import NusModsWeeks from '../../components/Scheduling/NusModsWeeks'

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

const TagTitleText = styled.h1`
  color: black;
  padding: 5px 15px 0px 10px;
  margin: 0px;
  font-size: 24px;
  font-family: Inter;
`

const Background = styled.div`
  background-color: #fafaf4;
  height: 100%;
  width: 100%;
`

const NusModsWeeksText = styled.div`
  width: clamp(9rem, 36vw, 40rem);
  font-size: clamp(12px, 2.5vw, 1rem);
  white-space: break-spaces;
  text-align: center;
`

export default function Schedule() {
  const dispatch = useDispatch()
  const history = useHistory()
  const {
    userCurrentEvents,
    userCurrentEventsStartTime,
    userCurrentEventsEndTime,
    isLoading,
    nusModsIsSuccessful,
    nusModsIsFailure,
    // profileList,
    ccaList,
    selectedProfileIds,
    // selectedCCAIds,
  } = useSelector((state: RootState) => state.scheduling)

  useEffect(() => {
    dispatch(setIsLoading(true))
    dispatch(fetchCurrentUserEvents(localStorage.getItem('userID'), true))
    // dispatch(fetchAllProfiles())
    dispatch(fetchAllCCAs())
    dispatch(setSelectedProfileIds([]))
    dispatch(setSelectedCCAIds([]))
    if (nusModsIsSuccessful || nusModsIsFailure)
      setTimeout(() => {
        dispatch(setNusModsStatus(false, false))
      }, 10000)
  }, [dispatch])

  const rightIcon = (
    <MenuDropdown
      menuItem={
        <>
          {/* <SubMenu
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
          </SubMenu> */}
          <Menu.Item
            key="4"
            icon={<PlusOutlined />}
            onClick={() => {
              history.push(PATHS.CREATE_EVENT)
            }}
          >
            Add an event
          </Menu.Item>
          <Menu.Item
            key="5"
            icon={<SearchOutlined />}
            onClick={() => {
              history.push(`${PATHS.EVENT_LIST_PAGE}/1`)
            }}
          >
            Events
          </Menu.Item>
          <Menu.Item
            key="3"
            icon={<ImportOutlined />}
            onClick={() => {
              history.push(PATHS.IMPORT_FROM_NUSMODS)
            }}
          >
            Import from NUSMods
          </Menu.Item>
        </>
      }
      closableButton={
        <Menu.Item
          key="6"
          icon={<DeleteOutlined />}
          onClick={() => {
            setModal(true)
          }}
        >
          Delete my NUSMods events
        </Menu.Item>
      }
    />
  )

  const [modal, setModal] = useState(false)

  // const friendsOnChange = (input: string[]) => {
  //   dispatch(setSelectedProfileIds(input))
  //   dispatch(fetchCurrentUserEvents(localStorage.getItem('userID'), input.length === 0 && selectedCCAIds.length === 0))
  // }

  const groupOnChange = (input: string[]) => {
    const numberArr: number[] = input.map((x: string) => {
      return Number(x)
    })
    dispatch(setSelectedCCAIds(numberArr))
    dispatch(
      fetchCurrentUserEvents(localStorage.getItem('userID'), input.length === 0 && selectedProfileIds.length === 0),
    )
  }

  const centerComponent = <NusModsWeeksText>{NusModsWeeks}</NusModsWeeksText>

  return (
    <Background>
      <TopNavBar title={`Timetable`} centerComponent={centerComponent} leftIcon={true} rightComponent={rightIcon} />
      {isLoading && <LoadingSpin />}
      {modal && (
        <ConfirmationModal
          title={'Confirm Delete?'}
          hasLeftButton={true}
          leftButtonText={'Delete'}
          onLeftButtonClick={() => {
            dispatch(setIsLoading(true))
            dispatch(deleteUserNusModsEvents(localStorage.getItem('userID')))
            setModal(false)
          }}
          rightButtonText={'Cancel'}
          onRightButtonClick={() => {
            setModal(false)
          }}
        />
      )}
      <TimetableMainContainer>
        <TimetableContainer>
          <Timetable
            events={userCurrentEvents}
            eventsStartTime={userCurrentEventsStartTime}
            eventsEndTime={userCurrentEventsEndTime}
          />
        </TimetableContainer>
      </TimetableMainContainer>
      {/* <GroupContainer>
        <SmallContainer>
          <TagTitleText>Friends</TagTitleText>
        </SmallContainer>
        <Tags
          profileOptions={profileList.filter((profile) => {
            return profile.userID !== localStorage.getItem('userID')
          })}
          onChange={friendsOnChange}
        />
      </GroupContainer> */}
      <GroupContainer>
        <SmallContainer>
          <TagTitleText>CCA</TagTitleText>
        </SmallContainer>
        <Tags ccaOptions={ccaList} onChange={groupOnChange} />
      </GroupContainer>
      <BottomNavBar />
    </Background>
  )
}
