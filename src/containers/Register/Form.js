import React from 'react';

import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';

import {
  FormBuilder,
  Field,
  FieldError,
  Validators
} from '../../components/Form';

import './Register.css';

const Form = props => {
  return (
    <form
      className="auth-form"
      onSubmit={event =>
        props.handleSubmit(event, props.values, props.register)
      }
    >
      <Field
        name="email"
        placeholder="Enter email"
        formFieldProps={{
          label: 'email',
          value: props.values.email,
          onChange: props.handleChange
        }}
        Component={Input}
        renderFormError={() => <FieldError errors={props.formErrors.email} />}
      />

      <Field
        name="password"
        placeholder="Enter password"
        formFieldProps={{
          label: 'password',
          type: 'password',
          value: props.values.password,
          onChange: props.handleChange
        }}
        Component={Input}
        renderFormError={() => (
          <FieldError errors={props.formErrors.password} />
        )}
      />

      <Field
        name="passwordConfirm"
        placeholder="Confirm password"
        formFieldProps={{
          label: 'passwordConfirm',
          type: 'password',
          value: props.values.passwordConfirm,
          onChange: props.handleChange
        }}
        Component={Input}
        renderFormError={() => (
          <FieldError errors={props.formErrors.passwordConfirm} />
        )}
      />

      {props.registrationError && (
        <FormHelperText className="auth-form-error">
          {props.registrationError}
        </FormHelperText>
      )}

      <Button
        variant="contained"
        color="primary"
        label="Submit"
        type="submit"
        className="auth-submit-button"
      >
        Create an account
      </Button>
    </form>
  );
};

const RegisterForm = FormBuilder({
  state: {
    values: {
      email: '',
      password: '',
      passwordConfirm: ''
    },
    formErrors: {
      email: [],
      password: [],
      passwordConfirm: []
    }
  },
  validators: {
    email: [
      [Validators.isRequired, 'Email is required.'],
      [Validators.isEmail, 'Email is invalid.']
    ],
    password: [
      [Validators.isRequired, 'Password is required.'],
      [Validators.isMinLength(6), 'Password must be atleast 6 character'],
      [
        Validators.isMaxLength(20),
        'Password cannot be longer than 20 characters.'
      ]
    ],
    passwordConfirm: [
      [Validators.isRequired, 'Password confirmation is required.']
    ]
  }
})(Form);

export default RegisterForm;
