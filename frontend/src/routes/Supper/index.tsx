import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import styled from 'styled-components'
import SupperGroupHistory from '../../assets/supper/SupperGroupHistory.svg'
import BottomNavBar from '../../components/Mobile/BottomNavBar'
import SearchBar from '../../components/Mobile/SearchBar'
import TopNavBar from '../../components/Mobile/TopNavBar'
import { MainSGCard } from '../../components/Supper/CustomCards/MainSGCard'
import { PlusButton } from '../../components/Supper/PlusButton'
import {
  getAllSupperGroups,
  getSearchedSupperGroups,
  readableSupperGroupId,
  setSearchValue,
  unixTo12HourTime,
} from '../../store/supper/action'
import { RootState } from '../../store/types'
import { PATHS } from '../Routes'
import LoadingSpin from '../../components/LoadingSpin'

const Background = styled.div`
  height: 100vh;
  width: 100vw;
  background: #fafaf4;
  position: relative;
`

const PlusButtonDiv = styled.div`
  position: absolute;
  bottom: 60px;
  z-index: 1000;
  left: 50%;
  transform: translate(-50%, -50%);
`

const SupperGroupContainer = styled.div`
  height: 80vh;
  overflow: scroll;
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
  margin: 0 0 auto auto;
`

export default function Supper() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { searchValue, searchedSupperGroups, allSupperGroups, isLoading } = useSelector(
    (state: RootState) => state.supper,
  )

  const rightIcon = (
    <SupperGroupHistoryImg
      src={SupperGroupHistory}
      alt={'My Supper Groups'}
      onClick={() => history.push(`${PATHS.SUPPER_GROUP_OVERVIEW}/created`)}
    />
  )

  const onChange = (input: string) => {
    console.log(input)
    dispatch(setSearchValue(input))
    dispatch(getSearchedSupperGroups(input))
  }

  useEffect(() => {
    dispatch(getAllSupperGroups())
  }, [dispatch])

  console.log(searchedSupperGroups)
  const supperGroups = searchValue
    ? searchedSupperGroups.length
      ? searchedSupperGroups
      : null
    : allSupperGroups.length
    ? allSupperGroups
    : null

  return (
    <Background>
      <TopNavBar title="Supper Order" rightComponent={rightIcon} />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <>
          <SearchBar placeholder="Search for restaurants!" value={searchValue} onChange={onChange} />
          <SupperGroupContainer>
            {supperGroups ? (
              supperGroups.map((supperGroup, index) => {
                const onClick = () => {
                  if (
                    supperGroup.ownerId === localStorage.userID ||
                    (supperGroup.userIdList ?? []).includes(localStorage.userID)
                  ) {
                    //user is owner or already has an ongoing order
                    history.push(`${PATHS.VIEW_ORDER}/${supperGroup.supperGroupId}`)
                  } else {
                    //new SG to user
                    history.push(`${PATHS.JOIN_ORDER}/${supperGroup.supperGroupId}`)
                  }
                }
                return (
                  <MainSGCard
                    key={index}
                    title={supperGroup.supperGroupName}
                    time={unixTo12HourTime(supperGroup.closingTime)}
                    users={supperGroup.numOrders}
                    orderId={readableSupperGroupId(supperGroup.supperGroupId)}
                    onClick={onClick}
                  />
                )
              })
            ) : searchValue ? (
              <NoSupperGroupText>No supper groups found.</NoSupperGroupText>
            ) : (
              <NoSupperGroupText>Hungry? Start a supper group!</NoSupperGroupText>
            )}
          </SupperGroupContainer>
          <PlusButtonDiv>
            <PlusButton onClick={() => history.push(PATHS.CREATE_SUPPER_GROUP)} />
          </PlusButtonDiv>
          <BottomNavBar />
        </>
      )}
    </Background>
  )
}
