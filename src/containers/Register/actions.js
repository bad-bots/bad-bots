import history from '../../utils/history';

import { REGISTRATION_ERROR, RESOLVE_REGISTRATION_ERROR } from './constants';
import { addUser, resourceLoadingComplete } from '../App/actions';

export const registrationError = registrationError => ({
  type: REGISTRATION_ERROR,
  registrationError
});

export const resolveRegistrationError = () => ({
  type: RESOLVE_REGISTRATION_ERROR
});

/* Thunk creators */
export const registerUser = data => {
  return dispatch => {
    dispatch(resolveRegistrationError());

    fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(result => {
        if (result.error) {
          dispatch(registrationError(result.error.message));
        } else {
          dispatch(addUser(result.data));
          history.push('/');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
};
