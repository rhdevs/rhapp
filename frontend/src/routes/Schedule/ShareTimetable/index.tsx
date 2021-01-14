import { LeftOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch /** , useSelector */ } from 'react-redux'
// import { RootState } from '../../../store/types'
import { getShareSearchResults } from '../../../store/scheduling/action'
import { searchResultsStub } from '../../../store/stubs'

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

export default function ShareTimetable({ recentSearches }: { recentSearches: RecentData[] }) {
  const history = useHistory()
  const dispatch = useDispatch()
  // const searchResults = useSelector((state: RootState) => state.scheduling.shareSearchResults)
  const [searchValue, setSearchValue] = useState('')

  const onChange = (input: string) => {
    setSearchValue(input)
    input && dispatch(getShareSearchResults(input))
  }

  const leftIcon = (
    <LeftOutlined
      style={{ color: 'black', padding: '0 10px' }}
      onClick={() => {
        history.goBack()
      }}
    />
  )

  /**
   * Renders search results (if any) when there is a search query,
   * otherwise renders recent searches (if any)
   */
  const renderResults = () => {
    if (searchValue) {
      return searchResultsStub ? (
        searchResultsStub.map((result, index) => {
          return (
            <ImageDescriptionCard
              key={index}
              avatar={result.avatar}
              title={result.title}
              description={result?.description ?? ''}
            />
          )
        })
      ) : (
        <NoRecentDataText>No results</NoRecentDataText>
      )
    } else {
      return recentSearches ? (
        <>
          <RecentDataText>Recent</RecentDataText>
          {recentSearches.map((result, index) => {
            return (
              <ImageDescriptionCard
                key={index}
                avatar={result.avatar}
                title={result.title}
                description={result?.description ?? ''}
              />
            )
          })}
        </>
      ) : (
        <NoRecentDataText>No recent searches</NoRecentDataText>
      )
    }
  }

  return (
    <Background>
      <TopNavBar title={'Share'} leftIcon={true} leftIconComponent={leftIcon} />
      <SearchBar placeholder={'Search user'} value={searchValue} onChange={onChange} />
      {renderResults()}
      <BottomNavBar></BottomNavBar>
    </Background>
  )
}
