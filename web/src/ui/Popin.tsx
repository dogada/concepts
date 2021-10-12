import React, { ReactElement, ReactPortal } from 'react'
import ReactDOM from 'react-dom'

export function Popin({
  target,
  el = 'div',
  children
}: {
  target: HTMLElement
  el?: string
  children: ReactElement
}): ReactPortal | null {
  const [container] = React.useState(document.createElement(el))

  React.useEffect(() => {
    target.appendChild(container)
    return () => {
      target.removeChild(container)
    }
  }, [])

  return ReactDOM.createPortal(children, container)
}
