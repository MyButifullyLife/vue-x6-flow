<template>
    <div class="Ec-x6-icon">
        <el-drawer
                title="我是标题"
                :visible.sync="visible"
                :direction="direction"
                size="300px"
                :modal="false"
                :modal-append-to-body="false"
                style="position: absolute; width: 300px;box-sizing: border-box;"
                show-close
        >
            <section class="listBar" @click.stop="">
                <p @click="showMore = !showMore">
                    <img :class="{'arrow':showMore}" src="../assets/svg/arrow.svg" alt="">
                    系统组件
                </p>
                <div v-if="showMore" class="listBar-cot">
                    <div
                            v-for="item in configList"
                            class="drag-cot"
                            draggable="true"
                            @drag="drag(item)"
                            @dragend="dragend(item)"
                    >
            <span>
              <img src="../assets/svg/defaultImg.svg" alt="">
            </span>
                        <p>
                            {{item.label}}
                        </p>
                    </div>
                </div>

            </section>
        </el-drawer>
    </div>

</template>

<script>
  const mouseXY = { 'x': null, 'y': null }
  import config from './nodeTheme/config'
  console.log(config)

  export default {
    name: 'Drawer',

    data() {
      return {
        visible: true,
        direction: 'ltr',
        showMore: false,
        configList: config
      }
    },
    mounted() {
      document.getElementById('container').addEventListener('dragover', function(e) {
        mouseXY.x = e.clientX
        mouseXY.y = e.clientY
      }, false)
    },
    methods: {
      drag: function(item) {
        const parentRect = document.getElementById('container').getBoundingClientRect()
        let mouseInGrid = false
        if (((mouseXY.x > parentRect.left) && (mouseXY.x < parentRect.right)) && ((mouseXY.y > parentRect.top) && (mouseXY.y < parentRect.bottom))) {
          mouseInGrid = true
        }
        if (mouseInGrid === true) {

        }
      },
      nodeConfig(item,x,y){
        let config = ''
        switch(item.type){
          case 'output':
            config =   {
              x: x,
              y: y,
              width: 180,
              height: 40,
              shape: 'dag-output',
              data:item,
              ports: {
                groups: {
                  bottom: {
                    position: 'bottom',
                    attrs: {
                      circle: {
                        r: 4,
                        magnet:
                        true,
                        stroke: '#C2C8D5',
                        strokeWidth: 1,
                        fill: '#fff'
                      }
                    }
                  }
                },
                items: [
                  {
                    id: 'port2',
                    group: 'bottom' // 指定分组名称
                  }
                ]
              }
            }
            break;
          case 'database' :
            config =   {
            x: x,
            y: y,
          width: 180,
          height: 40,
          shape: 'dag-node',
          data:item,
          ports: {
            groups: {
              top: {
                position: 'top',
                attrs:
                {
                  circle: {
                    r: 4,
                    magnet: true,
                    stroke:
                    '#C2C8D5',
                    strokeWidth: 1,
                    fill: '#fff'
                  }
                }
              },
              bottom: {
                position: 'bottom',
                attrs: {
                  circle: {
                    r: 4,
                    magnet:
                    true,
                    stroke: '#C2C8D5',
                    strokeWidth: 1,
                    fill: '#fff'
                  }
                }
              }
            },
            items: [
              {
                id: 'port1',
                group: 'top' // 指定分组名称
              },
              {
                id: 'port2',
                group: 'bottom' // 指定分组名称
              }
            ]
          }
          }
          break;
          case 'condition' :
            config =   {
              x: x,
              y: y,
              width: 180,
              height: 40,
              shape: 'dag-condition',
              data:item,
              ports: {
                groups: {
                  top: {
                    position: 'top',
                    attrs:
                    {
                      circle: {
                        r: 4,
                        magnet: true,
                        stroke:
                        '#C2C8D5',
                        strokeWidth: 1,
                        fill: '#fff'
                      }
                    }
                  },
                  bottom: {
                    position: 'bottom',
                    attrs: {
                      circle: {
                        r: 4,
                        magnet:
                        true,
                        stroke: '#C2C8D5',
                        strokeWidth: 1,
                        fill: '#fff'
                      }
                    }
                  }
                },
                items: [
                  {
                    id: 'port1',
                    group: 'top' // 指定分组名称
                  },
                  {
                    id: 'port2',
                    group: 'bottom' // 指定分组名称
                  }
                ]
              }
            }
            break;
        }
        return config
      },
      dragend: function(item) {
        const parentRect = document.getElementById('container').getBoundingClientRect()
        let mouseInGrid = false
        if (((mouseXY.x > parentRect.left) && (mouseXY.x < parentRect.right)) && ((mouseXY.y > parentRect.top) && (mouseXY.y < parentRect.bottom))) {
          mouseInGrid = true
        }
        if (mouseInGrid === true) {
          this.$emit('addNode',
           this.nodeConfig(item, mouseXY.x, mouseXY.y)
          )
        }
      }
    }
  }
</script>
<style   scoped>
    .Ec-x6-icon ::v-deep .el-drawer__body{
        overflow-y: scroll;
    }
    .Ec-x6-icon ::v-deep .el-drawer__header{
        padding: 0 12px;
        margin-bottom: 0;
        width: 300px;
    }
    .listBar{
        font-size: 14px;
    }

    .listBar img {
        width: 12px;
    }
    .arrow{
        transform: rotate(90deg);
        transition-duration:.3s;
    }
    .listBar-cot{
        display: inline-block;
        padding-left: 12px;
        box-sizing: border-box;
        width: 100%;
        text-align: left;
    }
    .listBar-cot .drag-cot{
        display: inline-flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        width: 62px;
        height: 62px;
    }
    .listBar-cot .drag-cot span{
        display: inline-block;
        width: 50px;
        height: 50px;
    }
    .listBar-cot .drag-cot span img{
        width: 100%;
        height: 100%;
    }
    .listBar-cot .drag-cot p{
        margin: -2px 0 0;
        text-align: center;
        font-size: 12px;
        color: #939393;
    }
</style>
