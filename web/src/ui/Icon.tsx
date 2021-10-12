import React from 'react'

export type IconId =
  | 'lock-rounded'
  | 'locked'
  | 'calendar1'
  | 'sphere'
  | 'earth'
  | 'bell'
  | 'search'
  | 'menu'
  | 'flag'
  | 'bookmark'
  | 'google3'
  | 'github'
  | 'share2'

type Props = {
  id: IconId
  color?: string
  size?: string | number
}

const Icon: React.FC<Props> = (props) => {
  const { id, color, size } = props
  const iconId = `icon-${id}`
  const style: Record<string, any> = {}
  if (color) style.color = color
  if (size) {
    style.width = style.height = size
  }
  return (
    <svg className={`icon ${iconId}`} style={style}>
      <use xlinkHref={`/static/symbol-defs.svg#${iconId}`}></use>
    </svg>
  )
}

export default Icon
