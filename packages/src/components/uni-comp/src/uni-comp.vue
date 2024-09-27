<template>
    <div :class="classNs('uni-comp', `uni-comp--${type}`)">
        <span>{{ count }}</span>
        <button type="button" @click="addCount">Add</button>
    </div>
</template>

<script lang="ts" setup>
import {ref, toRefs, type PropType} from 'vue';
import {classNs} from '@src/utils';
import '@src/styles/src/uni-comp.styl';

// 推荐使用该方式定义 props，使用 defineProps<{/** ... */}>() 泛型方式编写会导致 vue2.7 项目无法识别 Props 提示
const props = defineProps({
    /** 默认值 */
    defaultValue: {
        type: Number as PropType<number>,
        default: 10,
        required: false,
    },
    /** 类型 */
    type: {
        type: String as PropType<'default' | 'large'>,
        default: 'default',
        required: false,
    },
});

const {defaultValue} = toRefs(props);

const count = ref(defaultValue.value);

function addCount() {
    count.value += 1;
}
</script>
