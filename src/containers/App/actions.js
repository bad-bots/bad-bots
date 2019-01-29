import * as types from './constants';
import history from '../../utils/history';

/*  Action creators */

export const addUser = currentUser => ({
  type: types.ADD_USER,
  currentUser
});

export const removeCurrentUser = () => ({
  type: types.REMOVE_CURRENT_USER
});

export const resourceLoading = () => ({
  type: types.APP_RESOURCE_LOADING
});

export const resourceLoadingComplete = () => ({
  type: types.APP_RESOURCE_LOADING_COMPLETE
});

/* Thunk creators */
export const getUser = () => dispatch => {
  return fetch(process.env.REACT_APP_SERVER_URL + 'auth/me')
    .then(response => response.json())
    .then(result => {
      if (!result.error) {
        dispatch(addUser(result.data));
      } else {
        console.error(result.error);
      }
    })
    .catch(error => {
      console.error(error);
    });
};

export const logout = () => dispatch => {
  return fetch(process.env.REACT_APP_SERVER_URL + 'auth/logout', { method: 'POST' })
    .then(response => {
      return response.json();
    })
    .then(result => {
      if (result.error) {
        console.error(result.error);
      } else {
        dispatch(removeCurrentUser());
        history.push('/login');
      }
    })
    .catch(error => {
      console.error(error);
    });
};
