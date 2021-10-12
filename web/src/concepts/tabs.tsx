import clsx from 'clsx'
import * as React from 'react'

export type Tab<T extends string> = {
  id: T
  name: string
}
export function VerticalTabs<T extends string>({
  tabs,
  activeId,
  onChange
}: {
  tabs: Tab<T>[]
  activeId: T
  onChange: (tab: Tab<T>) => void
}): React.ReactElement {
  return (
    <div
      role="tablist"
      className="nav flex-column nav-pills"
      aria-orientation="vertical"
    >
      {tabs.map(({ id, name }) => (
        <a
          key={id}
          className={clsx(id === activeId && 'active', 'nav-link')}
          role="tab"
          aria-controls={id}
          aria-selected={id === activeId}
          onClick={() => onChange({ id, name })}
        >
          {name}
        </a>
      ))}
    </div>
  )
}
export function TabPanel<T extends string>({
  tabId,
  active,
  preload,
  children
}: {
  tabId: T
  active?: boolean
  preload?: boolean
  children?: React.ReactNode
}): React.ReactElement {
  return (
    <div
      className={clsx(active && 'show active', 'tab-pane fade')}
      id={tabId}
      role="tabpanel"
    >
      {(active || preload) && children}
    </div>
  )
}
