<template>
        <v-toolbar>
            <v-btn @click="disableAcess">
            <v-toolbar-items class="align-center">
                <router-link to="/" id="icon">
                        <v-icon color="#000" size="x-large">mdi-home</v-icon>
                    </router-link>
                </v-toolbar-items>
            </v-btn>
            <v-toolbar-title id="title">{{ title }}</v-toolbar-title>
        </v-toolbar>
</template>

<script>
import {defineComponent} from 'vue';

export default defineComponent({
    name: 'NavBar',
    props: {
        title: {
            type: String,
            required: true
        }
    },
    methods: {
        disableAcess() {
            localStorage.setItem("authToken", false);
        }
    }
})
</script>

<style scoped></style>