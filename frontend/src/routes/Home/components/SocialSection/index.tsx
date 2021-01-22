import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { PlusCircleFilled } from '@ant-design/icons'
import { Divider } from 'antd'
import SocialPostCard from '../../../../components/Mobile/SocialPostCard'
import { PATHS } from '../../../Routes'
import { SwitchPostsFilter, GetPosts } from '../../../../store/social/action'
import { POSTS_FILTER } from '../../../../store/social/types'
import { RootState } from '../../../../store/types'
import dayjs from 'dayjs'

type TabProps = {
  active: boolean
}

type SocialPostCardProps = React.ComponentProps<typeof SocialPostCard>

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

const dummyAllData: SocialPostCardProps[] = [
  {
    isOwner: true,
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    postId: '123456789',
    title: 'Hello',
    name: 'Zhou Gou Gou',
    dateTime: '8h ago',
    description:
      'Hi I’m a RHapper! I like to eat cheese and fish. My favourite colour is black and blue. Please be my friend thank you!!!',
    postPics: [
      'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
    ],
  },
]

export default function SocialSection() {
  const history = useHistory()
  const dispatch = useDispatch()
  const currentPostsFilter = useSelector((state: RootState) => state.social.postsFilter)
  const socialPosts = useSelector((state: RootState) => state.social.posts)

  useEffect(() => {
    if (currentPostsFilter === POSTS_FILTER.FRIENDS) {
      dispatch(GetPosts(currentPostsFilter, 5, 'A132424')) // TODO: Use userId from state
    } else {
      dispatch(GetPosts(currentPostsFilter))
    }
  }, [currentPostsFilter])

  const toggleTab = (postsFilter: POSTS_FILTER) => () => dispatch(SwitchPostsFilter(postsFilter))

  const renderSocialPosts = () => {
    return socialPosts.map((post) => {
      const { title, postId, createdAt, description, postPics, name } = post
      const postDate = dayjs.unix(parseInt(createdAt ?? ''))
      const isOlderThanADay = dayjs().diff(postDate, 'day') > 0

      const date = isOlderThanADay ? postDate.format('D/M/YY, h:mmA') : postDate.fromNow()

      return (
        <SocialPostCard
          key={postId}
          isOwner={true} // TODO: change to userId == current userId
          avatar={dummyAllData[0].avatar}
          name={name ?? ''}
          title={title}
          dateTime={date}
          description={description}
          postId={postId}
          postPics={postPics ?? []}
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
          <Divider type="vertical" />
          <Tab active={currentPostsFilter === POSTS_FILTER.FRIENDS} onClick={toggleTab(POSTS_FILTER.FRIENDS)}>
            Friends
          </Tab>
        </TabBar>
      </Sticky>
      {renderSocialPosts()}
    </>
  )
}
