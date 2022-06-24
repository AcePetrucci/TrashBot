export const isLetter = (content: string) => {
  return typeof content !== 'string'
    ? false
    : /^[a-zA-Z]+$/.test(content);
}