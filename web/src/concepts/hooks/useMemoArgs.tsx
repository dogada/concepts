import * as React from 'react'

export type Fn = (...args: any[]) => any

/**
 *
 * @param fn a function to memoize with React.useMemo
 * @returns fully typed memoized function that use original function params as dependency list for React.memo
 * @example
```  
const renderAside = useMemoArgs(
  (category: Thing, categories?: Thing[]) =>
    categories && <Aside category={category} categories={categories} />
)

return <div>{renderAside(category, categories)}</div>
```
 */
export function useMemoArgs<T extends Fn>(
  fn: T
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args) => React.useMemo(() => fn(...args), [args])
}
