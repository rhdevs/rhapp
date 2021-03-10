import React, { useEffect, useState } from 'react'
import { LeftOutlined } from '@ant-design/icons'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { format } from 'date-fns'

import styled from 'styled-components'
import { PATHS } from '../../Routes'
import { Button as AntdButton, Pagination } from 'antd'
import ImageDescriptionCard from '../../../components/Mobile/ImageDescriptionCard'
import SearchBar from '../../../components/Mobile/SearchBar'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import Button from '../../../components/Mobile/Button'
import LoadingSpin from '../../../components/LoadingSpin'
import { RootState } from '../../../store/types'
import {
  editUserEvents,
  fetchAllPublicEvents,
  fetchAllUserEvents,
  getPublicEventsByPage,
  getSearchedEvents,
} from '../../../store/scheduling/action'
import { SchedulingEvent } from '../../../store/scheduling/types'

import 'antd/dist/antd.css'

const Background = styled.div`
  background-color: #fafaf4;
  height: 100vh;
  width: 100vw;
`

const NoEventDataText = styled.text`
  font-family: Inter;
  color: black;
  font-size: 20px;
  display: flex;
  justify-content: center;
`

const TopContainer = styled.div`
  position: inherit;
`

const SearchBarContainer = styled.div`
  padding: 0 6.5vw 1vh;
  display: flex;
  flex-direction: column;
`

const ResultsContainer = styled.div`
  overflow: auto;
  height: 70vh;
`

const UpcomingEventsText = styled.text`
  font-family: Inter;
  color: black;
  font-size: 20px;
  line-height: 30px;
  padding-left: 5vw;
`

const LongButton = {
  backgroundColor: '#002642',
  borderColor: '#002642',
  borderRadius: '5px',
}

export default function EventList({ currentEvents }: { currentEvents: SchedulingEvent[] }) {
  const history = useHistory()
  const dispatch = useDispatch()
  const pageIndex = Number(useParams<{ pageIndex: string }>().pageIndex) - 1

  const { userAllEventsList, allPublicEvents, isLoading, searchedEvents, selectedPageEvents } = useSelector(
    (state: RootState) => state.scheduling,
  )

  const data = currentEvents ?? allPublicEvents

  const numberOfPages = Math.ceil(data.length / 10)

  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    dispatch(fetchAllUserEvents(localStorage.getItem('userID'), false))
    dispatch(fetchAllPublicEvents())
    if (!(0 <= pageIndex && pageIndex < numberOfPages)) {
      history.push(`${PATHS.EVENT_LIST_PAGE}/1`)
    }
    dispatch(getPublicEventsByPage(pageIndex))
  }, [dispatch, pageIndex])

  const formatDate = (eventStartTime: number) => {
    const date = new Date(eventStartTime * 1000)
    return format(date, 'dd-MMM-yy kk:mm')
  }

  const eventsToCards = (events: SchedulingEvent[]) => {
    return events.map((result, index) => {
      return (
        <ImageDescriptionCard
          key={index}
          title={result.eventName}
          dateTime={formatDate(result.startDateTime)}
          description={result.description}
          bottomElement={
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <AntdButton
                type="primary"
                style={LongButton}
                onClick={() => {
                  history.push(PATHS.VIEW_EVENT + `/${result.eventID}`)
                }}
              >
                See Details
              </AntdButton>
              <div style={{ width: '5%' }} />
              <Button
                descriptionStyle={{ width: '100%', whiteSpace: 'normal' }}
                buttonWidth="9rem"
                buttonHeight="auto"
                buttonIsPressed={
                  userAllEventsList.filter((event) => {
                    return event.eventID === result.eventID
                  }).length !== 0
                } //check if event is already in schedule
                stopPropagation={true}
                defaultButtonDescription={'Add to Schedule'}
                updatedButtonDescription={'Remove from Schedule'}
                onButtonClick={(buttonIsPressed) => {
                  if (
                    userAllEventsList.filter((event) => {
                      return event.eventID === result.eventID
                    }).length !== 0
                  ) {
                    if (buttonIsPressed) {
                      // event is in list and button is pressed
                      // remove event from list
                      dispatch(editUserEvents('remove', result.eventID, localStorage.getItem('userID')))
                    } else {
                      // event is in list, button is un-pressed
                      dispatch(editUserEvents('add', result.eventID, localStorage.getItem('userID')))
                    }
                  } else if (
                    userAllEventsList.filter((event) => {
                      return event.eventID === result.eventID
                    }).length === 0
                  ) {
                    if (buttonIsPressed) {
                      // event is not in list, button is un-pressed
                      dispatch(editUserEvents('remove', result.eventID, localStorage.getItem('userID')))
                    } else {
                      // event is not in list and button is pressed
                      // add event to list
                      dispatch(editUserEvents('add', result.eventID, localStorage.getItem('userID')))
                    }
                  }
                  return
                }}
              />
            </div>
          }
        />
      )
    })
  }

  const renderResults = () => {
    if (searchValue) {
      return searchedEvents ? (
        searchedEvents.length === 0 ? (
          <NoEventDataText>No Events Found</NoEventDataText>
        ) : (
          eventsToCards(searchedEvents)
        )
      ) : (
        <NoEventDataText>No Events Found</NoEventDataText>
      )
    } else {
      return selectedPageEvents.length ? (
        isLoading ? (
          <LoadingSpin />
        ) : (
          <>
            {eventsToCards(selectedPageEvents)}
            <Pagination
              showSizeChanger={false}
              hideOnSinglePage
              style={{ display: 'flex', justifyContent: 'center', padding: '15px 0' }}
              defaultCurrent={1}
              current={pageIndex + 1}
              total={data.length}
              defaultPageSize={10}
              onChange={(pageNumber) => {
                history.push(`${PATHS.EVENT_LIST_PAGE}/${pageNumber}`)
              }}
            />
          </>
        )
      ) : (
        <>
          <NoEventDataText>No Upcoming Events</NoEventDataText>
        </>
      )
    }
  }

  const onChange = (input: string) => {
    setSearchValue(input)
    input && dispatch(getSearchedEvents(input))
  }

  const leftIcon = (
    <LeftOutlined
      style={{ color: 'black', padding: '0 10px 0 0' }}
      onClick={() => {
        history.push(PATHS.SCHEDULE_PAGE)
      }}
    />
  )

  return (
    <Background>
      <TopContainer>
        <TopNavBar title={'Events'} leftIcon={true} leftIconComponent={leftIcon} />
        <SearchBarContainer>
          <SearchBar placeholder={'Search event'} value={searchValue} onChange={onChange} />
          {!searchValue && selectedPageEvents.length !== 0 && <UpcomingEventsText>Upcoming Events</UpcomingEventsText>}
        </SearchBarContainer>
      </TopContainer>
      <ResultsContainer>{renderResults()}</ResultsContainer>
      <BottomNavBar />
    </Background>
  )
}
