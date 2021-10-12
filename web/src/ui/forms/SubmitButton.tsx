import React, { ReactElement } from 'react'

export function SubmitButton({
  title = 'Submit',
  disabled
}: {
  title?: string
  disabled?: boolean
}): ReactElement {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="btn btn-sm btn-primary"
    >
      {title}
    </button>
  )
}
