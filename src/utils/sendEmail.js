import SibApiV3Sdk from 'sib-api-v3-sdk';
import dotenv from 'dotenv';

dotenv.config();

const { SIB_API_KEY, DESTINATION_EMAIL_1, DESTINATION_EMAIL_2 } = process.env;

if (!SIB_API_KEY || !DESTINATION_EMAIL_1 || !DESTINATION_EMAIL_2) {
    console.error("❌ Erro: Verifique as variáveis de ambiente no arquivo .env");
    process.exit(1);
}

// Configurando a API do Brevo com a chave
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = SIB_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

// Função para enviar e-mail
export const sendEmail = async (title, imoveis) => {
    try {
        if (imoveis.length === 0) {
            console.log("❌ Nenhum link para enviar.");
            return;
        }

        // Montando o conteúdo do e-mail com título e links
        const emailContent = `
            <h2>${title}</h2>
            <ul>
                ${imoveis.map(imovel => 
                    `<li>
                        <strong>${imovel.title}</strong><br>
                        Preço: ${imovel.price}<br>
                        <a href="${imovel.link}">Ver Imóvel</a>
                    </li>`
                ).join("")}
            </ul>
        `;

        // Configurando o remetente, destinatários e conteúdo do e-mail
        sendSmtpEmail.sender = { email: 'crudnator@gmail.com', name: 'Notificações' };
        sendSmtpEmail.to = [
            { email: DESTINATION_EMAIL_1 },
            { email: DESTINATION_EMAIL_2 }
        ];
        sendSmtpEmail.subject = title;
        sendSmtpEmail.htmlContent = emailContent;

        // Enviando o e-mail
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`📧 E-mail enviado: ${response.messageId}`);
    } catch (error) {
        console.error("❌ Erro ao enviar e-mail:", error.message || error);
    }
};
