import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import styled from 'styled-components'
import SupperGroupHistoryIcon from '../../assets/supper/SupperGroupHistoryIcon.svg'
import BottomNavBar from '../../components/Mobile/BottomNavBar'
import TopNavBar from '../../components/Mobile/TopNavBar'
import { PlusButton } from '../../components/Supper/PlusButton'
import { RootState } from '../../store/types'
import { PATHS } from '../Routes'
import LoadingSpin from '../../components/LoadingSpin'
import { V1_BACKGROUND, V1_RED } from '../../common/colours'
import { SupperSearchBar } from '../../components/Supper/SupperSearchBar'
import { Filter, HomeSupperGroup } from '../../store/supper/types'
import { SupperGroupCard } from '../../components/Supper/SupperGroupCard'
import InfoCircleOutlined from '@ant-design/icons/lib/icons/InfoCircleOutlined'
import { Tooltip } from 'antd'
import { FilterBubbles } from '../../components/Supper/FilterBubbles'
import { setSupperGroup } from '../../store/supper/action/setter'
import { initSupperGroup } from '../../store/stubs'
import PullToRefreshRH from '../../components/PullToRefreshRH'
import { getSupperHomePageDetails } from '../../store/supper/action/level2'

const Background = styled.div`
  display: grid;
  grid-template-rows: min-content 1fr min-content;
  grid-template-areas: '.' '.' '.';
  height: 100vh;
  width: 100vw;
  background: ${V1_BACKGROUND};
  position: relative;
`

const StickyContainer = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  z-index: 3;
  padding-bottom: 10px;
  background-color: ${V1_BACKGROUND};
  width: inherit;
`

const PlusButtonDiv = styled.div`
  position: fixed;
  bottom: 60px;
  z-index: 3;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 50%;
`

const SupperGroupContainer = styled.div`
  overflow: scroll;
  margin-top: -20px;
`

const NoSupperGroupText = styled.text`
  margin: auto;
  display: flex;
  justify-content: center;
  font-size: 18px;
  margin-top: 2rem;
`

const SupperGroupHistoryContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`

const SupperGroupHistoryDescription = styled.div`
  color: ${V1_RED};
  font-size: 10px;
  line-height: 8px;
`

const SupperGroupHistoryImg = styled.img`
  width: 2rem;
  margin: 0 0px auto auto;
`

const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 13px 0 23px;
`

const InfoIcon = styled(InfoCircleOutlined)`
  font-size: 21px;
  padding: 0 10px 0 15px;
`

export default function Supper() {
  const dispatch = useDispatch()
  const history = useHistory()
  const {
    searchValue,
    filteredSupperGroups,
    allSupperGroups,
    isLoading,
    closingTimeFilter,
    amountLeftFilter,
    restaurantFilter,
  } = useSelector((state: RootState) => state.supper)

  const rightIcon = (
    <SupperGroupHistoryContainer>
      <SupperGroupHistoryImg
        src={SupperGroupHistoryIcon}
        alt="My Supper Groups"
        onClick={() => history.push(PATHS.SUPPER_HISTORY)}
      />
      <SupperGroupHistoryDescription>History</SupperGroupHistoryDescription>
    </SupperGroupHistoryContainer>
  )

  useEffect(() => {
    dispatch(getSupperHomePageDetails())
    dispatch(setSupperGroup(initSupperGroup)) // to prevent create group page from being filled with other group details
  }, [dispatch])

  let supperGroups: HomeSupperGroup[] | null = allSupperGroups
  let errorText = 'Hungry? Start a supper group!'
  if (
    searchValue ||
    closingTimeFilter !== Filter.DEFAULT ||
    amountLeftFilter !== Filter.DEFAULT ||
    restaurantFilter.length
  ) {
    supperGroups = filteredSupperGroups
  }

  if (supperGroups.length === 0) {
    errorText = 'No supper groups found.'
  }
  return (
    <PullToRefreshRH>
      <Background>
        <StickyContainer>
          <TopNavBar leftIcon={true} title="Supper Time" rightComponent={rightIcon} />
          <SearchContainer>
            <SupperSearchBar />
            <Tooltip
              zIndex={3}
              style={{ position: 'relative' }}
              overlayInnerStyle={{ borderRadius: '5px' }}
              placement="bottomRight"
              title="You may search for a supper group directly by typing the owner’s name, supper group name, or the supper group ID"
            >
              <InfoIcon />
            </Tooltip>
          </SearchContainer>
          <FilterBubbles />
        </StickyContainer>
        {isLoading ? (
          <LoadingSpin />
        ) : (
          <>
            <SupperGroupContainer>
              {supperGroups.length ? (
                supperGroups.map((supperGroup, index) => (
                  <SupperGroupCard isHome key={index} homeSupperGroup={supperGroup} />
                ))
              ) : (
                <NoSupperGroupText>{errorText}</NoSupperGroupText>
              )}
            </SupperGroupContainer>
          </>
        )}
        <PlusButtonDiv>
          <PlusButton onClick={() => history.push(`${PATHS.CREATE_SUPPER_GROUP}/1`)} />
        </PlusButtonDiv>
        <BottomNavBar />
      </Background>
    </PullToRefreshRH>
  )
}
