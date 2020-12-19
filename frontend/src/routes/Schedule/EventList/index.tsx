import React, { ReactElement, useState } from 'react'
import { Link } from 'react-router-dom'
import { LeftOutlined } from '@ant-design/icons'

import styled from 'styled-components'
import ImageDescriptionCard from '../../../components/Mobile/ImageDescriptionCard'
import SearchBar from '../../../components/Mobile/SearchBar'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import Button from '../../../components/Mobile/Button'
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
  const data = currentEvents ?? testData
  const [searchValue, setSearchValue] = useState('')

  const onChange = (input: string) => {
    setSearchValue(input)
    console.log(searchValue)
  }

  const leftIcon = (
    <Link to={'/schedule'}>
      <LeftOutlined style={{ color: 'black', padding: '0 10px' }} />
    </Link>
  )

  return (
    <Background>
      <TopNavBar title={'Events'} leftIcon={true} leftIconComponent={leftIcon} />
      <SearchBar placeholder={'Search event'} value={searchValue} onChange={onChange} />
      {searchValue ? (
        <NoEventDataText>No Events Found</NoEventDataText>
      ) : data ? (
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
        <NoEventDataText>No Events</NoEventDataText>
      )}
      <BottomNavBar />
    </Background>
  )
}
