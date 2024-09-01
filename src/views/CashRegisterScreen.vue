<template>
    <header>
        <NavBar :title="title" />
    </header>
    <main>
        <v-container class="container">
            <v-row>
            <v-col cols="12">
                <InOutRegister @updateValue="priceUpdate"/>
            </v-col>
            </v-row>
            <v-row class="flex-nowrap">
                <div class="d-flex flex-row flex-wrap">
                    <v-col cols="2.5">
                        <v-text-field
                        class="input-number"
                        type="number"
                        label="Quantidade"
                        variant="solo"
                        @input="updateTotal"
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
                        v-model="value"
                        class="input-number"
                        type="number"
                        label="Valor Unitário"
                        variant="solo"
                        disabled
                        ></v-text-field>
                        
                    <p>Valor Total: R$ {{ totalValue.toFixed(2) }}</p>
                </v-col>
                <img src="../../src/assets/images/products/cavaca.jpg" class="img-product"/>
                </div>

                    <v-col cols="7"  d-flex flex-column>
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
                totalValue: 0
            }
        },
        methods: {
            priceUpdate(newValue) {
                this.value = newValue;
            },
            updateTotal(value) {
                const num = parseFloat(this.value);
                this.totalValue = value.target.defaultValue*num;
                return this.totalValue
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
    }
    .input-number {
        width: 15vw;
    }
    .value {
        padding: 2rem;

    }
    .img-product {
        max-height: 80%;
        max-width: 80%;
        object-fit: contain;
        margin: 0 auto;
    }
</style>