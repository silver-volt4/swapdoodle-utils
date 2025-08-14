import { BPK1File } from "./libdoodle/libdoodle.svelte";
import { warn } from "./toast.svelte";

const fileInput: HTMLInputElement = document.createElement("input")
fileInput.type = "file"

export class OpenFile {
    file: BPK1File;
    name: string;

    constructor(file: BPK1File, name: string) {
        this.file = file;
        this.name = name;
    }
}

export let files: OpenFile[] = $state([]);
let _currentFile: OpenFile | null = $state(null);

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
        let letter;
        if (file instanceof File) {
            letter = await BPK1File.readFile(file);
            name ??= file.name
        }
        else {
            letter = await BPK1File.readUint8Array(file);
            name ??= "(unnamed)"
        }

        let newFile = new OpenFile(letter, name)
        files.push(newFile);
        setCurrentFile(newFile);
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

export function setCurrentFile(newFile: OpenFile) {
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