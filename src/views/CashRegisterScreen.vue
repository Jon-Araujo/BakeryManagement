<template>
    <header>
        <NavBar :title="title" />
    </header>
    <main>
        <!-- Mensagem de cumprimento ao usuário -->
        <h1 class="msg" v-if="caixaAberto">Olá, {{ user }}</h1>

        <!-- Relatório de vendas -->
        <v-dialog max-width="800" scrollable height="100vh">
            <template v-slot:activator="{ props: activatorProps }">
                <v-btn v-bind="activatorProps" class="shopReport" @click="verifySales(isActive)">
                    <img src="/public/list.svg" alt="Icone de lista">
                </v-btn>
            </template>

            <template v-slot:default="{ isActive }">
                <v-card title="Histórico de vendas">
                    <v-btn text="X" @click="isActive.value = false" class="close-modal"></v-btn>
                    <table class="registerTable">
                        <thead>
                            <tr style="background-color: #f0f0f0;">
                                <th>Produto</th>
                                <th>Quantidade</th>
                                <th>Valor</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(sale, index) in sales" :key="index" class="registerRow"
                                :style="index % 2 !== 0 ? 'background-color:#f0f0f0' : ''">
                                <td>{{ sale.produto }}</td>
                                <td>{{ sale.quantidade }}</td>
                                <td>{{ sale.valor }}</td>
                                <td>{{ sale.total }}</td>
                            </tr>
                            <tr class="registerRow" style="background-color: #00FE52; color: white; font-weight: bold;">
                                <td colspan="2">Total de vendas:</td>
                                <td colspan="2">{{ ConvertCurrency(Number(totalRegister) + Number(initialValue)) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </v-card>
            </template>
        </v-dialog>

        <!-- Modal de Login para abrir caixa -->
        <v-dialog max-width="500" v-if="!caixaAberto">
            <template v-slot:activator="{ props: activatorProps }">
                <v-btn class="open-register" v-bind="activatorProps">Abrir o Caixa</v-btn>
            </template>

            <template v-slot:default="{ isActive }">
                <v-card title="Login">
                    <v-btn text="X" @click="isActive.value = false" class="close-modal"></v-btn>


                    <v-autocomplete clearable label="Usuário" v-model="user" :items="users" variant="solo-filled"
                        class="inputs-login" return-object>
                    </v-autocomplete>

                    <v-text-field v-model="password" :rules="PasswordRules" label="Senha" required
                        v-if="user.length !== 0" class="inputs-login">
                    </v-text-field>

                    <v-text-field type="number" v-model="initialValue" label="Valor inicial do caixa" required
                        class="inputs-login"></v-text-field>

                    <v-btn class="btn-login" @click="login(isActive)">Login</v-btn>
                </v-card>
            </template>
        </v-dialog>

        <!-- Modal para fechar caixa - logout -->
        <v-dialog max-width="500" v-if="caixaAberto">
            <template v-slot:activator="{ props: activatorProps }">
                <v-btn class="close-register" v-bind="activatorProps">Fechar o Caixa</v-btn>
            </template>

            <template v-slot:default="{ isActive }">
                <v-card title="Fechamento de Caixa">
                    <v-btn text="X" @click="isActive.value = false" class="close-modal"></v-btn>

                    <div class="container-close-register">
                        <p class="text-finish-register">O caixa iniciou com: {{ ConvertCurrency(initialValue) }}</p>

                        <p class="text-finish-register">O valor vendido foi: R$ {{ ConvertCurrency(totalRegister) }}
                        </p>

                        <v-text-field v-model="finalValue" label="Valor de fechamento" required
                            class="input-final-value" @update:modelValue="calculationDifferenceValue">
                        </v-text-field>

                        <p class="text-finish-register">O caixa está sendo fechado com a diferença de:</p>
                        <p class="value-difference" :class="{
                            'text-green': differenceValue > 0,
                            'text-red': differenceValue < 0
                        }">{{ ConvertCurrency(differenceValue) }}</p>

                        <v-btn class="btn-logout"
                            @click="validateAndFinish(isActive)">Fechar o caixa</v-btn>
                    </div>

                </v-card>
            </template>
        </v-dialog>

        <!-- Alertas de Login -->
        <v-alert v-if="showSuccessAlert" text="Login realizado com sucesso!" title="Sucesso" type="success" closable
            class="alert-login"></v-alert>

        <v-alert v-if="showFailAlert" text="Falha em realizar o login. Verifique o login/senha!" title="Falha de Login"
            type="error" closable class="alert-login"></v-alert>

        <!-- Registrador de vendas -->
        <v-container class="container"
            :style="{ opacity: caixaAberto ? '1' : '0.5', pointerEvents: caixaAberto ? 'auto' : 'none' }">
            <v-row>
                <v-col cols=" 12">
                    <InOutRegister @updateValue="priceUpdate" @updateImage="imageUpdate"
                        @selectedItem="(item) => { this.item = item }" @resetAmount="() => { this.amount = 0 }" />
                </v-col>
            </v-row>
            <v-row class="flex-nowrap">
                <div class="d-flex flex-row flex-wrap">
                    <v-col cols="2.5">
                        <v-text-field v-model="amount" class="input-number" type="number" label="Quantidade"
                            variant="solo" @input="updateTotal" min="0"></v-text-field>
                        <v-btn color="primary" variant="text" cols="5" @click="registerProduct">
                            Cadastrar
                        </v-btn>
                    </v-col>
                    <v-col cols="2.5">
                        <v-text-field v-model="value" class="input-number" type="number" label="Valor Unitário"
                            variant="solo" disabled></v-text-field>

                        <p>Valor Total: R$ {{ totalValue.toFixed(2) }}</p>
                    </v-col>
                    <div class="container-image">
                        <img :src="image" class="img-product" />
                    </div>
                </div>

                <v-col cols="7" d-flex flex-column>
                    <PaymentVoucher :item="this.item" :amount="this.amount" :value="this.value"
                        :totalValue="this.totalValue" :activator="this.activator"
                        @desactivator="(newValue) => { this.activator = newValue }"
                        @sumOfPrices="(v) => { this.sumOfPrices = v }"
                        @itemsInVoucher="(list) => { this.itemsInVoucher = JSON.stringify(list) }" />
                    <div class="d-flex flex-row justify-space-between align-center">
                        <h2 class="text-red mt-2">Valor Total da Compra: R$ {{
                            parseFloat(this.sumOfPrices).toFixed(2)
                        }}</h2>

                        <!-- Modal do status do registro de produtos -->
                        <v-dialog max-width="500" v-model="dialog" persistent>
                            <template v-slot:activator="{ props: activatorProps }">
                                <v-btn v-bind="activatorProps" class="bg-green" text="Registrar Venda" variant="flat"
                                    @click="registerVoucher"></v-btn>
                            </template>

                            <template v-slot:default="{ isActive }">
                                <v-card title="Sucesso!">
                                    <v-card-text class="text-green">
                                        A compra foi finalizada e registrada com sucesso!
                                    </v-card-text>

                                    <v-card-actions>
                                        <v-spacer></v-spacer>

                                        <v-btn text="Fechar" @click="closeModal(isActive)"></v-btn>
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
import axios from 'axios';
import { defineComponent } from 'vue';

import createPdf from '@/services/CreatePDF';
import sendEmail from '@/services/SendReport';

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
            image: '/images/logo.jpg',
            item: '',
            amount: 0,
            activator: false,
            sumOfPrices: 0.00,
            itemsInVoucher: [],
            users: [],
            user: '',
            password: '',
            usersList: [],
            caixaAberto: false,
            showSuccessAlert: false,
            showFailAlert: false,
            initialValue: 0,
            totalRegister: 0,
            finalValue: 0,
            differenceValue: 0,
            sales: [],
            dialog: false
        }
    },
    methods: {
        ConvertCurrency(price) {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(price);
        },
        priceUpdate(newValue) {
            this.value = newValue;
        },
        updateTotal(value) {
            const num = parseFloat(this.value);
            this.totalValue = value.target.defaultValue * num;

            this.amount = value.target.defaultValue;
            return this.totalValue, this.amount
        },
        imageUpdate(newValue) {
            this.image = newValue;
        },
        registerProduct() {
            if (this.amount <= 0) {
                alert("Quantidade deve ser maior que zero")
                return
            }

            this.activator = !this.activator;

            return this.activator
        },
        async registerVoucher() {
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
                    "total": this.itemsInVoucher[i][3],
                    "user": this.user,
                };

                axios.post('http://localhost:8000/api/inserir', list)
                    .then(response => {
                        console.log('Inserido no BD com sucesso!', response.data);
                    })
                    .catch(error => {
                        console.log('Ocorreu um erro ao gravar em BD:', error)
                    });

                axios.post(`http://localhost:8000/api/diminuir-qtd/${encodeURIComponent(list?.produto)}`, { qtd: list?.quantidade })
                    .then(response => {
                        console.log('Quantidade diminuída do BD', response.data)
                    })
                    .catch(error => {
                        console.error('Erro ao diminuir quantidade do BD', error)
                    })

            };

            await this.updateTotalRegister();
        },
        closeModal(isActive) {
            isActive.value = false;
            window.location.reload()
        },
        async getUsers() {
            let usersList = await fetch('http://localhost:8000/api/users');
            usersList = await usersList.json();
            const passList = [];

            for (let i = 0; i < usersList.length; i++) {
                passList.push(usersList[i].nome);
            };

            this.users = passList;
            this.usersList = usersList;
        },
        async login(isActive) {
            const index = this.usersList.findIndex((u) => this.user === u.nome);

            if (this.usersList[index].senha === this.password) {
                const result = await fetch('http://localhost:8000/api/inserir', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ produto: 'abertura de caixa', quantidade: 0, valor: 0, total: this.initialValue, user: this.user })
                });

                localStorage.setItem('registerOpen', this.user);

                this.caixaAberto = true;
                isActive.value = false;

                this.showSuccessAlert = true;
                setTimeout(() => this.showSuccessAlert = false, 5000);
            } else {
                isActive.value = false;

                this.showFailAlert = true;
                setTimeout(() => this.showFailAlert = false, 5000)
            }

            this.password = '';
        },
        validateAndFinish(isActive) {
            if (Number(this.finalValue) === 0) {
                alert('Valor de fechamento deve ser maior que R$0,00'); // aqui funciona
            } else {
                this.finishRegister(isActive);
            }
        },
        async finishRegister(isActive) {
            try {
                const sales = await (await fetch('http://localhost:8000/api/listarProdutos')).json();

                // Criando o PDF:
                await createPdf(sales, this.user, this.initialValue, this.finalValue, this.differenceValue);

                // Zerando BD
                await fetch('http://localhost:8000/api/deletarProdutos', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                // Zerando os dados ao fechar o caixa
                localStorage.removeItem('registerOpen');

                isActive = false;
                this.user = '';
                this.caixaAberto = false;
                this.initialValue = 0;
                this.finalValue = 0;
                this.differenceValue = 0;
            } catch (error) {
                console.error('Erro ao registrar fechamento de caixa: ', error);
            };
        },
        verifyStorage() {
            const isRegisterOpen = localStorage.getItem('registerOpen');
            if (isRegisterOpen && isRegisterOpen.length > 0) {
                this.caixaAberto = true;
                this.user = isRegisterOpen.charAt(0).toUpperCase() + isRegisterOpen.slice(1).toLowerCase();
            } else {
                this.caixaAberto = false;
            }
        },
        async updateTotalRegister() {
            const sales = await (await fetch('http://localhost:8000/api/listarProdutos')).json();
            let totalPrice = 0;

            for (let i = 1; i < sales.length; i++) {
                totalPrice += parseFloat(sales[i].total) || 0;
            }
            this.totalRegister = totalPrice;
            this.calculationDifferenceValue();

            //get inital value
            const initialValue = sales[0].total;
            this.initialValue = initialValue;
        },
        calculationDifferenceValue(event) {
            this.finalValue = event.replace(',', '.') || 0;
            this.differenceValue = parseFloat(this.finalValue) - (parseFloat(this.initialValue) + parseFloat(this.totalRegister));
        },
        async verifySales(isActive) {
            const sales = await (await fetch('http://localhost:8000/api/listarProdutos')).json();
            console.log(sales)
            this.sales = sales;
            setTimeout(() => {
                isActive.value = false
            }, 3000);
        },
    },
    mounted() {
        this.getUsers();
        this.verifyStorage();
        this.updateTotalRegister();
    }
})
</script>

