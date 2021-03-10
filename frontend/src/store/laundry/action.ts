import { Dispatch, GetState } from '../types'
import { ActionTypes, LAUNDRY_ACTIONS, Location, WashingMachine, WMStatus } from './types'
import { ENDPOINTS, DOMAIN_URL } from '../endpoints'

export const SetIsLoading = (desiredState: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: LAUNDRY_ACTIONS.SET_IS_LOADING, isLoading: desiredState })
}

export const getLocationList = () => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch(SetIsLoading(true))
  await fetch(DOMAIN_URL.LAUNDRY + ENDPOINTS.MACHINE_LIST, {
    method: 'GET',
    mode: 'cors',
  })
    .then((resp) => resp.json())
    .then((data) => {
      const blocks = [
        ...new Set(
          data.map((item: Location) => {
            if (item.block === 7 || item.block === 8) {
              return 'Kuok'
            } else {
              return 'Block ' + item.block.toString()
            }
          }),
        ),
      ]
      dispatch({
        type: LAUNDRY_ACTIONS.GET_LOCATION_LIST,
        locations: data,
        blocks: blocks as string[],
        levels: [],
      })
      dispatch(SetIsLoading(false))
    })
}

export const SetBlockLevelSelections = (newBlock: string, newLevel: string) => async (
  dispatch: Dispatch<ActionTypes>,
  getState: GetState,
) => {
  dispatch(SetIsLoading(true))
  const { locations, blocks, selectedLevel, selectedBlock } = getState().laundry

  // If only Block is selected
  if (newLevel === '') {
    newLevel = selectedLevel as string
    const filterLocationByBlock = locations.filter(
      (location) => location.block === parseInt(newBlock ? newBlock?.split(' ')[1] : ''),
    )
    const newLevelList = [...new Set(filterLocationByBlock.map((item: Location) => 'Level ' + item.level.toString()))]
    dispatch({
      type: LAUNDRY_ACTIONS.GET_LOCATION_LIST,
      locations: locations,
      blocks: blocks,
      levels: newLevelList as string[],
    })
    dispatch(SetIsLoading(false))
  } else {
    newBlock = selectedBlock as string
  }
  dispatch({
    type: LAUNDRY_ACTIONS.SET_BLOCK_LEVEL_SELECTIONS,
    selectedBlock: newBlock as string,
    selectedLevel: newLevel as string,
  })
  dispatch(SetIsLoading(false))
  dispatch(SetFilteredMachines(newBlock, newLevel))
}

export const SetFilteredMachines = (selectedBlock: string, selectedLevel: string) => async (
  dispatch: Dispatch<ActionTypes>,
) => {
  dispatch(SetIsLoading(true))
  let returnTable: WashingMachine[] = []

  // iterate i for 3 times so that side 1, side 2 and side 0 are all covered.
  for (let i = 0; i < 3; i++) {
    const queryBlock = selectedBlock === 'Kuok' ? 7 : selectedBlock?.split(' ')[1]
    const queryLevel = selectedBlock === 'Kuok' ? 0 : selectedLevel?.split(' ')[1]
    const queryUrl = DOMAIN_URL.LAUNDRY + ENDPOINTS.LAUNDRY_MACHINE + '?locationID=' + queryBlock + '-' + queryLevel + i
    await fetch(queryUrl, {
      method: 'GET',
      mode: 'cors',
    })
      .then((resp) => resp.json())
      .then((data) => {
        returnTable = returnTable.concat(data)
      })
  }

  const returnTableWithImage: WashingMachine[] = []

  returnTable.forEach((fetchedWashingMachine: WashingMachine) => {
    const userId = fetchedWashingMachine.userID
    if (userId) {
      fetch(DOMAIN_URL.SOCIAL + ENDPOINTS.USER_PROFILE + userId, {
        method: 'GET',
        mode: 'cors',
      })
        .then((resp) => resp.json())
        .then((data) => {
          fetchedWashingMachine.userImage = data.profilePictureUrl
          returnTableWithImage.push(fetchedWashingMachine)
          if (returnTable.length === returnTableWithImage.length) {
            dispatch({
              type: LAUNDRY_ACTIONS.SET_FILTERED_MACHINES,
              filteredMachines: returnTableWithImage as WashingMachine[],
            })
          }
        })
    }
  })

  dispatch(SetIsLoading(false))
}

