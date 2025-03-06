import SibApiV3Sdk from 'sib-api-v3-sdk';
import dotenv from 'dotenv';

dotenv.config();

const { SIB_API_KEY, DESTINATION_EMAIL } = process.env;

if (!SIB_API_KEY || !DESTINATION_EMAIL) {
    console.error("❌ Erro: Verifique as variáveis de ambiente no arquivo .env");
    process.exit(1);
}

// Configurando a API do Brevo com a chave
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = SIB_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

// Função para enviar e-mail
export const sendEmail = async (title, links) => {
    try {
        if (links.length === 0) {
            console.log("❌ Nenhum link para enviar.");
            return;
        }

        const emailContent = `
            <h2>${title}</h2>
            <ul>${links.map(link => `<li><a href="${link}">${link}</a></li>`).join("")}</ul>
        `;

        sendSmtpEmail.sender = { email: 'crudnator@gmail.com', name: 'Notificações' };
        sendSmtpEmail.to = [{ email: DESTINATION_EMAIL }];
        sendSmtpEmail.subject = title;
        sendSmtpEmail.htmlContent = emailContent;

        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`📧 E-mail enviado: ${response.messageId}`);
    } catch (error) {
        console.error("❌ Erro ao enviar e-mail:", error.message || error);
    }
};

