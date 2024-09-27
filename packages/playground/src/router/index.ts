import {IS_VUE2} from '@src/utils';
import {router as routerV3} from './v3';
import {router as routerV4} from './v4';
import {useRoute as useRoute3, useRouter as useRouter3} from 'vue-router3/composables';
import {useRoute as useRoute4, useRouter as useRouter4} from 'vue-router4';

export const router = IS_VUE2 ? routerV3 : routerV4;
export const useRouter = IS_VUE2 ? useRouter3 : useRouter4;
export const useRoute = IS_VUE2 ? useRoute3 : useRoute4;
