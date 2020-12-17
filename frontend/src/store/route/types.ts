import { PATHS } from '../../routes/Routes'

export enum ROUTE_ACTIONS {
  REDIRECT = 'ROUTE_ACTIONS.REDIRECT',
}

type Redirect = {
  type: typeof ROUTE_ACTIONS.REDIRECT
  redirectTo: PATHS | null
}

export type ActionTypes = Redirect
