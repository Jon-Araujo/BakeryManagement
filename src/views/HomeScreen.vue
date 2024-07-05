<template>
    <v-app>
        <header>
            <v-toolbar :elevation="8">
                <v-toolbar-title>Bakery Management</v-toolbar-title>
            </v-toolbar>
        </header>
        <main>
            <section class="card-list">
                <nav>
                    <router-link to="/cash-register">
                    <v-card class="mx-auto card" hover>
                        <v-card-item>
                            <v-card-title class="card-title">Registro de Vendas</v-card-title>
                            <v-img src="../assets/images/caixa.png" class="card-img"  cover />
                        </v-card-item>
                    </v-card>
                </router-link>
            </nav>

            <nav>
                <router-link to ="/sales-control">
                    <v-card class="mx-auto card" hover>
                        <v-card-item>
                            <v-card-title class="card-title">Controle de Vendas</v-card-title>
                            <v-img src="../assets/images/controle-financeiro.png" class="card-img"  cover />
                        </v-card-item>
                    </v-card>
                </router-link>
            </nav>
            </section>
        </main>
    </v-app>
</template>

<script>
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: "HomeScreen",
    })
</script>

<style>
    .card-list {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        width: 70vw;
        margin: 10% 15% 0;
    }
    .card {
        width: 25vw;
        margin: 0;
    }
    .card-title {
        text-align: center;
    }
    .card-img {
        /* width: 240px; */
        height: 40vh; 
    }
</style>