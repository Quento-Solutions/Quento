export {}

declare global {
    interface Window {
        onNuxtReady : (obj : Object) => void;
    }
}

