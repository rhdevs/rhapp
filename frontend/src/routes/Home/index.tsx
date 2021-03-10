import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import 'antd/dist/antd.css'
import { PATHS } from '../Routes'
import { Button } from 'antd'
// import { SearchOutlined } from '@ant-design/icons'
import AnnouncementCarousel from '../../components/Mobile/AnnouncementCarousel'
import SocialSection from './components/SocialSection'
import BottomNavBar from '../../components/Mobile/BottomNavBar'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetail } from '../../store/social/action'
import { RootState } from '../../store/types'
import laundry_icon from '../../assets/newIcons/washer.svg'
import facilities_icon from '../../assets/newIcons/booking.svg'
import calendar_icon from '../../assets/calenderIconSelected.svg'
import supper_icon from '../../assets/newIcons/fast-food.svg'

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

const ButtonGroup = styled.div`
  text-align: -webkit-center;
`

const ActionButton = styled(Button)`
  width: 130px;
  height: 80px !important;
  border-radius: 28px !important;
  margin: 7px 18px !important;
  background: rgb(224 101 83 / 86%) !important;
  border-color: rgb(224 101 83 / 86%) !important;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

  .ant-btn-icon-only:hover {
    background: #e18375 !important;
    border-color: #e18375 !important;
  }
}
`

const ImageButton = styled.img<{ filter: string }>`
  fill: #fff;
  max-height: 35px;
  max-width: 35px;
  margin-right: 5px;
  filter: ${(props) => props.filter};
`

export default function Home() {
  const history = useHistory()
  const dispatch = useDispatch()
  const { name } = useSelector((state: RootState) => state.social)

  const hours = new Date(Date.now()).getHours()
  const partOfTheDay = hours < 12 ? 'Morning' : hours < 18 ? 'Afternoon' : 'Evening'

  useEffect(() => {
    dispatch(getUserDetail())
  }, [dispatch])

  const buttons = [
    {
      name: 'facilities',
      src: facilities_icon,
      filter: 'invert(1)',
      clickHandler: () => {
        history.push(PATHS.FACILITY_BOOKING_MAIN)
      },
    },
    {
      name: 'calendar',
      src: calendar_icon,
      filter: 'brightness(5)',
      clickHandler: () => {
        history.push(PATHS.SCHEDULE_PAGE)
      },
    },
    {
      name: 'laundry',
      src: laundry_icon,
      filter: 'invert(1)',
      clickHandler: () => {
        history.push(PATHS.LAUNDRY_MAIN)
      },
    },
    {
      name: 'supper',
      src: supper_icon,
      filter: 'invert(1)',
      clickHandler: () => {
        //
      },
    },
  ]

  return (
    <MainContainer>
      <TopBar>
        <Greetings>
          Good {partOfTheDay} {name}!
        </Greetings>
        {/* <SearchOutlined onClick={() => history.push(PATHS.SEARCH_PAGE)} style={{ fontSize: 25, color: '#fff' }} /> */}
      </TopBar>
      <AnnouncementCarousel />
      <ButtonGroup>
        {buttons.map((button) => (
          // <ActionButton src={button.src} alt={button.name} key={button.name} onClick={button.clickHandler} />
          <ActionButton
            type="primary"
            icon={<ImageButton filter={button.filter} src={button.src} />}
            key={button.name}
            onClick={button.clickHandler}
          >
            {' ' + button.name.charAt(0).toUpperCase() + button.name.slice(1)}
          </ActionButton>
        ))}
      </ButtonGroup>
      <SocialSection />
      <BottomNavBar />
    </MainContainer>
  )
}
