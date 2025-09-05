<template>
    <NavBar :title="title" />
    <div class="container-options">
        <button class="btn-option" @click="changeOption('inventario')">Gerenciar Produtos</button>
        <button class="btn-option" @click="changeOption('usuario')">Gerenciar Usuários</button>
        <v-btn v-if="option === 'inventario'" @click="exportarExcel" style="width:5rem; height:5rem; position: absolute; right: 2rem; top:5.5rem"><img
                src="/images/excel-icon.jpg" alt="Icone do excel"
                style="width:5rem;"></v-btn>
    </div>

    <!-- Gerenciar produtos -->
    <v-text-field v-if="option === 'inventario'" v-model="search" label="Pesquisar" prepend-inner-icon="mdi-magnify" clearable hide-datails dense class="search-bar"/>
    <div v-if="option === 'inventario'" class="container-inventario">


        <v-dialog max-width="500">
            <template v-slot:activator="{ props: activatorProps }">
                <v-btn v-bind="activatorProps" color="surface-variant" variant="flat" class="btn-add">
                    <p class="plus">+</p>
                    <p>Adicionar Produto</p>
                </v-btn>
            </template>
            
            <template v-slot:default="{ isActive }">
                <v-card title="Cadastrar novo item">
                    <v-btn text="X" class="close-modal" @click="isActive.value = false"></v-btn>

                    <v-form class="modal-form" @submit.prevent="submitForm()">
                        <label for="nome">
                            Nome do Produto:
                        </label>
                        <input class="input-modal" type="text" id="nome" v-model="produtoNome">

                        <label for="precocompra">
                            Preço de Compra:
                        </label>
                        <input class="input-modal" type="text" id="precocompra" v-model="produtoPrecocompra">

                        <label for="Preço de Venda">
                            Preço de Venda:
                        </label>
                        <input class="input-modal" type="text" id="Preço de Venda" v-model="produtoPrecovenda">

                        <label for="marca">
                            Marca/Empresa:
                        </label>
                        <input class="input-modal" type="text" id="marca" v-model="produtoMarca">

                        <label for="qtd">
                            Quantidade:
                        </label>
                        <input class="input-modal" type="text" id="qtd" v-model="produtoQtd">

                        <v-btn color="primary" width="80%" type="submit">Enviar</v-btn>
                    </v-form>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>

        <v-dialog max-width="800" v-for="item in produtosFiltrados" :key="item.id">
            <template v-slot:activator="{ props: activatorProps }">
                <button v-bind="activatorProps" color="surface-variant" variant="flat" class="card">
                    <img :src="formateSrc(item.nome)"  :alt="item.nome" class="image">
                    <p class="product-name">{{ item.nome }}</p>
                </button>
            </template>

            <template v-slot:default="{ isActive }">
                <v-card :title="item.nome">
                    <v-btn text="X" class="close-card" @click="isActive.value = false"></v-btn>

                    <v-form class="modal-form">
                        <label for="nome">
                            Nome do Produto:
                        </label>
                        <input class="input-modal" type="text" id="nome" v-model="produtoNome" :placeholder="item.nome">

                        <label for="precocompra">
                            Preço de Compra:
                        </label>
                        <input class="input-modal" type="text" id="precocompra" v-model="produtoPrecocompra"
                            :placeholder="item.precocompra">

                        <label for="Preço de Venda">
                            Preço de Venda:
                        </label>
                        <input class="input-modal" type="text" id="Preço de Venda" v-model="produtoPrecovenda"
                            :placeholder="item.precovenda">

                        <label for="marca">
                            Marca/Empresa:
                        </label>
                        <input class="input-modal" type="text" id="marca" v-model="produtoMarca"
                            :placeholder="item.empresa">

                        <label for="qtd">
                            Quantidade:
                        </label>
                        <input class="input-modal" type="text" id="qtd" v-model="produtoQtd" :placeholder="item.qtd">

                        <div class="btns-product">
                            <button color="primary" width="45%" class="btns edit"
                                @click="editCard(item.id, item.nome, item.precocompra, item.precovenda, item.empresa, isActive)">Editar
                                Produto</button>
                            <button color="primary" width="45%" class="btns delete"
                                @click="deleteCard(item.id, isActive)">Excluir Produto</button>
                        </div>
                    </v-form>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                    </v-card-actions>

                </v-card>
            </template>
        </v-dialog>
    </div>

    <!-- Gerenciar usuário -->
    <div v-if="option === 'usuario'" class="container-usuario">
        <v-dialog max-width="500">
            <template v-slot:activator="{ props: activatorProps }">
                <div style="display: flex; flex-direction: column;">
                    <v-btn v-bind="activatorProps" color="surface-variant" variant="flat" class="btn-add-user">
                        <p class="plus">+</p>
                    </v-btn>
                    <p class="title-card">Adicionar usuário</p>
                </div>
            </template>

            <template v-slot:default="{ isActive }">
                <v-card title="Cadastrar novo usuário">
                    <v-btn text="X" class="close-modal" @click="isActive.value = false"></v-btn>

                    <v-form class="modal-form" @submit.prevent="registerUser(userName, userPassword)">
                        <label for="nome">
                            Nome do Usuário:
                        </label>
                        <input class="input-modal" type="text" id="nome" v-model="userName">

                        <label for="precocompra">
                            Senha de acesso:
                        </label>
                        <input class="input-modal" type="text" id="precocompra" v-model="userPassword">

                        <v-btn color="primary" width="80%" type="submit">Confirmar cadastro</v-btn>
                    </v-form>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>

        <div v-for="user, index in users" style="position: relative; width: 200px; height: 200px;">
            <v-avatar :image="`/images/profile/${user.nome}.png`" size="200"></v-avatar>
            <button class="btn-delete-user" @click="deleteUser(user.id)"><img src="/public/images/trash.jpeg"
                    alt="Lixeira em vermelho."></button>
            <p class="title-card">{{ user.nome.charAt(0).toUpperCase() + user.nome.slice(1).toLowerCase() }}</p>
        </div>

    </div>


    <!-- Filtro por Produtos: -->
    <!-- <v-row v-if="option === 'produto'" class="mt-5">
        <v-col cols="12">
            <v-autocomplete label="Selecione o filtro" :items="inventario" v-model="selectedItem"></v-autocomplete>
            <v-table fixed-header id="payment-voucher">
                <thead>
                    <tr>
                        <th class="text-left">
                            Número
                        </th>
                        <th class="text-left">
                            Descrição
                        </th>
                        <th class="text-left">
                            Qtd
                        </th>
                        <th class="text-left">
                            Vlr. Unit.
                        </th>
                        <th class="text-left">
                            Total
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item, index in list">
                        <td v-if="item.produto === selectedItem">{{ index + 1 }}</td>
                        <td v-if="item.produto === selectedItem">{{ item.produto }}</td>
                        <td v-if="item.produto === selectedItem">{{ item.quantidade }}</td>
                        <td v-if="item.produto === selectedItem">R$ {{ item.valor }}</td>
                        <td v-if="item.produto === selectedItem">R$ {{ item.total }}</td>
                    </tr>
                </tbody>
            </v-table>
        </v-col>
    </v-row> -->

    <!-- Filtro por Dia -->
    <!-- <v-row v-if="option === 'dia'" class="mt-5">
        <v-col cols="12">
            <v-date-input label="Selecione a data" class="w-75 mx-auto" v-model="selectedOption"
                @update:model-value="sumValues()"></v-date-input>

            <v-table fixed-header id="payment-voucher">
                <thead>
                    <tr>
                        <th class="text-left">
                            Número
                        </th>
                        <th class="text-left">
                            Descrição
                        </th>
                        <th class="text-left">
                            Qtd
                        </th>
                        <th class="text-left">
                            Vlr. Unit.
                        </th>
                        <th class="text-left">
                            Total
                        </th>
                        <th class="text-left">
                            Dia do Registro
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item, index in list">
                        <td
                            v-if="selectedOption && new Date(item.datahora).toLocaleDateString('pt-BR') === selectedOption.toLocaleDateString()">
                            {{ index + 1 }}</td>
                        <td
                            v-if="selectedOption && new Date(item.datahora).toLocaleDateString('pt-BR') === selectedOption.toLocaleDateString()">
                            {{ item.produto }}</td>
                        <td
                            v-if="selectedOption && new Date(item.datahora).toLocaleDateString('pt-BR') === selectedOption.toLocaleDateString()">
                            {{ item.quantidade }}</td>
                        <td
                            v-if="selectedOption && new Date(item.datahora).toLocaleDateString('pt-BR') === selectedOption.toLocaleDateString()">
                            R$ {{ item.valor }}</td>
                        <td v-if="selectedOption && new Date(item.datahora).toLocaleDateString('pt-BR') === selectedOption.toLocaleDateString()"
                            class="total-value">
                            R$ {{ item.total }}</td>
                        <td
                            v-if="selectedOption && new Date(item.datahora).toLocaleDateString('pt-BR') === selectedOption.toLocaleDateString()">
                            {{ new Date(item.datahora).toLocaleDateString('pt-BR') }}</td>
                    </tr>
                </tbody>
            </v-table>
        </v-col>
    </v-row> -->
