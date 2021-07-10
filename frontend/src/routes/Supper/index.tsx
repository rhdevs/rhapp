import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import styled from 'styled-components'
import SupperGroupHistoryIcon from '../../assets/supper/SupperGroupHistoryIcon.svg'
import BottomNavBar from '../../components/Mobile/BottomNavBar'
import TopNavBar from '../../components/Mobile/TopNavBar'
import { PlusButton } from '../../components/Supper/PlusButton'
import { getAllSupperGroups } from '../../store/supper/action'
import { RootState } from '../../store/types'
import { PATHS } from '../Routes'
import LoadingSpin from '../../components/LoadingSpin'
import { V1_BACKGROUND } from '../../common/colours'
import { SupperSearchBar } from '../../components/Supper/SupperSearchBar'
import { HomeSupperGroup } from '../../store/supper/types'
import { SupperGroupCard } from '../../components/Supper/SupperGroupCard'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import PullToRefresh from 'pull-to-refresh-react'
import { onRefresh } from '../../common/reloadPage'

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

const SupperGroupHistoryImg = styled.img`
  width: 2.5rem;
  margin: 0 -15px auto auto;
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
  const { searchValue, searchedSupperGroups, allSupperGroups, isLoading } = useSelector(
    (state: RootState) => state.supper,
  )

  const rightIcon = (
    <SupperGroupHistoryImg
      src={SupperGroupHistoryIcon}
      alt={'My Supper Groups'}
      onClick={() => history.push(`${PATHS.SUPPER_GROUP_OVERVIEW}/created`)}
    />
  )

  useEffect(() => {
    dispatch(getAllSupperGroups())
  }, [dispatch])

  console.log(searchedSupperGroups)
  let supperGroups: HomeSupperGroup[] | null = allSupperGroups
  let errorText = 'Hungry? Start a supper group!'
  if (searchValue) {
    supperGroups = searchedSupperGroups
  }

  if (supperGroups.length === 0 && searchValue) {
    errorText = 'No supper groups found.'
  }
  return (
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
      </StickyContainer>
      <PullToRefresh onRefresh={onRefresh}>
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
      </PullToRefresh>
      <BottomNavBar />
    </Background>
  )
}
