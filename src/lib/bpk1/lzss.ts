import lzss from "./lzss.wasm?init";

lzss().then((instance) => {
    console.log(instance.exports)
})