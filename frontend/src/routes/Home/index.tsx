import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import 'antd/dist/antd.css'
import { PATHS } from '../Routes'
import { SearchOutlined } from '@ant-design/icons'
import AnnouncementCarousel from '../../components/Mobile/AnnouncementCarousel'
import HexagonNavigation from './components/HexagonNavigation'
import SocialSection from './components/SocialSection'
import BottomNavBar from '../../components/Mobile/BottomNavBar'
import { useDispatch } from 'react-redux'
import { DOMAIN_URL, ENDPOINTS } from '../../store/endpoints'

const MainContainer = styled.div`
  width: 100%;
  background-color: #fafaf4;
`

const TopBar = styled.div`
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  width: 100%;
  height: 50px;
  background-color: #de5f4c;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 0px 0px 10px 10px;
  z-index: 999;
`

const Greetings = styled.text`
  font-size: 17px;
  padding-left: 10px;
  color: #fff;
  font-weight: 100;
`

export default function Home() {
  const history = useHistory()
  const dispatch = useDispatch()

  const hours = new Date(Date.now()).getHours()
  const partOfTheDay = hours < 12 ? 'Morning' : hours < 18 ? 'Afternoon' : 'Evening'

  const [username, setUsername] = useState('')

  useEffect(() => {
    fetchUserName(localStorage.getItem('userID'))
  }, [dispatch])

  const fetchUserName = (userID) => {
    fetch(DOMAIN_URL.SOCIAL + ENDPOINTS.USER_DETAILS + '/' + userID, {
      method: 'GET',
      mode: 'cors',
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data === '' || data === undefined) {
          console.log(data.err)
        } else {
          setUsername(data.displayName)
        }
      })
      .catch((err) => console.log(err))
  }

  return (
    <MainContainer>
      <TopBar>
        <Greetings>
          Good {partOfTheDay} {username}!
        </Greetings>
        <SearchOutlined onClick={() => history.push(PATHS.SEARCH_PAGE)} style={{ fontSize: 25, color: '#fff' }} />
      </TopBar>
      <AnnouncementCarousel />
      <HexagonNavigation />
      <SocialSection />
      <BottomNavBar />
    </MainContainer>
  )
}
