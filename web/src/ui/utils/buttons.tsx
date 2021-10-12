import clsx from 'clsx'
import { ReactNode } from 'react'

export function Button({
  classes = 'btn-secondary',
  ariaLabel,
  onClick,
  children
}: {
  ariaLabel?: string
  classes?: string
  onClick?: () => void
  children: ReactNode
}): React.ReactElement {
  return (
    <button
      aria-label={ariaLabel}
      className={clsx('btn btn-sm font-weight-bold', classes)}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export function btnProps(
  classes: string,
  onClick: () => void
): {
  'aria-label'?: string | undefined
  title?: string | undefined
  className: string
  onClick: () => void
} {
  return {
    className: clsx('btn btn-sm font-weight-bold', classes),
    onClick
  }
}

type Props = Record<string, unknown>

export function props<T extends Props>(
  className: string,
  extra: T
): T & { className: string } {
  return { ...extra, className }
}

type JSXProps = {
  className?: string
  'aria-label'?: string
  title?: string
}

type ButtonProps = JSXProps & {
  onClick?: () => void
}

function toProps<T extends string | Props>(
  data: T
): Props | { className: string } {
  return typeof data === 'string' ? { className: data } : (data as Props)
}

/* IconButton that allows to fully customize both icon and button.
 */
export function IconButton({
  button,
  icon,
  onClick
}: {
  button: ButtonProps
  icon: string | JSXProps
  onClick?: () => void
}): React.ReactElement {
  return (
    <button {...toProps(button)} onClick={onClick}>
      <i {...toProps(icon)} />
    </button>
  )
}

export function makeIconButton(
  button: ButtonProps,
  icon: JSXProps
): React.ReactElement {
  return (
    <button {...button}>
      <i {...icon} />
    </button>
  )
}
