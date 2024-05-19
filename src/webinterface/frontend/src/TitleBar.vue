<template>
    <div class="title-bar">
        <div class="title" id="title">PixelBridge Configurator</div>
        <div class="buttons">
            <button @click="onReset" title="[r]">Reset View</button>
            <button @click="onArrange" title="[a]">Auto-Arrange Nodes</button>
            <button @click="onUndo">Undo</button>
            <button @click="onRedo">Redo</button>
            <button @click="onSave" title="Saves the node graph as displayed in the browser">Save</button>
            <button @click="onLoad">Load</button>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Rete from "rete";

declare global {
    interface Window { editor: typeof Rete.NodeEditor | any; }
}

@Component
export default class TitleBar extends Vue {
    mounted() {
        window.addEventListener('keydown', this.onKeyDown);
    }

    beforeDestroy() {
        window.removeEventListener('keydown', this.onKeyDown);
    }
    onKeyDown(event: KeyboardEvent) {
        const target = event.target as HTMLElement;
        if (target.tagName.toLowerCase() !== 'input' && target.tagName.toLowerCase() !== 'textarea' && target.getAttribute('contenteditable') !== 'true') {
            if (event.key === 'r') {
                this.onReset();
            }
            if (event.key === 'a') {
                this.onArrange();
            }
        }
    }

    onSave() {
        // Function to download the JSON string as a file
        const jsonString = JSON.stringify(window.editor.toJSON());
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "pixelbridge_config.json";
        document.body.appendChild(a); // Required for Firefox
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Clean up
    }

    async onLoad() {
        // Create an input element for file selection
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (event) => {
            const files = (event.target as HTMLInputElement).files;
            if (files && files.length > 0) {
                const file = files[0];
                const reader = new FileReader();

                reader.onload = async () => {
                    const result = reader.result as string; // Assuming the file content is text
                    try {
                        const parsedJson = JSON.parse(result);
                        // Use the parsed JSON object here
                        // console.log(parsedJson);
                        if (Object.keys(parsedJson).length) {
                            window.editor.fromJSON(parsedJson);
                        }
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                    }
                };

                reader.readAsText(file);
            }
        };

        input.click(); // Open file picker dialog
    }

    onReset() {
        window.editor.areaPlugin.zoomAt(window.editor, window.editor.nodes);
    }

    onArrange() {
        window.editor.trigger('arrange', { node: window.editor.nodes[0] });
    }

    onUndo() {
        window.editor.trigger('undo');
    }

    onRedo() {
        window.editor.trigger('redo');
    }
}
</script>

<style scoped>
.title-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #333;
    color: white;
}

.title {
    font-size: 18px;
    font-weight: bold;
}

.buttons button {
    margin-left: 10px;
    padding: 5px 10px;
    background-color: #555;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.buttons button:hover {
    background-color: #777;
}

.buttons button:active {
    background-color: #999;
}
</style>