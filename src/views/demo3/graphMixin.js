import { Graph, Path } from "@antv/x6";
import "@antv/x6-vue-shape";
import common from "./components/nodeTheme/common.vue";
export default {
  watch: {},
  beforeMount() {},
  beforeDestroy() {},
  methods: {
    layoutFn() {},
    keyBindFn() {
      // copy cut paste
      // this.graph.bindKey(["meta+c", "ctrl+c"], () => {
      //   const cells = this.graph.getSelectedCells();
      //   if (cells.length) {
      //     this.graph.copy(cells);
      //   }
      //   return false;
      // });
      // this.graph.bindKey(["meta+x", "ctrl+x"], () => {
      //   const cells = this.graph.getSelectedCells();
      //   if (cells.length) {
      //     this.graph.cut(cells);
      //   }
      //   return false;
      // });
      // this.graph.bindKey(["meta+v", "ctrl+v"], () => {
      //   if (!this.graph.isClipboardEmpty()) {
      //     const cells = this.graph.paste({ offset: 32 });
      //     this.graph.cleanSelection();
      //     this.graph.select(cells);
      //   }
      //   return false;
      // });
      //
      // // undo redo
      // this.graph.bindKey(["meta+z", "ctrl+z"], () => {
      //   if (this.graph.history.canUndo()) {
      //     this.graph.history.undo();
      //   }
      //   return false;
      // });
    },
    registerNode() {
      Graph.registerNode(
        `node-common`,
        {
          inherit: "vue-shape",
          width: 180,
          height: 36,
          component: {
            template: `<common />`,
            components: {
              common,
            },
          },
          ports: {
            groups: {
              top: {
                position: "top",
                attrs: {
                  circle: {
                    r: 4,
                    magnet: true,
                    stroke: "#C2C8D5",
                    strokeWidth: 1,
                    fill: "#fff",
                  },
                },
              },
              bottom: {
                position: "bottom",
                attrs: {
                  circle: {
                    r: 4,
                    magnet: true,
                    stroke: "#C2C8D5",
                    strokeWidth: 1,
                    fill: "#fff",
                  },
                },
              },
            },
          },
        },
        true
      );

      Graph.registerEdge(
        "dag-edge",
        {
          inherit: "edge",
          attrs: {
            line: {
              stroke: "#C2C8D5",
              strokeWidth: 2,
              targetMarker: {
                name: "block",
                width: 12,
                height: 8,
              },
            },
          },
        },
        true
      );
      Graph.registerConnector(
        "algo-connector",
        (s, e) => {
          const offset = 4;
          const deltaY = Math.abs(e.y - s.y);
          const control = Math.floor((deltaY / 3) * 2);

          const v1 = { x: s.x, y: s.y + offset + control };
          const v2 = { x: e.x, y: e.y - offset - control };

          return Path.normalize(
            `M ${s.x} ${s.y}
           L ${s.x} ${s.y + offset}
           C ${v1.x} ${v1.y} ${v2.x} ${v2.y} ${e.x} ${e.y - offset}
           L ${e.x} ${e.y}
          `
          );
        },
        true
      );
    },
    initGraph() {
      this.registerNode();

      const graph = new Graph({
        grid: {
          size: 10,
          visible: true,
          type: "dot", // 'dot' | 'fixedDot' | 'mesh'
          args: {
            color: "#a05410", // 网格线/点颜色
            thickness: 1, // 网格线宽度/网格点大小
          },
        },
        background: {
          color: "#fffbe6", // 设置画布背景颜色
        },
        container: document.getElementById("draw-cot"),
        panning: {
          enabled: true,
          eventTypes: ["leftMouseDown", "mouseWheel"],
        },
        mousewheel: {
          enabled: true,
          modifiers: "ctrl",
          factor: 1.1,
          maxScale: 1.5,
          minScale: 0.5,
        },
        highlighting: {
          magnetAdsorbed: {
            name: "stroke",
            args: {
              attrs: {
                fill: "#fff",
                stroke: "#31d0c6",
                strokeWidth: 4,
              },
            },
          },
        },
        connecting: {
          snap: true,
          allowBlank: false,
          allowLoop: false,
          highlight: true,
          connector: "algo-connector",
          connectionPoint: "anchor",
          anchor: "center",
          validateMagnet() {
            // return magnet.getAttribute('port-group') !== 'top'

            // 限制连线配置
            return true;
          },
          createEdge() {
            return graph.createEdge({
              shape: "dag-edge",
              attrs: {
                line: {
                  strokeDasharray: "5 5",
                  targetMarker: {
                    name: "block",
                    width: 12,
                    height: 8,
                  },
                },
              },
              zIndex: -1,
            });
          },
        },
        selecting: {
          enabled: true,
          multiple: true,
          rubberEdge: true,
          rubberNode: true,
          modifiers: "shift",
          rubberband: true,
        },
        keyboard: true,
        clipboard: true,
        history: true,
      });

      graph.on("edge:contextmenu", ({ e, x, y, edge, view }) => {
        console.log(x, y, view);
        this.showContextMenu = true;
        this.$nextTick(() => {
          this.$refs.menuBar.initFn(e.offsetX, e.offsetY, {
            type: "edge",
            item: edge,
          });
        });
      });

      return graph;
    },
  },
};
