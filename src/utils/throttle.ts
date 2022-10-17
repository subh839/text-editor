
export default function throttle<T extends any[]>(
  fn: (...args: T) => unknown,
  timeout: number
) {
  let isAvailable = true;

  return function(...args: T) {
    if (!isAvailable) return;
    isAvailable = false;
    setTimeout(() => {
      fn(...args);
      isAvailable = true;
    }, timeout);
  };
}
