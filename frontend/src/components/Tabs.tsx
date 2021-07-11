import React, { useState } from 'react'

import styled from 'styled-components'
import { V1_BLUE } from '../common/colours'

const MainContainer = styled.div`
  position: relative;
`

const MainTabsContainer = styled.div<{ isSticky?: boolean; width?: string; margin?: string }>`
  ${(props) =>
    props.isSticky &&
    `position: sticky;
  top: 0;
  left: 0;`}
  display: flex;
  flex-direction: row;
  height: fit-content;
  margin: ${(props) => props.margin ?? '0 0 10px0 '};
  ${(props) => props.width && `width: ${props.width};`}
`

const TabContainer = styled.div<{ isSelected?: boolean }>`
  flex: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
  color: ${(props) => (props.isSelected ? V1_BLUE : 'rgba(0, 0, 0, 0.55)')};
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
`

const Separator = styled.div`
  width: 1px;
  background-color: rgba(0, 0, 0, 0.5);
  height: 17px;
`

const ChildContainer = styled.div``

//NOTE: Values and children is assumed to correspond according to their indexes!
type Props = {
  defaultValue?: number
  width?: string
  margin?: string
  isSticky?: boolean
  valueNamesArr
  childrenArr
}

export const Tabs = (props: Props) => {
  const [currentTab, setCurrentTab] = useState<number>(props.defaultValue ?? 1)

  const selectedChild = () => {
    const index = currentTab - 1
    return props.childrenArr[index]
  }

  return (
    <MainContainer>
      <MainTabsContainer isSticky={props.isSticky} width={props.width} margin={props.margin}>
        {props.valueNamesArr.map((valueName, index) => {
          const isSelected = props.valueNamesArr.indexOf(valueName) === currentTab - 1
          return (
            <>
              <TabContainer key={index} onClick={() => setCurrentTab(index + 1)} isSelected={isSelected}>
                {valueName}
              </TabContainer>
              {index !== props.valueNamesArr.length - 1 && <Separator />}
            </>
          )
        })}
      </MainTabsContainer>
      <ChildContainer>{selectedChild()}</ChildContainer>
    </MainContainer>
  )
}
