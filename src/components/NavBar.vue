<template>
        <v-toolbar>
            <v-toolbar-items>
                <router-link to="/" id="icon">
                    <v-icon color="#000" size="large">mdi-home</v-icon>
                </router-link>
            </v-toolbar-items>
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
    }
})
</script>

<style scoped>
    #icon {
        align-self: center;
        margin-left: 75%;
    }
    #title {
        text-align: center;
    }
</style>