export const SetSelectedMachineFromId = (machineId: string) => async (dispatch: Dispatch<ActionTypes>) => {
  try {
    const selectedLevel = machineId[0] === '7' ? '0' : 'Level ' + machineId.split('-')[1][1]
    const selectedBlock = machineId[0] === '7' ? 'Kuok' : 'Block ' + machineId[0]
    dispatch({
      type: LAUNDRY_ACTIONS.SET_BLOCK_LEVEL_SELECTIONS,
      selectedBlock: selectedBlock as string,
      selectedLevel: selectedLevel as string,
    })

    const queryBlock = selectedBlock === 'Kuok' ? 7 : selectedBlock?.split(' ')[1]
    const queryLevel = selectedBlock === 'Kuok' ? 0 : selectedLevel?.split(' ')[1]
    let returnTable: WashingMachine[] = []
    // iterate i for 3 times so that side 1, side 2 and side 0 are all covered.
    for (let i = 0; i < 3; i++) {
      const queryUrl =
        DOMAIN_URL.LAUNDRY + ENDPOINTS.LAUNDRY_MACHINE + '?locationID=' + queryBlock + '-' + queryLevel + i
      await fetch(queryUrl, {
        method: 'GET',
        mode: 'cors',
      })
        .then((resp) => resp.json())
        .then((data) => {
          returnTable = returnTable.concat(data)
        })
    }

    const displayMachine = returnTable.find((machine) => machine.machineID === machineId) as WashingMachine
    dispatch({ type: LAUNDRY_ACTIONS.SET_SELECTED_MACHINE, selectedMachine: displayMachine })
  } catch (err) {
    console.log(err)
  }
}

export const SetSelectedMachine = (selectedMachine: WashingMachine) => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch(SetManualEditMode(false))
  dispatch({ type: LAUNDRY_ACTIONS.SET_SELECTED_MACHINE, selectedMachine: selectedMachine })
}

export const SetEditMode = () => async (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { isEdit } = getState().laundry
  dispatch({ type: LAUNDRY_ACTIONS.SET_EDIT_MODE, isEdit: !isEdit })
}

export const SetManualEditMode = (isEdit: boolean) => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: LAUNDRY_ACTIONS.SET_EDIT_MODE, isEdit: isEdit })
}

/**
 *
 * AVAILABLE ---> job: "None" ---> RESERVED
 * AVAILABLE ---> job: not in broken ---> ERROR
 * BROKEN ---> job: not AVAILABLE ---> Error
 * INUSE // ALERTED ---> job: "Completed" ---> AVAILABLE
 * INUSE // ALERTED ---> job: "Alerted" ---> ALERTED
 * WHATEVER ---> job: "Cancelled" ---> AVAILABLE
 *
 **/
export const updateMachine = (updatedState: string, machineID: string) => (
  dispatch: Dispatch<ActionTypes>,
  getState: GetState,
) => {
  const { filteredMachines, duration } = getState().laundry
  let newJob
  switch (updatedState) {
    case 'In Use':
    case 'Reserved':
      newJob = 'None'
      break
    case 'Available':
      newJob = 'Cancelled'
      break
    default:
      newJob = 'None'
  }

  const queryBody: { job: string; machineID: string; userID: string | null; currentDuration: number } = {
    job: newJob,
    machineID: machineID,
    userID: localStorage.getItem('userID'), //TODO: Update userId
    currentDuration: duration * 60,
  }

  fetch(DOMAIN_URL.LAUNDRY + ENDPOINTS.UPDATE_MACHINE, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(queryBody),
  })
    .then((resp) => resp)
    .then((data) => {
      if (data.ok) {
        console.log('success') // TODO: user interaction for successfully booked
      }
    })

  filteredMachines.forEach((machine) => {
    if (machine.machineID === machineID) machine.job = updatedState as WMStatus
  })
  dispatch({ type: LAUNDRY_ACTIONS.SET_FILTERED_MACHINES, filteredMachines: filteredMachines })
}

export const SetDuration = (duration: number) => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: LAUNDRY_ACTIONS.SET_DURATION, duration: duration })
}

export const UpdateJobDuration = (machineID: string) => async (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { duration, filteredMachines } = getState().laundry
  const queryBody: { machineID: string; duration: number } = {
    machineID: machineID,
    duration: duration * 60, // duration should be in second when send to db
  }

  fetch(DOMAIN_URL.LAUNDRY + ENDPOINTS.EDIT_DURATION, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(queryBody),
  })
    .then((resp) => resp)
    .then((data) => {
      if (data.ok) {
        console.log('success')
      }
    })
  filteredMachines.forEach((machine) => {
    if (machine.machineID === machineID) machine.duration = duration * 60 // duration should be in second
  })
  dispatch({ type: LAUNDRY_ACTIONS.SET_FILTERED_MACHINES, filteredMachines: filteredMachines })
}

export const fetchTelegram = (selectedMachine: WashingMachine) => (dispatch: Dispatch<ActionTypes>) => {
  fetch(DOMAIN_URL.FACILITY + ENDPOINTS.TELEGRAM_HANDLE + '/' + selectedMachine.userID, {
    method: 'GET',
    mode: 'cors',
  })
    .then((resp) => resp.json())
    .then((data) => {
      if (data.telegramHandle === '' || data.telegramHandle === undefined) {
        console.log(data.err)
      } else {
        dispatch({ type: LAUNDRY_ACTIONS.SET_TELEGRAM_HANDLE, telegramHandle: data.telegramHandle })
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
