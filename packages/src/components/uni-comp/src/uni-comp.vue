<template>
    <div :class="classNs('uni-comp')">
        <span>{{ count }}</span>
        <button type="button" @click="addCount">Add</button>
    </div>
</template>

<script lang="ts" setup>
import {defineComponent, ref, toRefs} from 'vue';
import {classNs} from '@src/utils';
import '../style';

const props = withDefaults(defineProps<{defaultValue?: number}>(), {
    /** 默认值 */
    defaultValue: 10,
});

const {defaultValue} = toRefs(props);

const count = ref(defaultValue.value);

function addCount() {
    count.value += 1;
}
</script>

<script lang="ts">
defineComponent({
    name: 'UniComp',
});
</script>
