<template>
    <NavBar :title="title" />
</template>

<script>
    import NavBar from '../components/NavBar.vue';
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: "CashRegister",
        components: {
            NavBar
        },
        data() {
            return {
                title: 'Registro de Vendas'
            }
        }
    })
</script>

<style scoped>
    /* .icon-toolbar {
        height: auto;

    } */
</style>