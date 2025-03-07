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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
            <h2 style="color: #333; text-align: center;">${title}</h2>
            <ul style="list-style: none; padding: 0;">
                ${imoveis.map(imovel => 
                    `<li style="background: #fff; padding: 15px; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <strong style="font-size: 16px; color: #007BFF;">${imovel.title}</strong><br>
                        <span style="color: #555;">Preço: <strong>${imovel.price}</strong></span><br>
                        <a href="${imovel.link}" style="color: #007BFF; word-break: break-all;">${imovel.link}</a>
                        ${imovel.image ? `<br><img src="${imovel.image}" alt="Imagem do imóvel" style="max-width: 100%; border-radius: 5px; margin-top: 10px;">` : ''}
                    </li>`
                ).join("")}
            </ul>
        </div>
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
