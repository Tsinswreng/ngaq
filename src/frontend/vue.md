<!-- [23.08.23-1223,] -->
#

``` ts
interface VueComponentOptions {
  name?: string;
  props?: Record<string, any>; //組件 父予子 傳訊
  setup?: (props: any) => any;
  data?: () => Record<string, any>;
  methods?: Record<string, Function>;
  computed?: Record<string, Function>;
  watch?: Record<string, Function | string>;
  components?: Record<string, any>;
  template?: string;
  render?: (this: any, createElement: any) => any;
  // 其他可能的属性...
}
```
