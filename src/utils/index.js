// 根据自己的需求生成唯一ID
export function generateUniqueId() {
  // 例如组合时间戳、随机数和计数器
  const timestamp = Date.now().toString(36);
  const randomNumber = Math.random().toString(36).substr(2, 5);
  const counter = generateUniqueId.counter
    ? ++generateUniqueId.counter
    : (generateUniqueId.counter = 1);
  return `${timestamp}-${randomNumber}-${counter}`;
}
