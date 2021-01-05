import React, { useState, useEffect, createRef } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { PlusCircleFilled } from '@ant-design/icons'
import { Divider } from 'antd'
import SocialPostCard from '../../../../components/Mobile/SocialPostCard'
import { PATHS } from '../../../Routes'

type TabProps = {
  active: boolean
}

type SocialPostCardProps = React.ComponentProps<typeof SocialPostCard>
type StickyProps = {
  isSticky: boolean
}

enum SOCIAL_TABS {
  ALL_USERS = 'ALL_USERS',
  OFFICIAL_USERS = 'OFFICIAL_USERS',
  FRIEND_USERS = 'FRIEND_USERS',
}

const Sticky = styled.div<StickyProps>`
  position: -webkit-sticky;
  position: sticky;
  top: 50px;
  z-index: 100;
  background-color: #fafaf4;
  filter: ${(props) => props.isSticky && 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))'};
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

const dummyFriendData = dummyAllData.slice(0, 1)

export default function SocialSection() {
  const [isAllSocialPosts, setIsAllSocialPosts] = useState<SOCIAL_TABS>(SOCIAL_TABS.ALL_USERS)
  const [isSticky, setIsSticky] = useState<boolean>(false)
  const toggleTab = (socialTab: SOCIAL_TABS) => () => setIsAllSocialPosts(socialTab)
  const ref = createRef<HTMLDivElement>()

  // TODO: Not working
  useEffect(() => {
    const stickyBar: Element = ref.current as Element
    const observer = new window.IntersectionObserver(
      ([e]) => {
        console.log('stick')
        setIsSticky(e.intersectionRatio < 1)
      },
      { threshold: 1 },
    )

    return () => {
      observer.unobserve(stickyBar)
    }
  }, [])

  const renderSocialPosts = () => {
    const data = isAllSocialPosts ? dummyAllData : dummyFriendData
    return data.map((post: SocialPostCardProps) => <SocialPostCard {...post} key={post.dateTime} />)
  }

  return (
    <>
      <Sticky ref={ref} isSticky={isSticky}>
        <Header>
          <span>{`What's happening....`}</span>
          <PlusCircleFilled style={{ color: '#EB5757', fontSize: 20 }} />
        </Header>
        <TabBar>
          <Tab active={isAllSocialPosts === SOCIAL_TABS.ALL_USERS} onClick={toggleTab(SOCIAL_TABS.ALL_USERS)}>
            All
          </Tab>
          <Divider type="vertical" />
          <Tab active={isAllSocialPosts === SOCIAL_TABS.OFFICIAL_USERS} onClick={toggleTab(SOCIAL_TABS.OFFICIAL_USERS)}>
            Official
          </Tab>
          <Divider type="vertical" />
          <Tab active={isAllSocialPosts === SOCIAL_TABS.FRIEND_USERS} onClick={toggleTab(SOCIAL_TABS.FRIEND_USERS)}>
            Friends
          </Tab>
        </TabBar>
      </Sticky>
      {renderSocialPosts()}
    </>
  )
}
