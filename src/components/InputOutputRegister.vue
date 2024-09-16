<template>
        <v-autocomplete
            label="Produtos"            
            class="search-itens"
            bg-color="#FFF"
            :items="itemsList"
            v-model="selectedItem"
            @update:modelValue="getPriceAndImage">
        </v-autocomplete>
</template>

<script>
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: "InOutRegister",
        data() {
            return {
                itemsList: []
            }
        },
        methods: {
            async getItens() {
                const itensJson = await(await fetch('../src/db/itensList.json')).json();
                for(let i=0; i<itensJson.data.products.length; i++) {
                    this.itemsList.push(itensJson.data.products[i]);
                };
                    return this.itemsList
            },
            async getPriceAndImage(selectedItem) {
                const itensJson = await(await fetch('../src/db/itensList.json')).json();
                for(let i=0; i<itensJson.data.products.length; i++) {
                    if(selectedItem === itensJson.data.products[i]) {
                        this.$emit('updateValue', itensJson.data.prices[i]);
                        this.$emit('updateImage', itensJson.data.images[i]);
                        this.$emit('selectedItem', selectedItem);
                    };
                };
                this.$emit('resetAmount');
            }
        },
        mounted() {
            this.getItens();
        },
    })
</script>
