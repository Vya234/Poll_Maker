/** Join class names, skipping falsy parts. */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
