
import { handleActions } from 'redux-actions'

const initialState = [{
  text: 'Use Redux',
  completed: false,
  id: 0
}]

export default handleActions({
  'clear complete' (state, action) {
    return state.filter(todo => todo.completed === false)
  }
}, initialState)
