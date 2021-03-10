import React, { useState } from 'react'
import styled from 'styled-components'
import 'antd/dist/antd.css'
import { useHistory } from 'react-router-dom'
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
  setHasChanged,
} from '../../../store/profile/action'
import { AutoComplete, Card } from 'antd'
import deleteIcon from '../../../assets/cancel.svg'
import tickIcon from '../../../assets/tick.svg'
import ConfirmationModal from '../../../components/Mobile/ConfirmationModal'
import { PlusCircleFilled } from '@ant-design/icons'

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
  margin: 0 auto;
`

interface Details {
  title: string
}

export default function EditProfile() {
  const dispatch = useDispatch()
  const history = useHistory()
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [searchInfoSelected, setSearchInfoSelected] = useState(true)
  const { user, ccas, allCcas, hasChanged } = useSelector((state: RootState) => state.profile)

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

  let ccaToBeAdded = ''
  let moduleToBeAdded = ''
  const handleChangeAutoComplete = (type: string) => (value: string) => {
    dispatch(setHasChanged(true))
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
        console.log('failed')
    }
  }

  interface Props {
    type: string
  }

  const Complete: React.FC<Props> = (props: Props) => (
    <>
      <AutoComplete
        style={{ width: '120px', height: '22px' }}
        options={
          props.type === 'CCAs'
            ? allCcas?.map((cca) => ({
                value: cca.ccaName,
              }))
            : []
        }
        placeholder="search..."
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        filterOption={(inputValue, option) => option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
        onChange={handleChangeAutoComplete(props.type)}
      />
      <img
        alt="tickIcon"
        style={{ marginLeft: 10, width: 15, color: 'gray' }}
        src={String(tickIcon)}
        onClick={() => handleAutoCompleteAdd(props.type, ccaToBeAdded, moduleToBeAdded)}
      ></img>
    </>
  )

  const EditDetailsItem = (detailsItem: Details) => {
    const plusCircleClicked = () => {
      setSearchInfoSelected((searchInfoSelected) => !searchInfoSelected)
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
                  onClick={() => {
                    dispatch(setHasChanged(true))
                    deleteIconClicked('cca', cca.ccaName)
                  }}
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
                    onClick={() => {
                      dispatch(setHasChanged(true))
                      deleteIconClicked('module', module)
                    }}
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
                <PlusCircleFilled
                  style={{ color: '#EB5757', fontSize: '23px', paddingRight: '7px', paddingTop: '3px', marginLeft: 10 }}
                  onClick={() => {
                    plusCircleClicked()
                    dispatch(setHasChanged(true))
                  }}
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
    <MainContainer>
      <TopNavBar
        title={'Edit Profile'}
        onLeftClick={() => {
          hasChanged ? setShowConfirmationModal(true) : history.goBack()
        }}
      />
      {showConfirmationModal && (
        <ConfirmationModal
          title={'Discard Changes?'}
          hasLeftButton={true}
          leftButtonText={'Discard Edits'}
          onLeftButtonClick={() => history.goBack()}
          rightButtonText={'Back to Edit'}
          onRightButtonClick={() => setShowConfirmationModal(false)}
        />
      )}
      <ProfileComponent>
        <EditPersonalInfoContainer />
        <CardContainer>
          <EditDetailsCard />
        </CardContainer>
      </ProfileComponent>
      <BottomNavBar />
    </MainContainer>
  )
}
