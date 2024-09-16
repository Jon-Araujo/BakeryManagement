<template>
    <header>
        <NavBar :title="title" />
    </header>
    <main>
        <v-container class="container">
            <v-row>
            <v-col cols="12">
                <InOutRegister @updateValue="priceUpdate" @updateImage="imageUpdate" @selectedItem="(item)=>{this.item = item}" @resetAmount="()=>{this.amount=0}"/>
            </v-col>
            </v-row>
            <v-row class="flex-nowrap">
                <div class="d-flex flex-row flex-wrap">
                    <v-col cols="2.5">
                        <v-text-field
                        v-model="amount"
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
                        @click="registerProduct"
                    >
                        Cadastrar
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
                <div class="container-image">
                    <img :src="image" class="img-product"/>
                </div>
                </div>

                    <v-col cols="7"  d-flex flex-column>
                        <PaymentVoucher :item="this.item" :amount="this.amount" :value="this.value" :totalValue="this.totalValue" 
                        :activator="this.activator" @desactivator="(newValue)=>{this.activator = newValue}" 
                        @sumOfPrices="(v)=>{this.sumOfPrices = v}" @itemsInVoucher="(list)=>{this.itemsInVoucher = JSON.stringify(list)}"/>
                        <div class="d-flex flex-row justify-space-between align-center">
                            <h2 class="text-red mt-2">Valor Total da Compra: R$ {{ parseFloat(this.sumOfPrices).toFixed(2) }}</h2>
                            
                            <!-- Modal do status do registro de produtos -->
                            <v-dialog max-width="500">
                                <template v-slot:activator="{ props: activatorProps }">
                                    <v-btn
                                    v-bind="activatorProps"
                                    class="bg-green"
                                    text="Registrar Venda"
                                    variant="flat"
                                    @click="registerVoucher"
                                    ></v-btn>
                                </template>

                                <template v-slot:default="{ isActive }">
                                    <v-card title="Sucesso!">
                                    <v-card-text class="text-green">
                                        A compra foi finalizada e registrada com sucesso!
                                    </v-card-text>

                                    <v-card-actions>
                                        <v-spacer></v-spacer>

                                        <v-btn
                                        text="Fechar"
                                        @click="closeModal(isActive)"
                                        ></v-btn>
                                    </v-card-actions>
                                    </v-card>
                                </template>
                            </v-dialog>
                        </div>
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
    import axios from 'axios';

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
                totalValue: 0,
                image: '../../src/assets/images/charlie_patrao.png',
                item: '',
                amount: 0,
                activator: false,
                sumOfPrices: 0.00,
                itemsInVoucher: []
            }
        },
        methods: {
            priceUpdate(newValue) {
                this.value = newValue;
            },
            updateTotal(value) {
                const num = parseFloat(this.value);
                this.totalValue = value.target.defaultValue*num;

                this.amount = value.target.defaultValue;
                return this.totalValue, this.amount
            },
            imageUpdate(newValue) {
                this.image = newValue;
            },
            registerProduct() {
                this.activator = !this.activator;

                return this.activator
            },
            registerVoucher() {
                if (typeof this.itemsInVoucher === 'string') {
                    try {
                        this.itemsInVoucher = JSON.parse(this.itemsInVoucher);
                    } catch (error) {
                        console.error('Erro ao converter JSON:', error.message);
                    }
                };

                for (let i = 0; i < this.itemsInVoucher.length; i++) {
                    const list = {
                        "produto": this.itemsInVoucher[i][0],
                        "quantidade": this.itemsInVoucher[i][1],
                        "valor": this.itemsInVoucher[i][2],
                        "total": this.itemsInVoucher[i][3]
                    };
                    
                    axios.post('http://localhost:8000/api/inserir', list)
                        .then(response => {
                            console.log('Inserido no BD com sucesso!', response.data);
                        })
                        .catch(error => {
                            console.log('Ocorreu um erro ao gravar em BD:', error)
                        });
                };
            },
            closeModal(isActive) {
                isActive.value = false;
                window.location.reload() 
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
    .container-image {
        display: flex;
        justify-content: space-around;
        width: 100%;
    }
    .img-product {
        width: 30vw; 
        height: 40vh; 
        object-fit: cover; 
        border-radius: 8px;
    }
</style>