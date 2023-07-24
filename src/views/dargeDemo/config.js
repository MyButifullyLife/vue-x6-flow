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

export const statusColor = {
  success: "#52c41a",
  error: "#c42027",
  normal: "#b1b4b1",
};

// 结构
export const dataJson = [
  {
    type: "common",
    data: {
      status: "success",
      label: "流程开始1",
    },
    children: [
      {
        type: "common",
        data: {
          status: "normal",
          label: "流程开始2",
          form: {
            text1: "",
            text2: "",
            text3: "",
            text4: "",
          },
        },
        children: [
          {
            type: "exnode",
            data: {
              status: "error",
              label: "流程开始3",
            },
          },
        ],
      },
      {
        type: "common",
        data: {
          status: "normal",
          label: "流程开始4",
        },
      },
    ],
  },
];

// 自定义json
export const customJson = [
  // 自定义1
  {
    type: "common",
    data: {
      status: "success",
      label: "自定义1",
    },
    children: [
      {
        type: "exnode",
        data: {
          status: "normal",
          label: "1-1",
        },
      },
      {
        type: "exnode",
        data: {
          status: "normal",
          label: "1-2",
        },
      },
    ],
  },
  // 自定义2
  {
    type: "common",
    data: {
      status: "success",
      label: "自定义2",
    },
    children: [
      {
        type: "common",
        data: {
          status: "normal",
          label: "2-1",
          form: {
            text1: "",
            text2: "",
            text3: "",
            text4: "",
          },
        },
      },
      {
        type: "common",
        data: {
          status: "normal",
          label: "2-2",
          form: {
            text1: "",
            text2: "",
            text3: "",
            text4: "",
          },
        },
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
