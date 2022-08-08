import LeftOutlined from '@ant-design/icons/lib/icons/LeftOutlined'
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store/types'
import { getShareSearchResults, giveTimetablePermission } from '../../../store/scheduling/action'
import useSnackbar from '../../../hooks/useSnackbar'
import { Friend } from '../../../store/social/types'

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
  const [success] = useSnackbar('success')
  const searchResults = useSelector((state: RootState) => state.scheduling.shareSearchResults)
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    dispatch(getShareSearchResults())
  }, [])

  const onChange = (input: string) => {
    setSearchValue(input)
  }

  const handleClick = (friend: Friend) => () => {
    giveTimetablePermission(friend.userID)
      .then(() => success(`You have shared with ${friend.displayName}`))
      .catch(() => success(`You have failed to share with ${friend.displayName}`)) // TODO: Failure snackbar
  }

  const leftIcon = (
    <LeftOutlined
      style={{ color: 'black', padding: '0 10px 0 0' }}
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
      return searchResults ? (
        searchResults
          .filter((friend) => friend.displayName.toLowerCase().includes(searchValue.toLowerCase()))
          .map((friend, index) => {
            return (
              <ImageDescriptionCard
                key={index}
                avatar={friend.profilePictureUrl}
                title={friend.displayName}
                description={friend.bio}
                onClick={handleClick(friend)}
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
      <TopNavBar title="Share" leftIcon leftIconComponent={leftIcon} />
      <SearchBar placeholder="Search user" value={searchValue} onChange={onChange} />
      {renderResults()}
      <BottomNavBar></BottomNavBar>
    </Background>
  )
}
