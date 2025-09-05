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
    import { getInventario } from '@/services/CrudInventario';

    export default defineComponent({
        name: "InOutRegister",
        data() {
            return {
                itemsList: []
            }
        },
        methods: {
            async getItens() {
                const list = await (await getInventario()).json();
                const passList = [];

                for(let i = 0; i < list.length; i++) {
                    passList.push(list[i].nome);
                }

                this.itemsList = passList;

                return this.itemsList
            },
            async getPriceAndImage(selectedItem) {
                const list = await (await getInventario()).json();
                for(let i=0; i<list.length; i++) {
                    if(selectedItem === list[i].nome) {
                        this.$emit('updateValue', list[i].precovenda);
                        this.$emit('updateImage', this.formateSrc(list[i].nome));
                        this.$emit('selectedItem', selectedItem);
                    };
                };
                this.$emit('resetAmount');
            },
            formateSrc(text) {
                const txt = text ? text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "_").toLowerCase() : '';
                const result = '/images/products/' + txt + '.jpeg';
                return result
            },
        },
        mounted() {
            this.getItens();
        },
    })
</script>
