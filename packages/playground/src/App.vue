<template>
    <div id="app-container">
        <UniComp :default-value="10" />
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
defineComponent({
    name: 'UniApp',
});
</script>

<script setup lang="ts">
import {UniComp} from '@src/components';
</script>
