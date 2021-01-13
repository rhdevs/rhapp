import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { invert } from 'lodash'
import { useHistory } from 'react-router-dom'

import BottomNavBar from '../../components/Mobile/BottomNavBar'
import { Menu } from 'antd'
import { PlusOutlined, SearchOutlined, ShareAltOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import TopNavBar from '../../components/Mobile/TopNavBar'
import Tags from '../../components/Mobile/Tags'
import MenuDropdown from '../../components/Mobile/MenuDropdown'
import Timetable from '../../components/timetable/Timetable'

import { fetchUserRhEvents } from '../../store/scheduling/action'
import { RootState } from '../../store/types'
import { PATHS } from '../Routes'
import { RHEvent } from '../../store/scheduling/types'
import LoadingSpin from '../../components/LoadingSpin'

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

type lessonTypeAbbrev = { [abbrevLessonType: string]: string }
export const ABBREV_TO_LESSON: lessonTypeAbbrev = {
  DLEC: 'Design Lecture',
  LAB: 'Laboratory',
  LEC: 'Lecture',
  PLEC: 'Packaged Lecture',
  PTUT: 'Packaged Tutorial',
  REC: 'Recitation',
  SEC: 'Sectional Teaching',
  SEM: 'Seminar-Style Module Class',
  TUT: 'Tutorial',
  TUT2: 'Tutorial Type 2',
  TUT3: 'Tutorial Type 3',
  WS: 'Workshop',
}

// Reverse lookup map of ABBREV_TO_LESSON
export const LESSON_TO_ABBREV: { [lessonType: string]: string } = invert(ABBREV_TO_LESSON)

export const LESSON_TYPE_SEP = ':'
export const LESSON_SEP = ','

const testLink =
  'https://nusmods.com/timetable/sem-2/share?AC5002=LEC:1&CG1112=LAB:04,TUT:01,LEC:01&CG2023=LAB:05,PTUT:03,PLEC:02'
// moduleCode=lessonType:classNo,lessonType:classNo
// AC5002=LEC:1
// CG1112=LAB:04,TUT:01,LEC:01
// CG2023=LAB:05,PTUT:03,PLEC:02

export default function Schedule() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { userRhEvents, userEventsStartTime, userEventsEndTime, isLoading } = useSelector(
    (state: RootState) => state.scheduling,
  )

  useEffect(() => {
    dispatch(fetchUserRhEvents())
  }, [dispatch])

  const doSomething = () => {
    const extractedData = extractDataFromLink(testLink)
    // console.log(extractedData)
    for (let i = 0; i < extractedData.length; i++) {
      NUSModsToRHEvents('2020-2021', extractedData[i])
    }
  }

  /**
   * Returns a 2D array, containing module code and lesson information of each module
   *
   * @param link NUSMods share link
   */
  const extractDataFromLink = (link: string) => {
    const timetableInformation = link.split('?')[1]
    const timetableData = timetableInformation.split('&')
    const data: string[][] = []
    for (let i = 0; i < timetableData.length; i++) {
      const moduleCode = timetableData[i].split('=')[0]
      data[i] = []
      data[i].push(moduleCode)
      timetableData[i] = timetableData[i].split('=')[1]
      const moduleLessons = timetableData[i].split(LESSON_SEP)
      for (let j = 0; j < moduleLessons.length; j++) {
        data[i].push(moduleLessons[j])
      }
    }
    return data
  }

  /**
   * Fetches data from NUSMods API, reformats lesson information to RHEvents and pushes events into respective day arrays
   *
   * @param acadYear academicYear of the lesson information is retrieved from NUSMods API
   * @param moduleArray array of lessons selected by user (from link provided)
   */
  const NUSModsToRHEvents = (acadYear: string, moduleArray: string[]) => {
    const moduleCode = moduleArray[0]
    axios.get(`https://api.nusmods.com/v2/${acadYear}/modules/${moduleCode}.json`).then((res) => {
      const moduleData = res.data.semesterData[0].timetable
      moduleArray = moduleArray.splice(1)
      for (let i = 0; i < moduleArray.length; i++) {
        const lessonType = moduleArray[i].split(LESSON_TYPE_SEP)[0]
        const classNo = moduleArray[i].split(LESSON_TYPE_SEP)[1]
        const correspondingClassInformationArray = moduleData.filter(
          (moduleClass: { classNo: string; lessonType: string }) => {
            return moduleClass.classNo === classNo && moduleClass.lessonType === ABBREV_TO_LESSON[lessonType]
          },
        )
        for (let i = 0; i < correspondingClassInformationArray.length; i++) {
          const newEvent: RHEvent = {
            eventName: moduleCode + ' ' + LESSON_TO_ABBREV[correspondingClassInformationArray[i].lessonType],
            location: correspondingClassInformationArray[i].venue,
            day: correspondingClassInformationArray[i].day,
            endTime: correspondingClassInformationArray[i].endTime,
            startTime: correspondingClassInformationArray[i].startTime,
          }
          events.push(newEvent)
        }
      }
    })
  }

  doSomething()
  const [events] = useState<RHEvent[]>([])
  console.log(events)

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
            <Menu.Item key="3">Import an ICalander File (.ics)</Menu.Item>
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

  return (
    <Background>
      <TopNavBar title={'Timetable'} rightComponent={rightIcon} />
      {isLoading && <LoadingSpin />}
      <TimetableMainContainer>
        <TimetableContainer>
          <Timetable events={userRhEvents} eventsStartTime={userEventsStartTime} eventsEndTime={userEventsEndTime} />
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
        </SmallContainer>
        <Tags options={['Group1', 'Group2']} />
      </GroupContainer>
      <BottomNavBar />
    </Background>
  )
}
