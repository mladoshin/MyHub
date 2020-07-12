const initState=[]

export const photoReducer = (state=initState, action) => {
  switch (action.type){
    case "PHOTO/LOAD":
      return action.payload
    default:
      return state
  }
}
