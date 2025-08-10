<script lang="ts">
    let {
        data,
    }: {
        data: Uint8Array;
    } = $props();

    function hexdigit(i: number) {
        let s = i.toString(16).substring(0, 2);
        if (s.length === 1) {
            s = "0" + s;
        }
        return s;
    }
</script>

<div>
    <code>
        {#each data as i, index}
        {#if index % 0x0F === 0} 
        <br>
        {/if}
            {hexdigit(i)}
        {/each}
    </code>
</div>
