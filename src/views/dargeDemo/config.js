export const shapeObj = {
  "dag-node": {
    id: "1",
    shape: "dag-node",
    x: 290,
    y: 110,
    data: {
      id: "1",
      label: "读数据",
      status: "success",
    },
  },
};

// 结构
export const dataJson = [
  {
    id: "1",
    children: [
      {
        id: "2",
        children: [
          {
            id: "2-1",
          },
        ],
      },
      {
        id: "3",
        leafId: "2-1",
      },
    ],
  },
];

export function generateUniqueId() {
  // 根据自己的需求生成唯一ID
  // 例如组合时间戳、随机数和计数器
  const timestamp = Date.now().toString(36);
  const randomNumber = Math.random().toString(36).substr(2, 5);
  const counter = generateUniqueId.counter
    ? ++generateUniqueId.counter
    : (generateUniqueId.counter = 1);
  return `${timestamp}-${randomNumber}-${counter}`;
}
