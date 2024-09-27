<template>
    <div class="home-page">
        <h1>Vue Version: {{ IS_VUE2 ? '2' : '3' }}</h1>
        <ul>
            <li v-for="item in computedRoutes" :key="item.name">
                <router-link :to="{name: item.name}">
                    {{ item.name }}
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import {IS_VUE2} from '@src/utils';
import {routes} from '@/router/routes';
import {RouterLink} from 'vue-router';

const computedRoutes = routes.filter(
    item => !!(item as any).component && item.name !== 'home',
);
</script>
