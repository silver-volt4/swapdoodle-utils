import { BPK1File } from "./libdoodle/libdoodle.svelte";
import { warn } from "./toast.svelte";

const fileInput: HTMLInputElement = document.createElement("input")
fileInput.type = "file"

export let files: BPK1File[] = $state([]);
let _currentFile: BPK1File | null = $state(null);

export function askForFile(): Promise<FileList | null> {
    return new Promise((resolve) => {
        fileInput.addEventListener("change", (e: Event) => {
            resolve((e.target as HTMLInputElement | null)?.files ?? null);
        }, { once: true })
        fileInput.click();
    })
}

export async function openNewFile(file: File | Uint8Array<ArrayBufferLike>, name?: string) {
    try {
        let bpk1File;
        if (file instanceof File) {
            name ??= file.name;
            bpk1File = await BPK1File.readFile(file);
        }
        else {
            bpk1File = await BPK1File.readUint8Array(file);
        }

        if(name) {
            bpk1File.fileName = name;
        }

        files.push(bpk1File);
        setCurrentFile(bpk1File);
    } catch (e) {
        let message = (e as Partial<Error>)?.message;
        warn({
            title: "Error reading file",
            message: message ?? "Unknown error",
        });
    }
}

export function getCurrentFile() {
    return _currentFile
}

export function setCurrentFile(newFile: BPK1File) {
    _currentFile = newFile
}

export function closeCurrentFile() {
    let index = files.indexOf(_currentFile!);
    if (index === -1) {
        return;
    }

    files.splice(index, 1);
    if (files.length === 0) {
        _currentFile = null;
        return;
    }
    if (files.length <= index) {
        index -= 1;
    }

    _currentFile = files[index];
}