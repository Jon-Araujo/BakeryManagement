<template>
    <header>
        <NavBar :title="title" />
    </header>
    <main>
        <v-container class="container">
            <v-row>
            <v-col cols="12">
                <InOutRegister />
            </v-col>
            </v-row>
            <v-row>
                    <v-col cols="2.5">
                        <v-text-field
                        v-model="value"
                        class="input-number"
                        type="number"
                        label="Quantidade"
                        variant="solo"
                    ></v-text-field>
                    <v-btn
                        color="primary"
                        variant="text"
                        cols="5"
                    >
                        Submit
                    </v-btn>
                    </v-col>
                    <v-col cols="2.5">
                        <v-text-field
                        value="{{ value }}"
                        class="input-number"
                        type="number"
                        label="Valor Unitário"
                        variant="solo"
                        disabled="true"
                        ></v-text-field>
                        
                    <p>Valor Total: {{ value }}</p>
                    </v-col>
                <v-col cols="7">
                    <PaymentVoucher />
                </v-col>
            </v-row>
        </v-container>
    </main>
</template>

<script>
    import NavBar from '../components/NavBar.vue';
    import InOutRegister from '@/components/InputOutputRegister.vue';
    import PaymentVoucher from '@/components/PaymentVoucher.vue';
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: "CashRegister",
        components: {
            NavBar,
            InOutRegister,
            PaymentVoucher
        },
        data() {
            return {
                title: 'Registro de Vendas',
                value: '',
            }
        }
    })
</script>

<style scoped>
    .container {
        background-color: #F0F0F0;
        max-width: 90vw !important;
        height: 85vh;
        margin: 3vh 5vw;
        border-radius: 20px;
        /* display: flex;
        flex-wrap: wrap; */
    }
    .input-number {
        width: 15vw;
    }
    .value {
        padding: 2rem;

    }
</style>