import { Graph } from "@antv/x6";
import common from "@/views/dargeDemo/components/node/common";
import exnode from "@/views/dargeDemo/components/node/exnode";
// import { DagreLayout } from "@antv/layout";
export default {
  watch: {},
  beforeMount() {},
  beforeDestroy() {},
  mounted() {
    this.initGraph();
    this.keyBindFn();

    // 禁止拖动
    this.graph.enableKeyboard();
  },
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
      // 注册节点
      Graph.registerNode(
        "dag-common",
        {
          inherit: "vue-shape",
          component: {
            template: `<common />`,
            components: {
              common,
            },
          },
          ports: {
            groups: {
              left: {
                position: "left",
              },
              right: {
                position: "right",
              },
            },
          },
        },
        true
      );
      Graph.registerNode(
        "dag-exnode",
        {
          inherit: "vue-shape",
          component: {
            template: `<exnode />`,
            components: {
              exnode,
            },
          },
          ports: {
            groups: {
              left: {
                position: "left",
              },
              right: {
                position: "right",
              },
            },
          },
        },
        true
      );
    },
    initGraph() {
      this.registerNode();
      // 注册节点
      const graph = new Graph({
        grid: {
          size: 10,
          visible: true,
          type: "dot", // 'dot' | 'fixedDot' | 'mesh'
          args: {
            color: "#0a2327", // 网格线/点颜色
            thickness: 1, // 网格线宽度/网格点大小
          },
        },
        background: {
          color: "#eef3fb", // 设置画布背景颜色
        },
        interacting: {
          nodeMovable: false, // 禁止节点和边移动
          edgeMovable: false,
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

          connectionPoint: "anchor",
          anchor: "center",
          validateMagnet() {
            // return magnet.getAttribute('port-group') !== 'top'

            // 限制连线配置
            return true;
          },
          createEdge() {
            return graph.createEdge({
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
      this.graph = graph;

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

      graph.on("node:contextmenu", ({ e, x, y, node, view }) => {
        console.log(e, x, y, view);
        this.showContextMenu = true;

        this.$nextTick(() => {
          // this.$refs.menuBar.setItem({ type: 'node', item: node })
          const p = graph.localToPage(x, y);
          this.$refs.menuBar.initFn(p.x, p.y, { type: "node", item: node });
        });
      });

      graph.on("edge:connected", ({ edge }) => {
        edge.attr({
          line: {
            strokeDasharray: "",
          },
        });
      });
    },
  },
};
