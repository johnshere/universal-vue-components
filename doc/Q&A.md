### pnpm install 时出现依赖警告？

```
packages/vr-components/playground
└─┬ @vitejs/plugin-vue2 2.3.1
  └── ✕ unmet peer vue@^2.7.0-0: found 3.4.29
```

这由于 playground 需要支持切换 vue2 和 vue3 两种编译模式，所以是通过别名来安装的 vue2 和 vue3，所以会导致无法正确自动索引到 vue 的相关依赖。已对过 vite 配置对编译器进行了手动指定 vue 版本来使其正常工作，因此无需关注。

### 编译组件时类型声明检查报错 TS2742

具体报错信息为类似：

```
 ERROR  ../src/components/uni-comp/src/uni-comp.vue.ts:7:1 - error TS2742: The inferred type of 'default' cannot be named without a reference to '.pnpm/vue@2.7.16/node_modules/vue/types/common'. This is likely not portable. A type annotation is necessary.
```

这类问题的缘由都一样，以上面的报错信息为例，出现报错的原因是因为组件内使用了 `defineProps({...})` 来声明组件 Props 引发的。经由编译后的 TS 类型声明文件中会使用到 `LooseRequired` 接口，然而该接口并未在 `vue` 中作为默认使用导出，所以编译器需要按照相对路径对其进行引用，由于我们使用了 pnpm，所以该接口在当前设备下引用的地址为 `.pnpm/vue@2.7.16/node_modules/vue/types/common`。但是我们编译出的类型声明文件是需要给别人用的，在他人的设备下引用路径不一定是这个，所以 ts 编译器会检测到该路径在其他设备上不适用，对其进行报错。

解决方案：在入口文件中声明一下导出位置，这样 ts 就能知道如何去引用类型了：

```ts
// packages/vr-components/src/index.ts
import type {} from 'vue2/types/common';
import type {} from '@vue/shared';
```

参考：https://github.com/microsoft/TypeScript/pull/58176#issuecomment-2052698294

> 目前发现只有编译 Vue2 组件的时候会出现这类问题

### 为啥不使用 `defineProps<{...}>()` 来声明组件 props

在 setup 组件中声明带类型提示的 Props 有两种方式：

```ts
withDefault(
    defineProps<{
        buttonType?: "a" | "b"
    }>(),
    {
        buttonType: "a"
    }
)
```

或者：

```ts
defineProps({
    buttonType: {
        type: String as PropType<"a" | "b">,
        default: "a",
        required: false
    }
})
```

实际上第一种写法是第二种的语法糖，使用了语法糖方式编写后的组件在经过编译后，组件的类型声明文件中会丢失 Props 的类型，导致使用方在使用组件时无法获取到精确的类型提示，如上面的例子只能获取到 `String` 类型，而不能获取到精确的枚举类型 `"a" | "b"`。因此不建议使用第一种写法来声明组件 Props。
