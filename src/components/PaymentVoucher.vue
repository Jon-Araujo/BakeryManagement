<template>
    
    <v-table
        height="300px"
        fixed-header
        id="payment-voucher"
    >
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
        <tr v-for="item, index in listItems">
            <td>{{ index + 1 }}</td>
            <td>{{ item[0]}}</td>
            <td>{{ item[1]}}</td>
            <td>{{ item[2]}}</td>
            <td>{{ item[3]}}</td>
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
        item: {type: String},
        amount: {type: Number},
        value: {type: Number},
        totalValue: {type: Number},
        activator: {type: Boolean}
    },
    methods: {
        getList() {
            if (this.activator === true) {
                const list = [];
                list.push(this.item, parseInt(this.amount), parseInt(this.value), parseInt(this.totalValue.toFixed(2)));
                this.listItems.push(list);
                this.$emit('desactivator', false);
                this.$emit('itemsInVoucher', this.listItems);
                this.getTotalOfVoucher();
                
                return this.listItems
            }
        },
        getTotalOfVoucher() {
            let sum = 0;
            for (let i = 0; i < this.listItems.length; i++) {
                sum += parseFloat(this.listItems[i][3])
            };
            this.$emit("sumOfPrices", sum.toFixed(2))
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
#payment-voucher{
    border: solid 5px #000;
    height: 60vh;
}
</style>