import {combineReducers} from 'redux'
import {videoReducer} from './videoReducer'
import {photoReducer} from './photoReducer'
import {userReducer} from './userReducer'
export const rootReducer = combineReducers({
  videos: videoReducer,
  photos: photoReducer,
  userInfo: userReducer
})
