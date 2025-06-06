import { SvelteMap } from "svelte/reactivity";

type Dialog = {
    title: string,
    message: string,
    buttons: Button[]
}

type AwaitDialog = Dialog & {
    resolver: (value: string) => void
};

type Button = {
    id: string,
    label: string,
}

const dialogs: AwaitDialog[] = $state([]);
const _currentDialog = $derived(dialogs[dialogs.length - 1]);

export default function current(): AwaitDialog | undefined {
    return _currentDialog;
}

export async function pushDialog(dialog: Dialog): Promise<string> {
    let clickedId = await new Promise<string>((resolve) => {
        let ad: AwaitDialog = dialog as AwaitDialog;
        ad.resolver = resolve;
        dialogs.push(ad);
    });
    dialogs.splice(0, 1);
    return clickedId;
}