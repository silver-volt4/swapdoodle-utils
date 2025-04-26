import { SvelteMap } from "svelte/reactivity";

type Toast = {
    title: string,
    message: string
}

const toasts: Map<number, Toast> = new SvelteMap();

function pushToast(toast: Toast) {
    let key = +new Date();
    toasts.set(key, toast);
    setTimeout(() => {
        toasts.delete(key);
    }, 5000);
}

export default {
    get toasts() {
        return toasts;
    },
    pushToast
};