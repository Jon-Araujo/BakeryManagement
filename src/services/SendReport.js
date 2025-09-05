import emailjs from 'emailjs-com';

const sendEmail = async (docName, value, finalValue, msg) => {
    await emailjs.send(
            "service_uj3f3xt", 
            "template_aa0qk5r", 
            {
                to_name: "Jonathan",
                from_name: "Charlotinha",
                message: `Caixa fechado!\n\nEmitido o ${docName}.\n\nCaixa fechado com o valor total de: ${value}\nRendimento de: ${finalValue}\n\n\n${msg}`,
                reply_to: "silvajonathan76@gmail.com"
            },
            "G7jpQl6p7bGL-gIrX"
        ).then(response => {
            console.log("E-mail enviado!", response);
        }).catch(error => {
            console.error("Erro ao enviar e-mail:", error);
        });
    

};


export default sendEmail
