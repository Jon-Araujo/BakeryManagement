<template>
  <v-alert v-if="this.messageError === true" text="Senha incorreta, tente novamente!" type="error" title="Mensagem de Erro:"
  class="position-absolute w-100 h-25"></v-alert>
  <v-card
    class="py-8 px-6 text-center mx-auto my-auto"
    elevation="12"
    max-width="400"
    width="100%"
    :style="{ border: messageError? '5px solid #F44336' : 'none'}"
  >
    <h3 class="text-h6 mb-4">Verificação de Autorização de Acesso</h3>
    <div class="text-body-2">
      Insira aqui a senha de usuário válida para poder acessar a área restrita referente ao sistema de controle financeiro da empresa!
    </div>
    <v-sheet color="surface">
      <v-otp-input
      v-model="otp"
      type="password"
      variant="solo"
      focus-all
      error
      :loading="loading"
      ></v-otp-input>
    </v-sheet>
    <v-btn
      :disabled="otp.length < 6 || loading"
      class="my-4"
      color="purple"
      height="40"
      text="Verificar"
      variant="flat"
      width="70%"
      @click="verifyOTP()"
    ></v-btn>

    <div class="text-caption">
      Problemas para acessar? Talvez seja porque não era para você conseguir...
    </div>
  </v-card>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'VerifyAcessScreen',
    data: () => ({
      otp: '',
      messageError: false
    }),
    methods: {
      verifyOTP() {
        if(this.otp == 123456) {
          this.$router.push('/sales-control');
        } else {
          this.messageError = true;
        }
      }
    }
})
</script>