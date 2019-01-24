import React from 'react'
import {isArray, isEqual, sortBy, debounce} from 'lodash'
import invariant from 'invariant'

/**
 *
 * @param {object} controllers
 * controller = {'fieldName': ['fieldValue', [validators]] }
 * Each fieldName must be a string.
 * The first item in the array must be the field value
 * The rest of the items in the array must be valid validators.
 */
const validateFieldControllers = (formApplicationData, hasOwnState) => {
  const hasValidators = !!formApplicationData.validators

  if (!hasOwnState) {
    const {state} = formApplicationData
    invariant(
      state.hasOwnProperty('values'),
      "State object requires 'values' field"
    )

    if (hasValidators) {
      invariant(
        state.hasOwnProperty('formErrors'),
        "State object requires 'formErrors' field"
      )
    }
  }

  if (hasValidators) {
    /* TODO: Verify that validators are valid */
    Object.keys(formApplicationData.validators).forEach(field => {
      const fieldValidators = formApplicationData.validators[field]
      invariant(
        isArray(fieldValidators),
        'Validators must be an array of arrays'
      )
      for (let i = 0; i < fieldValidators.length; i++) {
        const validator = fieldValidators[i]
        invariant(
          isArray(validator),
          `Each Validator must be an array got \n '${String(validator)}'`
        )
      }
    })
  }
}

/**
 * @param {object} fieldControllers
 * @param {boolean} options.hasOwnState true if form has it's own state
 */

const defaultOptions = {
  hasOwnState: false
}

export default function FormBuilder(
  formApplicationData,
  options = defaultOptions
) {
  validateFieldControllers(formApplicationData, options.hasOwnState)

  return WrappedComponent => {
    return class extends React.Component {
      constructor(props) {
        super(props)

        this.validators = formApplicationData.validators

        if (!options.hasOwnState) {
          this.state = this.initializeState(formApplicationData.state)
        }

        this.setState = this.setState.bind(this)
      }

      initializeState(state) {
        // Set field values if they were passed in as props
        state.values = Object.keys(state.values).reduce((values, field) => {
          values[field] =
            (this.props.initialData && this.props.initialData[field]) ||
            state.values[field] ||
            ''

          return values
        }, {})
        return state
      }

      getStateValues(fieldControllers) {
        return Object.keys(fieldControllers).reduce(
          (acum, curr) => {
            if (!options.hasOwnState) {
              acum.values[curr] = this.props[curr] || ''
              acum.formErrors[curr] = []
            }
            acum.validators[curr] = fieldControllers[curr].validators
            return acum
          },
          {values: {}, formErrors: {}, validators: {}}
        )
      }

      updateStateFieldValue = (field, value) => {
        this.setState(state => ({
          ...state,
          values: {...state.values, [field]: value}
        }))
      }

      updateStateFieldErrors = (field, errors) => {
        if (!isEqual(sortBy(this.state.formErrors[field]), sortBy(errors))) {
          this.setState(state => ({
            ...state,
            formErrors: {...state.formErrors, [field]: errors}
          }))
        }
      }

      updateStateFormErrors = validationErrors => {
        this.setState(state => ({
          ...state,
          formErrors: validationErrors
        }))
      }

      handleFileChange = (
        event,
        updateStateFieldValue,
        updateStateFieldErrors
      ) => {
        updateStateFieldValue = options.hasOwnState
          ? updateStateFieldValue
          : updateStateFieldValue || this.updateStateFieldValue

        updateStateFieldErrors = options.hasOwnState
          ? updateStateFieldErrors
          : updateStateFieldErrors || this.updateStateFieldErrors

        const {name, files} = event.target
        if (options.hasOwnState) {
          updateStateFieldValue(name, files)
        } else {
          updateStateFieldValue(name, files, this.setState)
        }

        const errors = this.validateController(name, files)
        if (options.hasOwnState) {
          updateStateFieldErrors(name, errors)
        } else {
          updateStateFieldErrors(name, errors, this.setState)
        }
      }

      handleChange = (event, updateStateFieldValue, updateStateFieldErrors) => {
        // If option.hasOwnState is true then update state functions
        // must be passed. Else, it's optional
        updateStateFieldValue = options.hasOwnState
          ? updateStateFieldValue
          : updateStateFieldValue || this.updateStateFieldValue

        updateStateFieldErrors = options.hasOwnState
          ? updateStateFieldErrors
          : updateStateFieldErrors || this.updateStateFieldErrors

        const {name, value} = event.target

        if (options.hasOwnState) {
          updateStateFieldValue(name, value)
        } else {
          updateStateFieldValue(name, value, this.setState)
        }

        event.persist()
        this.debounceChange(event, updateStateFieldErrors)
      }

      debounceChange = (event, callback) => {
        this.debouncedChange = debounce(() => {
          this.makeChange(event, callback)
        }, 800)
        this.debouncedChange(event)
      }

      makeChange = (event, callback) => {
        const fieldName = event.target.name
        const value = event.target.value

        const errors = this.validateController(fieldName, value)
        if (options.hasOwnState) {
          callback(fieldName, errors)
        } else {
          callback(fieldName, errors, this.setState)
        }
      }

      handleSubmit = (event, values, formValidCallback, formErrorCallback) => {
        formErrorCallback = options.hasOwnState
          ? formErrorCallback
          : this.updateStateFormErrors

        event.preventDefault()
        this.debouncedChange && this.debouncedChange.cancel()

        const [errorsExist, validationErrors] = this.validateAll(values)
        if (errorsExist) {
          formErrorCallback(validationErrors)
        } else {
          formValidCallback(values)
        }
      }

      getValidator(validator) {
        // Check to see if error message was passed
        if (validator.length === 1) {
          return [validator[0], 'Field is invalid']
        } else {
          return validator
        }
      }
      /*
       * Validate a controller
       * currValue parameter is passed when controller.value is behind
       * one value since setState is asynchronous
       */
      validateController = (fieldName, currValue) => {
        const errors = []

        if (this.validators.hasOwnProperty(fieldName)) {
          this.validators[fieldName].forEach(fieldValidator => {
            const [valid, errorMessage] = this.getValidator(fieldValidator)
            if (!valid(currValue)) {
              errors.push(errorMessage)
            }
          })
        }
        return errors
      }

      validateAll = values => {
        let formErrors = {}
        let errorsExist = false

        Object.keys(this.validators).forEach(field => {
          formErrors[field] = []
          const value = values[field]
          const errors = this.validateController(field, value)

          if (errors.length > 0) {
            formErrors[field] = errors
            errorsExist = true
          }
        })
        return [errorsExist, formErrors]
      }

      render() {
        // Pass values and errors if form does not have it's own hasOwnState
        let rest = {}
        if (!options.hasOwnState) {
          rest = {
            values: this.state.values,
            formErrors: this.state.formErrors
          }
        }
        return (
          <WrappedComponent
            {...this.props}
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            handleFileChange={this.handleFileChange}
            {...rest}
          />
        )
      }
    }
  }
}
