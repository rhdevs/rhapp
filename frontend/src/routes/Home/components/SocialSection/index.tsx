import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { PlusCircleFilled } from '@ant-design/icons'
import { Divider, Button } from 'antd'
import SocialPostCard from '../../../../components/Mobile/SocialPostCard'
import { PATHS } from '../../../Routes'
import { SwitchPostsFilter, GetPosts, IncreasePageIndex } from '../../../../store/social/action'
import { POSTS_FILTER } from '../../../../store/social/types'
import { RootState } from '../../../../store/types'
import dayjs from 'dayjs'
import LoadingSpin from '../../../../components/LoadingSpin'

type TabProps = {
  active: boolean
}

const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
`

const Sticky = styled.div`
  position: -webkit-sticky;
  position: sticky;
  top: 50px;
  z-index: 100;
  background-color: #fafaf4;
`

const Header = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  font-size: 20px;
`

const TabBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
`

const Tab = styled.div<TabProps>`
  width: 50%;
  text-align: center;
  opacity: ${(props) => (props.active ? 1 : 0.5)};
`

export default function SocialSection() {
  const history = useHistory()
  const dispatch = useDispatch()
  const currentPostsFilter = useSelector((state: RootState) => state.social.postsFilter)
  const socialPosts = useSelector((state: RootState) => state.social.posts)
  const { userID, profilePictureUrl } = useSelector((state: RootState) => state.profile.user)
  const { pageIndex, isLoading, hasNoMorePosts } = useSelector((state: RootState) => state.social)

  useEffect(() => {
    dispatch(GetPosts(currentPostsFilter, pageIndex, userID))
  }, [currentPostsFilter])

  const toggleTab = (postsFilter: POSTS_FILTER) => () => dispatch(SwitchPostsFilter(postsFilter))

  const renderSocialPosts = () => {
    return socialPosts.map((post) => {
      const { title, postId, createdAt, description, postPics, name, userId } = post
      const postDate = dayjs.unix(parseInt(createdAt ?? ''))
      const isOlderThanADay = dayjs().diff(postDate, 'day') > 0

      const date = isOlderThanADay ? postDate.format('D/M/YY, h:mmA') : postDate.fromNow()

      return (
        <SocialPostCard
          key={postId}
          isOwner={userID == userId}
          avatar={profilePictureUrl}
          name={name ?? ''}
          title={title}
          dateTime={date}
          description={description}
          postId={postId}
          postPics={postPics ?? []}
          userId={userId}
        />
      )
    })
  }

  return (
    <>
      <Sticky>
        <Header>
          <span>{`What's happening....`}</span>
          <PlusCircleFilled
            style={{ color: '#EB5757', fontSize: 20 }}
            onClick={() => history.push(PATHS.CREATE_POST)}
          />
        </Header>
        <TabBar>
          <Tab active={currentPostsFilter === POSTS_FILTER.ALL} onClick={toggleTab(POSTS_FILTER.ALL)}>
            All
          </Tab>
          <Divider type="vertical" />
          <Tab active={currentPostsFilter === POSTS_FILTER.OFFICIAL} onClick={toggleTab(POSTS_FILTER.OFFICIAL)}>
            Official
          </Tab>
        </TabBar>
      </Sticky>
      {renderSocialPosts()}
      {!hasNoMorePosts && (
        <StyledContainer>
          {isLoading ? (
            <LoadingSpin />
          ) : (
            <Button
              type="text"
              onClick={() => {
                console.log('increasing')
                dispatch(IncreasePageIndex())
              }}
            >
              See more
            </Button>
          )}
        </StyledContainer>
      )}
    </>
  )
}
