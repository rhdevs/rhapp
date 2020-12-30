import { LeftOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

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

type RecentData = {
  avatar?: string
  title: string
  description: string
}

const testData: RecentData[] = [
  { avatar: 'https://i.pravatar.cc/150?img=3', title: 'Zhou Mamam', description: 'Block 1' },
  { title: 'John', description: 'description' },
]

export default function ShareTimetable({ recentSearches }: { recentSearches: RecentData[] }) {
  const history = useHistory()
  const data = recentSearches ?? testData
  const [searchValue, setSearchValue] = useState('')

  const onChange = (input: string) => {
    setSearchValue(input)
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
      <TopNavBar title={'Share'} leftIcon={true} leftIconComponent={leftIcon} />
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
      <BottomNavBar></BottomNavBar>
    </Background>
  )
}
