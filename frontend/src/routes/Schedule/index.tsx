import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import styled from 'styled-components'
import { Alert, Menu, message } from 'antd'
import { DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import BottomNavBar from '../../components/Mobile/BottomNavBar'
import TopNavBar from '../../components/Mobile/TopNavBar'
import Tags from '../../components/Mobile/Tags'
import MenuDropdown from '../../components/Mobile/MenuDropdown'
import Timetable from '../../components/timetable/Timetable'

import {
  deleteUserNusModsEvents,
  fetchAllCCAs,
  fetchAllProfiles,
  fetchCurrentUserEvents,
  setDeleteEventStatus,
  setIsLoading,
  setNusModsStatus,
  setSelectedCCAIds,
  setSelectedProfileIds,
} from '../../store/scheduling/action'
import { RootState } from '../../store/types'
import { PATHS } from '../Routes'
import LoadingSpin from '../../components/LoadingSpin'
import ConfirmationModal from '../../components/Mobile/ConfirmationModal'

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

const AlertGroup = styled.div`
  margin: 23px;
`

const { SubMenu } = Menu

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
    profileList,
    ccaList,
    selectedProfileIds,
    selectedCCAIds,
    deletedEventIsSuccess,
    deletedEventIsFailure,
  } = useSelector((state: RootState) => state.scheduling)

  const onClose = () => {
    dispatch(setNusModsStatus(false, false))
  }

  const AlertSection = (
    <AlertGroup>
      {nusModsIsSuccessful && !nusModsIsFailure && (
        <Alert
          message="Successfully Imported!"
          description="Yay yippe doodles"
          type="success"
          closable
          showIcon
          onClose={onClose}
        />
      )}
      {nusModsIsFailure && !nusModsIsSuccessful && (
        <Alert
          message="NUSMods Events not imported!!!"
          description="Insert error message here"
          type="error"
          closable
          showIcon
          onClose={onClose}
        />
      )}
    </AlertGroup>
  )

  useEffect(() => {
    dispatch(setIsLoading(true))
    dispatch(fetchCurrentUserEvents(localStorage.getItem('userID'), true))
    dispatch(fetchAllProfiles())
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

  const friendsOnChange = (input: string[]) => {
    dispatch(setSelectedProfileIds(input))
    dispatch(fetchCurrentUserEvents(localStorage.getItem('userID'), input.length === 0 && selectedCCAIds.length === 0))
  }

  const groupOnChange = (input: string[]) => {
    const numberArr: number[] = input.map((x: string) => {
      return Number(x)
    })
    dispatch(setSelectedCCAIds(numberArr))
    dispatch(
      fetchCurrentUserEvents(localStorage.getItem('userID'), input.length === 0 && selectedProfileIds.length === 0),
    )
  }

  useEffect(() => {
    {
      deletedEventIsSuccess && !deletedEventIsFailure && message.success('The event has been sucessfully deleted!')
    }
    {
      deletedEventIsFailure && !deletedEventIsSuccess && message.error('Failed to delete, please try again!')
    }
    dispatch(setDeleteEventStatus(false, false))
  }, [])

  return (
    <Background>
      <TopNavBar title={'Timetable'} leftIcon={true} rightComponent={rightIcon} />
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
      {deletedEventIsSuccess && !deletedEventIsFailure && message.success('The event has been sucessfully deleted!')}
      {deletedEventIsFailure && !deletedEventIsSuccess && message.error('Failed to delete, please try again!')}
=======
      {(deletedEventIsSuccess || deletedEventIsFailure) && deleteEventStatus()}
>>>>>>> Add delete event with redux
=======
      {deletedEventIsSuccess && !deletedEventIsFailure && message.success('The event has been sucessfully deleted!')}
      {deletedEventIsFailure && !deletedEventIsSuccess && message.error('Failed to delete, please try again!')}
>>>>>>> Debug delete event notification
=======
>>>>>>> Update view event ui, Debug notification for delete eevnt sucess/failure
      {(nusModsIsSuccessful || nusModsIsFailure) && !isLoading && AlertSection}
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
      <GroupContainer>
        <SmallContainer>
          <TagTitleText>Friends</TagTitleText>
        </SmallContainer>
        <Tags
          profileOptions={profileList.filter((profile) => {
            return profile.userID !== localStorage.getItem('userID')
          })}
          onChange={friendsOnChange}
        />
      </GroupContainer>
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
