const defaultInitializer = (index: number) => index;

export function createRange(length, initializer = defaultInitializer) {
  return [...new Array(length)].map((_, index) => initializer(index));
}
