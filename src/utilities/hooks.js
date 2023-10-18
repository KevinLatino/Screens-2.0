import { useState } from 'react'

export const useForm = (initialValues, errorHandlers) => {
  const [fieldsState, setFieldsState] = useState(initialValues)
  const [errorsState, setErrorsState] = useState({})

  const getField = (name) => fieldsState[name]

  const getError = (name) => {
    return errorsState[name]
  }

  const setField = (name) => {
    const setter = (value) => {
      setFieldsState(f => ({
        ...f,
        [name]: value
      }))
    }

    return setter
  }

  const validate = () => {
    const names = Object.keys(fieldsState)

    let isValid = true

    for (const name of names) {
      const value = fieldsState[name]
      const error = errorHandlers[name](value)

      setErrorsState(e => ({
        ...e,
        [name]: error
      }))

      if (error !== null) {
        isValid = false
      }
    }

    return isValid
  }

  return {
    getField,
    setField,
    getError,
    fields: fieldsState,
    errors: errorsState,
    validate
  }
}
