
export const userReducer = (state={}, action) => {
  switch (action.type){
    case "USER/LOADINFO":
      return action.payload
    default:
      return state
  }
}
