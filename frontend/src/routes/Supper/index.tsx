import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import styled from 'styled-components'
import SupperGroupHistory from '../../assets/supper/SupperGroupHistory.svg'
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

const Background = styled.div`
  height: 100vh;
  width: 100vw;
  background: ${V1_BACKGROUND};
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
      <TopNavBar title="Supper Order" rightComponent={rightIcon} />
      <SupperSearchBar />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <>
          <SupperGroupContainer>
            {supperGroups.length ? (
              supperGroups.map((supperGroup, index) => {
                // const onClick = () => {
                //   if (
                //     !(
                //       supperGroup.ownerId === localStorage.userID ||
                //       (supperGroup.userIdList ?? []).includes(localStorage.userID)
                //     )
                //   ) {
                //     console.log(supperGroup.ownerId === localStorage.userID)
                //     console.log((supperGroup.userIdList ?? []).includes(localStorage.userID))
                //     //user is owner or already has an ongoing order
                //     history.push(`${PATHS.VIEW_ORDER}/${supperGroup.supperGroupId}`)
                //   } else {
                //     //new SG to user
                //     history.push(`${PATHS.JOIN_ORDER}/${supperGroup.supperGroupId}`)
                //   }
                // }
                return <SupperGroupCard isHome key={index} homeSupperGroup={supperGroup} />
              })
            ) : (
              <NoSupperGroupText>{errorText}</NoSupperGroupText>
            )}
          </SupperGroupContainer>
          <PlusButtonDiv>
            <PlusButton onClick={() => history.push(`${PATHS.CREATE_SUPPER_GROUP}/1`)} />
          </PlusButtonDiv>
          <BottomNavBar />
        </>
      )}
      <PlusButtonDiv>
        <PlusButton onClick={() => history.push(`${PATHS.CREATE_SUPPER_GROUP}/1`)} />
      </PlusButtonDiv>
      <BottomNavBar />
    </Background>
  )
}
