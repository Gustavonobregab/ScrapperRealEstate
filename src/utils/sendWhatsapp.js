import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const { TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP } = process.env;

if (!TWILIO_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP) {
    console.error("❌ Erro: Verifique se as variáveis de ambiente estão configuradas corretamente.");
    process.exit(1);
}

const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

// Sempre enviar para este número fixo
const TEST_PHONE_NUMBER = "+558388146652";

// SID do template pré-configurado no Twilio
const templateSid = "your-template-sid"; // Substitua pelo SID do seu template

// Função para enviar WhatsApp usando o template
const sendWhatsApp = async (title, links) => {
    try {
        if (links.length === 0) {
            console.log("❌ Nenhum novo imóvel para enviar.");
            return;
        }

        // Variáveis do template
        const contentVariables = {
            title: title,
            links: links.join("\n") // Unindo os links em uma string separada por novas linhas
        };

        // Enviar a mensagem usando o template SID e variáveis
        const response = await client.messages.create({
            from: TWILIO_WHATSAPP,
            to: `whatsapp:${TEST_PHONE_NUMBER}`,
            messagingServiceSid: 'your-messaging-service-sid', // O SID do seu serviço de mensagens
            contentSid: templateSid, // SID do template de conteúdo
            contentVariables: contentVariables // Variáveis do template
        });

        console.log(`📨 Mensagem enviada: ${response.sid}`);
    } catch (error) {
        console.error("❌ Erro ao enviar mensagem:", error.message || error);
    }
};

// Teste da função sendWhatsApp
const title = "Novos imóveis disponíveis!";
const links = [
    "https://example.com/imovel1",
    "https://example.com/imovel2",
    "https://example.com/imovel3"
];

// Chama a função para testar
sendWhatsApp(title, links);
