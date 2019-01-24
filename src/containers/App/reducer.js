import { fromJS } from 'immutable';
import * as types from './constants';

const initalState = fromJS({
  appLoading: false, // Global loading indicator
  currentUser: false
});

const reducer = (state = initalState, action) => {
  switch (action.type) {
    // Logged in user
    case types.ADD_USER:
      return state.set('currentUser', fromJS(action.currentUser));
    case types.REMOVE_CURRENT_USER:
      return state.set('currentUser', false);

    // App loading indicator
    case types.APP_RESOURCE_LOADING:
      return state.set('appLoading', true);
    case types.APP_RESOURCE_LOADING_COMPLETE:
      return state.set('appLoading', false);

    default:
      return state;
  }
};

export default reducer;