</template>

<script>
import { defineComponent } from 'vue';
import axios from 'axios';
import NavBar from '@/components/NavBar.vue';
import { deleteItem, editItem, saveOnInventario } from '@/services/CrudInventario';

export default defineComponent({
    name: "SalesControl",
    components: {
        NavBar
    },
    data() {
        return {
            title: 'Controle de Vendas',
            selectedItem: '',
            selectedOption: null,
            productsList: [],
            list: [],
            option: 'inventario',
            sum: 0.00,
            inventario: [],
            produtoNome: '',
            produtoPrecocompra: '',
            produtoPrecovenda: '',
            produtoMarca: '',
            produtoQtd: '',
            produtoQtd: '',
            userName: '',
            userPassword: '',
            users: [],
            search: ''
        }
    },
    methods: {
        async getList() {
            const list = [];
            try {
                const response = await axios.get('http://localhost:8000/api/listarProdutos');
                for (let i = 0; i < response.data.length; i++) {
                    list.push(response.data[i]);
                }
            } catch (erro) {
                console.log('Erro:', erro);
            }

            for (let i = 0; i < list.length; i++) {
                this.productsList.push(list[i].produto);
            }
            this.list = list;

            return this.productsList, this.list
        },
        sumValues() {
            const values = document.querySelectorAll('.total-value');
            let sum = 0.00;
            for (let i = 0; i < values.length; i++) {
                sum += parseFloat(values[i].textContent.trim().replace('R$', '').trim());
                console.log(sum)
            }
        },
        changeOption(option) {
            console.log(option);
            if (option === 'usuario') {
                this.getUsers();
            }
            this.option = option;
            this.$forceUpdate();
        },
        formateSrc(text) {
            if(!text) return '*';
            
            const txt = text ? text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "_").toLowerCase() : '';
            //const extensions = ['.jpeg', '.jpg', '.png'];
            //const results = extensions.map(ext=>`/images/products/${txt}${ext}`);
            const result = '/images/products/' + txt + '.jpeg';
            return result
        },
        tryNextExtension() {
            if (this.currentIndex < this.extesions.length - 1) {
                this.currentIndex += 1;
            }
        },
        async getInventario() {
            const inventario = [];
            try {
                const response = await axios.get('http://localhost:8000/api/produtosCadastrados');
                for (let i = 0; i < response.data.length; i++) {
                    inventario.push(response.data[i]);
                }
            } catch (erro) {
                console.log('Erro:', erro);
            }

            this.inventario = inventario;

            return this.inventario
        },
        async submitForm() {
            await saveOnInventario(this.produtoNome, this.produtoPrecocompra, this.produtoPrecovenda, this.produtoMarca, this.produtoQtd);
            this.produtoNome = '';
            this.produtoPrecocompra = '';
            this.produtoPrecovenda = '';
            this.produtoMarca = '';
            this.produtoQtd = '';
            this.addProduct = false;
            await this.getInventario();
        },
        async editCard(id, nome, precoCompra, precoVenda, marca, qtd, isActive) {
            await editItem(
                id,
                this.produtoNome !== '' ? this.produtoNome : nome,
                this.produtoPrecocompra !== '' ? this.produtoPrecocompra : precoCompra,
                this.produtoPrecovenda !== '' ? this.produtoPrecovenda : precoVenda,
                this.produtoMarca !== '' ? this.produtoMarca : marca,
                this.produtoQtd !== ''? this.produtoQtd : qtd
            );

            this.produtoNome = '';
            this.produtoPrecocompra = '';
            this.produtoPrecovenda = '';
            this.produtoMarca = '';
            this.produtoQtd = '';

            await this.getInventario();
            isActive = false;
        },
        async deleteCard(id, isActive) {
            await deleteItem(id);

            this.produtoNome = '';
            this.produtoPrecocompra = '';
            this.produtoPrecovenda = '';
            this.produtoMarca = '';

            await this.getInventario();
            isActive.value = false;
        },
        async getUsers() {
            try {
                const usersList = await (await fetch('http://localhost:8000/api/users')).json();
                this.users = usersList;
            } catch (error) {
                console.error('Erro ao resgatar usuários:', error);
            }
        },
        async deleteUser(id) {
            try {
                await fetch(`http://localhost:8000/api/deleteUser/${id}`, { method: "DELETE" });

                window.location.reload();
            } catch (error) {
                console.error('Erro ao excluir usuário:', error)
            }
        },
        async registerUser(name, password) {
            try {
                await fetch('http://localhost:8000/api/registerUser', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ nome: name, senha: password })
                });

                window.location.reload();
            } catch (error) {
                console.error(error);
            }
        },
        async exportarExcel() {
            try {
                const response = await fetch('http://localhost:8000/api/exportar-inventario');

                if (!response.ok) throw new Error('Erro ao exportar Excel');

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.download = 'inventario.xlsx';
                link.click();

                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Erro ao exportar Excel:', error);
            }
        }
    },
    mounted() {
        this.getList()
        this.getInventario();
        this.getUsers();
    },
    computed: {
        produtosFiltrados() {
            if (!this.search) {
            return this.inventario;
            }
            const termo = this.search.toLowerCase();
            return this.inventario.filter(item =>
            item.nome.toLowerCase().includes(termo)
            );
        }
    }
})
</script>

