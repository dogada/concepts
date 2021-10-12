import { ReactElement, RefObject, useState } from 'react'
import { Popin } from '~/ui/Popin'

export function ExpandableWidget({
  Trigger,
  target,
  children
}: {
  Trigger: React.FC<{ onClick: () => void }>
  target: RefObject<HTMLElement>
  children: ReactElement
}): ReactElement {
  const [expanded, setExpanded] = useState(false)
  return (
    <>
      <Trigger onClick={() => setExpanded((v) => !v)} />
      {expanded && target.current ? (
        <Popin target={target.current}>{children}</Popin>
      ) : null}
    </>
  )
}
