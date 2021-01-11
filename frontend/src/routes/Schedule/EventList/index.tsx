import React, { ReactElement, useState } from 'react'
import { LeftOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import { format } from 'date-fns'

import styled from 'styled-components'
import ImageDescriptionCard from '../../../components/Mobile/ImageDescriptionCard'
import SearchBar from '../../../components/Mobile/SearchBar'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import Button from '../../../components/Mobile/Button'
import 'antd/dist/antd.css'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store/types'
import { userRhEventsDummy } from '../../../store/stubs'
import { getSearchedEvents } from '../../../store/scheduling/action'

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

type CurrentEvents = {
  avatar?: string
  title: string
  dateTime: string
  description: string
  bottomElement: ReactElement
}

const testData: CurrentEvents[] = [
  {
    avatar: 'https://i.pravatar.cc/150?img=3',
    title: 'Block 7 Christmas Event',
    dateTime: '08-dec-20 01:00',
    description: 'Only for block 7 members! Follow us @block7 to find out more!',
    bottomElement: (
      <Button
        hasSuccessMessage={true}
        buttonIsPressed={true}
        stopPropagation={true}
        defaultButtonDescription={'Add to Schedule'}
        updatedButtonDescription={'Remove from Schedule'}
      />
    ),
  },
  {
    title: 'dummyEvent',
    dateTime: 'dd-mm-yyyy hh:mm',
    description: 'description description description description description description',
    bottomElement: (
      <Button
        hasSuccessMessage={true}
        stopPropagation={true}
        defaultButtonDescription={'Add to Schedule'}
        updatedButtonDescription={'Remove from Schedule'}
      />
    ),
  },
]

export default function EventList({ currentEvents }: { currentEvents: CurrentEvents[] }) {
  const history = useHistory()
  const dispatch = useDispatch()

  const data = currentEvents ?? testData

  // const searchedEvents = useSelector((state: RootState) => state.scheduling.searchedEvents)
  const [searchValue, setSearchValue] = useState('')

  console.log(
    userRhEventsDummy.filter((events) => {
      return events.eventName.toLowerCase().includes(searchValue.toLowerCase())
    }).length,
  )

  const formatDate = (eventStartTime: Date) => {
    return format(eventStartTime, 'dd-MMM-yy kk:mm')
  }

  const renderResults = () => {
    console.log(formatDate(userRhEventsDummy[0].startDateTime))
    if (searchValue) {
      return userRhEventsDummy ? (
        userRhEventsDummy.filter((events) => {
          return events.eventName.toLowerCase().includes(searchValue.toLowerCase())
        }).length === 0 ? (
          <NoEventDataText>No Events Found</NoEventDataText>
        ) : (
          userRhEventsDummy
            .filter((events) => {
              return events.eventName.toLowerCase().includes(searchValue.toLowerCase())
            })
            .map((result, index) => {
              return (
                <ImageDescriptionCard
                  key={index}
                  title={result.eventName}
                  dateTime={formatDate(result.startDateTime)}
                  description={result.location}
                  bottomElement={
                    <Button
                      hasSuccessMessage={true}
                      stopPropagation={true}
                      defaultButtonDescription={'Add to Schedule'}
                      updatedButtonDescription={'Remove from Schedule'}
                    />
                  }
                />
              )
            })
        )
      ) : (
        <NoEventDataText>No Events Found</NoEventDataText>
      )
    } else {
      return data ? (
        data.map((event, index) => {
          return (
            <ImageDescriptionCard
              key={index}
              avatar={event.avatar}
              title={event.title}
              dateTime={event.dateTime}
              description={event.description}
              bottomElement={event.bottomElement}
            />
          )
        })
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
    console.log(searchValue)
  }

  const leftIcon = (
    <LeftOutlined
      style={{ color: 'black', padding: '0 10px' }}
      onClick={() => {
        history.goBack()
      }}
    />
  )

  return (
    <Background>
      <TopNavBar title={'Events'} leftIcon={true} leftIconComponent={leftIcon} />
      <SearchBar placeholder={'Search event'} value={searchValue} onChange={onChange} />
      {renderResults()}
      <BottomNavBar />
    </Background>
  )
}
