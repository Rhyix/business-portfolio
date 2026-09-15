/**
 * Joins conditional class names into a single string.
 * Deliberately dependency-free: the project does not need clsx or tailwind-merge.
 */
export function cn(...classNames: Array<string | false | null | undefined>): string {
  return classNames.filter(Boolean).join(' ')
}
