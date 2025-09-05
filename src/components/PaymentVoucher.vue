<template>

    <v-table height="300px" fixed-header id="payment-voucher">
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
                    
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item, index in listItems">
                <td>{{ index + 1 }}</td>
                <td>{{ item[0] }}</td>
                <td>{{ item[1] }}</td>
                <td>{{ item[2] }}</td>
                <td>{{ item[3] }}</td>
                <td><button @click="deleteItem(item[0])"><img src="/images/trash.jpeg" alt="ícone de lixeira" id="icon-trash"></button></td>
            </tr>
        </tbody>
    </v-table>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: "PaymentVoucher",
    data() {
        return {
            name: '',
            price: 0,
            quantity: 0,
            totalPrice: 0,
            listItems: []
        }
    },
    props: {
        item: { type: String },
        amount: { type: Number },
        value: { type: Number },
        totalValue: { type: Number },
        activator: { type: Boolean }
    },
    methods: {
        getList() {
            if (this.activator === true) {
                const nome = this.item;
                const qtd = parseInt(this.amount);
                const valorUnit = parseFloat(this.value);
                const valorTotal = parseFloat(this.totalValue.toFixed(2));

                const index = this.listItems.findIndex(item => item[0] === nome);

                if (index !== -1) {
                    this.listItems[index][1] += qtd;
                    this.listItems[index][3] = (this.listItems[index][1] * valorUnit).toFixed(2);
                } else {
                    const list = [nome, qtd, valorUnit.toFixed(2), valorTotal.toFixed(2)];
                    this.listItems.push(list);
                }

                this.$emit('desactivator', false);
                this.$emit('itemsInVoucher', this.listItems);
                this.getTotalOfVoucher();

                return this.listItems;
            }

        },
        getTotalOfVoucher() {
            let sum = 0;
            for (let i = 0; i < this.listItems.length; i++) {
                sum += parseFloat(this.listItems[i][3])
            };
            this.$emit("sumOfPrices", sum.toFixed(2))
        },
        deleteItem(product) {
            const newList = this.listItems.filter((name)=> name[0] !== product);
            this.listItems = newList;
            this.getTotalOfVoucher();
        }
    },
    watch: {
        activator() {
            this.getList();
        }
    }
})
</script>

<style scoped>
#payment-voucher {
    border: solid 5px #000;
    height: 60vh;
}

#icon-trash {
    width: 2rem;
    border-radius: 100%;
}
</style>