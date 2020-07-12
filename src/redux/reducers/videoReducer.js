const initState=[]

export const videoReducer = (state=initState, action) => {
  switch (action.type){
    case "VIDEO/LOAD":
      return action.payload
    default:
      return state
  }
}
