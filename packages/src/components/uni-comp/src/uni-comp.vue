<template>
    <div
        :class="classNs('uni-comp', `uni-comp--${type}`)"
        :title="`vue version: ${vueVersion}`"
    >
        <span class="count">{{ count }}</span>
        <button class="add-button" @click="addCount">Add</button>
    </div>
</template>

<script lang="ts" setup>
import {classNs, IS_VUE2} from '../../../utils';
import {ref, toRefs, type PropType} from 'vue';

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

const vueVersion = IS_VUE2 ? '2' : '3';

const {defaultValue} = toRefs(props);

const count = ref(defaultValue.value);

function addCount() {
    count.value += 1;
}
</script>
