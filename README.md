# vue-x6-flow

找了一圈流程图和dag图插件，发现每一个的功能都太弱了没办法实现 运维可视化需求，所以自己花心思撸了一个出来。 
**基于antv-x6 vue版本**
vue2.x+ element +antv-x6 
适用于流程图-dag图

有以下功能内容：
1、拖拽布局
2、右键菜单
3、保存
4、缩放
5、多选
6、快捷键 cv  cx  cz（重做）
7、连线判断
8、配置属性
9、动态节点流向动画
其余功能可在antv-x6文档自行添加

## 文档地址
https://x6.antv.vision/zh/docs/api/graph/graph

##效果图
![image](https://user-images.githubusercontent.com/16436933/149902393-4a9fd58f-eadd-4a5f-af71-81076d0364d0.png)

##流向动画
![GIF 2022-1-18 16-51-01](https://user-images.githubusercontent.com/16436933/149902899-b630b119-c39f-45e9-b576-da8d571386be.gif)


## 流程图 dag图 思维导图均可实现
![image](https://user-images.githubusercontent.com/16436933/153532050-5bd5372b-e3a0-43dd-8407-9f0a05b7f59a.png)




## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
