import { combineReducers } from 'redux-immutable';
import { connectRouter } from 'connected-react-router/immutable';

import history from './utils/history';
import globalReducer from './containers/App/reducer';
import loginReducer from './containers/Login/reducer';
import registerReducer from './containers/Register/reducer';

export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    router: connectRouter(history),
    global: globalReducer,
    login: loginReducer,
    register: registerReducer,
    ...injectedReducers
  });

  return rootReducer;
}
