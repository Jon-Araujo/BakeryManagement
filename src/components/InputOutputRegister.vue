<template>
        <v-autocomplete
            label="Produtos"
            
            class="search-itens"
            bg-color="#FFF">
        </v-autocomplete>
        <p>{{ itensList }}</p>
</template>

<script>
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: "InOutRegister",
        data() {
            return {
                itensList: []
            }
        },
        methods: {
            async getItens() {
                const itensJson = await(await fetch("../db/itensList.json")).json();
                const products = ['1', '2'];
                for(i=0; i<products.length; i++) {
                    this.itensList.push(products[i]);
                }
                return this.itensList
            }
        },
        mounted() {
            this.getItens();
        },
    })
</script>

<style scoped>
    .search-itens {
        /* width: 70%; */
        /* margin: 2%; */
    }
</style>