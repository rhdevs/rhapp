import React, { useState } from 'react'

import styled from 'styled-components'
import ImageDescriptionCard from '../../../components/Mobile/ImageDescriptionCard'
import SearchBar from '../../../components/Mobile/SearchBar'
import TopNavBar from '../../../components/Mobile/TopNavBar'

const Background = styled.div`
  background-color: #fafaf4;
  height: 100vh;
  width: 100vw;
`

const BottomNavBar = styled.div`
  height: 64px;
`

const NoRecentDataText = styled.text`
  font-family: Inter;
  color: black;
  font-size: 20px;
  display: flex;
  justify-content: center;
`

const RecentDataText = styled.text`
  font-family: Inter;
  color: black;
  font-size: 20px;
  line-height: 30px;
  padding-left: 5vw;
`

type recentData = {
  avatar: string
  title: string
  description: string
}

const testData: recentData[] = [
  { avatar: 'https://i.pravatar.cc/150?img=3', title: 'Zhou Mamam', description: 'Block 1' },
  { avatar: 'https://i.pravatar.cc/150?img=3', title: 'John', description: 'description' },
]

export default function ShareTimetable({ recentSearches }: { recentSearches: recentData[] }) {
  const data = recentSearches ?? testData
  const [searchValue, setSearchValue] = useState('')

  const onChange = (input: string) => {
    setSearchValue(input)
    console.log(searchValue)
  }

  return (
    <Background>
      <TopNavBar title={'Share'} />
      <SearchBar placeholder={'Search user'} value={searchValue} onChange={onChange} />
      {searchValue ? (
        <NoRecentDataText>No friends</NoRecentDataText>
      ) : data ? (
        <>
          <RecentDataText>Recent</RecentDataText>
          {data.map((person, index) => {
            return (
              <ImageDescriptionCard
                key={index}
                avatar={person.avatar}
                title={person.title}
                description={person.description}
              />
            )
          })}
        </>
      ) : (
        <NoRecentDataText>No recent searches</NoRecentDataText>
      )}

      {/* <ImageDescriptionCard avatar={'https://i.pravatar.cc/150?img=3'} title={'Zhou Mamam'} description={'Block 1'} />
      <ImageDescriptionCard
        title={
          'Zhou Mamam hello this is my long nameZhou Mamam hello this is my long name Zhou Mamam hello this is my long name'
        }
        description={
          'Block 1 description description description description Zhou Mamam hello this is my long name Zhou Mamam hello this is my long name'
        }
        dateTime={'08-dec-2020 01:00'}
        bottomElement={
          <button
            onClick={(e) => {
              console.log('button is clicked')
              e.stopPropagation()
            }}
          >
            hello
          </button>
        }
      /> */}

      <BottomNavBar></BottomNavBar>
    </Background>
  )
}