<style lang="scss" scoped>
.container-options {
    display: flex;
    justify-content: space-evenly;
    margin: 0 auto;
    width: 50%;
    margin-top: 2rem;

    .btn-option {
        padding: 1rem;
        border: 1px solid black;
        border-radius: 20px;

        &:hover {
            transform: scale(1.1);
        }
    }
}

.search-bar {
    width: 50%;
    margin: .5% 25% 0;
    position:absolute
}

.container-inventario {
    padding: 2rem;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: auto;
    gap: .25%;

    .btn-add {
        border: 1px solid #000000;
        padding: .25rem 1rem 0 1rem;
        position: absolute;
        right: 3%;
        top: .15%;
        line-height: 1.7rem;
        transition: all;
        transition-duration: 200ms;
        border-radius: 20px;

        .plus {
            font-size: 2.5rem;
            margin-right: 1rem;
        }

        &:hover {
            top: .1%;
        }
    }

    .card {
        overflow: hidden;
        border-radius: 20px;
        height: 30vh;

        .image {
            width: 100%;
            height: 100%;
            object-fit: contain;
            transition: transform 0.3s ease-in-out;

            &:hover {
                transform: scale(1.1);
            }
        }

        .product-name {
            color: #FFFFFF;
            background-color: black;
            position: relative;
            top: -3.5rem;
            font-size: 32px;
            font-weight: bold;
            text-decoration: underline;
        }
    }
}