<style scoped lang="scss">
.msg {
    position: absolute;
    top: .5rem;
    left: 40%;
}

.shopReport {
    position: absolute;
    right: 12rem;
    top: 1rem;
}

.open-register {
    position: absolute;
    top: 1rem;
    right: 1rem;
    transition: all;
    transition-duration: 300ms;

    &:hover {
        top: 0.6rem;
    }
}

.inputs-login {
    width: 85%;
    margin: 1rem auto 0;
}

.btn-login {
    width: 85%;
    margin: 3rem auto;
    background-color: #f0f0f0;
    transition: all;
    transition-duration: 200ms;

    &:hover {
        width: 90%;
    }
}

.close-modal {
    position: absolute;
    right: .5rem;
    top: 1rem;
}

.alert-login {
    position: absolute;
    z-index: 20;
    left: 1rem;
    bottom: 1.5rem;
}

.close-register {
    position: absolute;
    right: 1rem;
    top: 1rem;
    transition: all;
    transition-duration: 300ms;

    &:hover {
        top: 0.6rem;
    }
}

.container-close-register {
    display: flex;
    flex-direction: column;
    margin: 0 5%;
    align-items: center;

    .text-finish-register {
        font-size: 1.2rem;
        text-decoration: underline;
        text-underline-offset: 0.3rem;
        margin-bottom: 1rem;
    }

    .value-difference {
        font-size: 1.4rem;
        font-weight: 600;
    }

    .input-final-value {
        width: 100%;
        margin: 2rem 0;
    }

    .btn-logout {
        width: 80%;
        margin: 3rem 0;
        transition: all;
        transition-duration: 300ms;

        &:hover {
            width: 95%;
        }
    }
}

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

.registerTable {
    overflow-y: auto;
    margin: 2rem 0 0 0;
}

.registerRow {
    text-align: center;
}
</style>