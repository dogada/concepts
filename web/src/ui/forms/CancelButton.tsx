import React, { ReactElement } from 'react'

export function CancelButton({
  onCancel
}: {
  onCancel?: () => void
}): ReactElement {
  return (
    <button
      type="button"
      className="btn btn-sm btn-danger mx-2"
      onClick={onCancel}
    >
      Cancel
    </button>
  )
}
