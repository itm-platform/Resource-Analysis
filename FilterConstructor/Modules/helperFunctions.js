/** 
 * The "noop css tag function" is a no-operation (noop) function 
 * that takes a tagged template literal and returns the raw string without modification. 
 * This allows you to use VSCode's CSS formatting features  */
export const css = (strings) => strings.raw[0];