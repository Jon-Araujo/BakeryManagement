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
        <tr>
            <td>{{ number }}</td>
            <td>{{ name }}</td>
            <td>{{ price }}</td>
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
            number: 0,
            name: '',
            price: ''
        }
    },
    //Talvez passar todas as propriedades do pai para cá pq daí não tenho de ir em busca da lista de novo ****************************
    
    // methods: {
    //    async getList() {
    //         const itensJson = await(await fetch('../src/db/itensList.json')).json();

    //         for(let i=0; i<itensJson.data.products.length; i++) {
    //                 if(selectedItem === itensJson.data.products[i]) {
    //                     this.number = i;
    //                     this.name = itensJson.data.products[i];
    //                     this.price = itensJson.data.prices[i];
    //                 };
    //             };

    //         return this.number, this.name, this.price
    //     }
    // },
    // created() {
    //     this.getList();
    // }
})
</script>

<style scoped>
#payment-voucher{
    border: solid 5px #000;
    height: 60vh;
}
</style>