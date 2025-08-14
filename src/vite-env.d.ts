/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference lib="webworker" />
/// <reference types="vite-plugin-svgr/client" />
import { ClassNameMap } from '@mui/styles';

declare global {
    export type List<T> = {
        items: T[];
    };
    type Classes<T> = Partial<ClassNameMap<T>>;
    export type ClassesProp<T> = { classes?: Classes<T> };
}

declare module '*.svg' {
    const src: string;
    export default src;
}