.container-usuario {
    padding: 3rem 6rem;
    display: grid;
    grid-template-columns: repeat(5, 200px);
    gap: 50px;

    .btn-add-user {
        border-radius: 100%;
        width: 200px;
        height: 200px;
        transition: all;
        transition-duration: 1s;

        .plus {
            font-size: 4rem;
        }

        &:hover {
            bottom: 8%;
        }
    }

    .btn-delete-user {
        position: absolute;
        top: 8px;
        right: 12px;
        height: 40px;
        width: 40px;
        border: none;
        background-color: transparent;
        cursor: pointer;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 100%;
        }
    }

    .title-card {
        font-size: 1.5rem;
        text-align: center;
        margin-top: 0.4rem;
        font-weight: 900;
        text-decoration: underline;
    }

}

.close-card {
    position: absolute;
    right: 0;
    top: .1rem;
}

.close-modal {
    position: absolute;
    right: 0;
}

.btns-product {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 80%;

    .btns {
        padding: 0.25rem 3rem;
        width: 45%;
        border-radius: 8px;
    }

    .delete {
        border: 1px solid red;
        color: red;

        &:hover {
            background-color: red;
            color: #FFFFFF;
        }
    }

    .edit {
        border: 1px solid #F2D02F;
        color: #F2D02F;

        &:hover {
            background-color: #F2D02F;
            color: #FFFFFF;
        }
    }
}

.modal-form {
    display: flex;
    flex-direction: column;
    margin: 0 10%;
    width: 100%;

    label {
        width: 100%;
        margin-bottom: 0.2rem;
    }

    .input-modal {
        width: 80%;
        padding: .5rem;
        border: 1px solid black;
        margin-bottom: 1rem;
        border-radius: 8px;
    }
}
</style>
