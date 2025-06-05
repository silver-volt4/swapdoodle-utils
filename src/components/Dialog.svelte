<script lang="ts">
    import { fade, scale } from "svelte/transition";
    import current from "../lib/dialog.svelte";
</script>

{#if current()}
    <div class="overlay" transition:fade>
        <div class="dialog" in:scale out:fade>
            <div class="title">
                {current()?.title}
            </div>
            <div class="message">
                {current()?.message}
            </div>
            <div class="buttons">
                {#each current()?.buttons ?? [] as button}
                    <button onclick={() => current()?.resolver(button.id)}>
                        {button.label}
                    </button>
                {/each}
            </div>
        </div>
    </div>
{/if}

<style>
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background-color: rgba(0, 0, 0, 0.5);
    }

    .dialog {
        border-radius: 1em;
        overflow: hidden;
        background-color: white;
        display: flex;
        flex-direction: column;
        box-shadow:
            0 3px 6px rgba(0, 0, 0, 0.16),
            0 3px 6px rgba(0, 0, 0, 0.23);
        margin-bottom: 1em;
    }

    .dialog .title {
        padding: 0.5em 1em;
        font-weight: bold;
        background-color: lightskyblue;
    }

    .dialog .buttons {
        padding: 0.5em 0.5em;
        font-weight: bold;
        background-color: rgb(230, 230, 230);
        display: flex;
        gap: 0.5em;
    }

    .dialog .buttons button {
        padding: 0.5em 1em;
        font-weight: bold;
    }

    .dialog .message {
        padding: 1em;
        white-space: pre-line;
    }
</style>
