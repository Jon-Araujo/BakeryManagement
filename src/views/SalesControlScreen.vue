<template>
    <NavBar :title="title" />
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import { defineComponent } from 'vue';

    export default defineComponent({
        name: "SalesControl",
        components: {
            NavBar
        },
        data() {
            return {
                title: 'Controle de Vendas'
            }
        }
    })
</script>