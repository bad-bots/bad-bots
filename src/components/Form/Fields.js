import React from 'react'

import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'

export const Field = props => {
  return (
    <FormControl className="auth-form-field">
      <InputLabel htmlFor={props.name} required={props.required}>
        {props.placeholder}
      </InputLabel>
      {renderField(props.Component, {
        name: props.name,
        ...props.formFieldProps
      })}
      {props.renderFormError()}
    </FormControl>
  )
}

export const renderField = (Component, props) => {
  return <Component {...props} />
}

export const FieldError = props => {
  if (props.errors && props.errors.length > 0) {
    return (
      <FormHelperText className="auth-form-error">
        {props.errors[0]}
      </FormHelperText>
    )
  } else {
    return null
  }
}
