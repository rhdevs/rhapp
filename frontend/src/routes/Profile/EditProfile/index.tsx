import React, { useState } from 'react'
import styled from 'styled-components'
import 'antd/dist/antd.css'
import EditPersonalInfoContainer from '../Components/EditPersonalInfoContainer'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import { RootState } from '../../../store/types'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import {
  fetchAllCCAs,
  fetchUserCCAs,
  fetchUserDetails,
  handleCCADetails,
  handleModuleDetails,
} from '../../../store/profile/action'
import { AutoComplete, Card } from 'antd'
import deleteIcon from '../../../assets/cancel.svg'
import plusCircle from '../../../assets/plusCircle.svg'
import tickIcon from '../../../assets/tick.svg'

const MainContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #fafaf4;
`

const ProfileComponent = styled.div`
  background-color: #fafaf4;
  width: 100vw;
`

const CardContainer = styled.div`
  position: relative;
  width: 80vw;
  margin: 0 auto;
`

interface Details {
  title: string
}

export default function EditProfile() {
  const dispatch = useDispatch()
  const { user, ccas, allCcas } = useSelector((state: RootState) => state.profile)

  useEffect(() => {
    dispatch(fetchUserDetails(localStorage.getItem('userID')))
    dispatch(fetchUserCCAs(localStorage.getItem('userID')))
    dispatch(fetchAllCCAs())
  }, [dispatch])

  // Visibility dropdown
  // POSTPONED DUE TO FRIENDS FEATURE
  // const { Option } = Select

  // POSTPONED DUE TO FRIENDS FEATURE
  // function handleChange(value) {
  //   console.log(`selected ${value}`)
  // }

  // POSTPONED DUE TO FRIENDS FEATURE
  // const VisibilitySelector = () => {
  //   return (
  //     <Select defaultValue="Everybody" style={{ width: 120, float: 'right' }} onChange={handleChange}>
  //       <Option value="Everybody">Everybody</Option>
  //       <Option value="Friends">Friends</Option>
  //       <Option value="Only Me">Only Me</Option>
  //     </Select>
  //   )
  // }

  // Search bar
  const options = [
    { value: 'Basketball (MALE)' },
    { value: 'Badminton (MALE)' },
    { value: 'Handball (MALE)' },
    { value: 'Board of Photography' },
  ]

  let ccaToBeAdded = ''
  let moduleToBeAdded = ''
  const handleChangeAutoComplete = (type: string) => (value: string) => {
    switch (type) {
      case 'CCAs':
        ccaToBeAdded = value
        break
      case 'Modules':
        moduleToBeAdded = value
        break
      default:
    }
  }

  const handleAutoCompleteAdd = (type: string, cca: string, module: string) => {
    switch (type) {
      case 'CCAs':
        if (cca !== '') {
          const ccaObj = allCcas.find((o) => o.ccaName === cca)
          if (ccaObj !== undefined) {
            dispatch(handleCCADetails('Add', ccaObj))
          }
        }
        break
      case 'Modules':
        if (module !== '') {
          dispatch(handleModuleDetails('Add', module))
        }
        break
      default:
    }
  }

  interface Props {
    type: string
  }

  const Complete: React.FC<Props> = (props) => (
    <>
      <AutoComplete
        style={{ width: '120px', height: '22px' }}
        options={options}
        placeholder="search..."
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        filterOption={(inputValue, option) => option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
        // eslint-disable-next-line react/prop-types
        onChange={handleChangeAutoComplete(props.type)}
      />
      <img
        alt="tickIcon"
        style={{ marginLeft: 10, width: 15, color: 'gray' }}
        src={String(tickIcon)}
        // eslint-disable-next-line react/prop-types
        onClick={() => handleAutoCompleteAdd(props.type, ccaToBeAdded, moduleToBeAdded)}
      ></img>
    </>
  )

  const EditDetailsItem = (detailsItem: Details) => {
    const [searchInfoSelected, setSearchInfoSelected] = useState(false)

    function plusCircleClicked() {
      setSearchInfoSelected(!searchInfoSelected)
    }

    const deleteIconClicked = (itemType: 'cca' | 'module', itemToBeDeleted: string) => {
      switch (itemType) {
        case 'cca':
          const ccaObj = allCcas.find((o) => o.ccaName === itemToBeDeleted)
          if (ccaObj != undefined) {
            dispatch(handleCCADetails('Delete', ccaObj))
          }
          break
        case 'module':
          dispatch(handleModuleDetails('Delete', itemToBeDeleted))
          break
      }
    }

    const renderSwitch = (detailsTitle: string) => {
      switch (detailsTitle) {
        case 'CCAs': {
          return ccas?.map((cca) => {
            return (
              <div key={cca.ccaID}>
                <span
                  style={{
                    backgroundColor: '#F5F5F5',
                    padding: '9px 16px',
                    borderRadius: '9px',
                    lineHeight: '40px',
                    margin: '10px',
                  }}
                  onClick={() => deleteIconClicked('cca', cca.ccaName)}
                >
                  {cca.ccaName}
                  <img alt="deleteIcon" style={{ marginLeft: 5, width: 6 }} src={String(deleteIcon)} />
                </span>
                <br />
              </div>
            )
          })
        }

        case 'Modules': {
          return user.modules?.map((module) => {
            return (
              <div key={module}>
                <span
                  style={{
                    backgroundColor: '#F5F5F5',
                    padding: '9px 16px',
                    borderRadius: '9px',
                    lineHeight: '40px',
                    margin: '10px',
                  }}
                >
                  {module}
                  <img
                    alt="deleteIcon"
                    style={{ marginLeft: 5, width: 6 }}
                    src={String(deleteIcon)}
                    onClick={() => deleteIconClicked('module', module)}
                  />
                </span>
              </div>
            )
          })
        }

        default:
          return <></>
      }
    }

    return (
      <div className="site-card-border-less-wrapper">
        <Card
          title={
            <span>
              <span style={{ fontSize: '20px' }}>
                <span style={{ display: 'inline-flex', flexDirection: 'column' }}>{detailsItem.title}</span>
                <img
                  alt="plusCircle"
                  style={{ marginLeft: 10, width: 15 }}
                  src={String(plusCircle)}
                  onClick={plusCircleClicked}
                />
                {/* VISIBILITY SELECTOR POSTPONED -->  NO FRIENDS FUNCTION */}
                {/* <VisibilitySelector /> */}
              </span>
              {searchInfoSelected ? (
                <span style={{ display: 'block' }}>
                  <Complete type={detailsItem.title} />
                </span>
              ) : (
                <></>
              )}
            </span>
          }
          bordered={false}
          style={{ width: '80vw' }}
          size={'small'}
        >
          {renderSwitch(detailsItem.title)}
        </Card>
      </div>
    )
  }

  const EditDetailsCard = () => {
    return (
      <>
        <EditDetailsItem title="CCAs" />
        <EditDetailsItem title="Modules" />
      </>
    )
  }

  return (
    <>
      <MainContainer>
        <TopNavBar title={'Edit Profile'} />
        <ProfileComponent>
          <EditPersonalInfoContainer />
          <CardContainer>
            <EditDetailsCard />
          </CardContainer>
        </ProfileComponent>
        <BottomNavBar />
      </MainContainer>
    </>
  )
}
