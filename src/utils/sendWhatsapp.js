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

const sendWhatsApp = async (title, links) => {
    try {
        if (links.length === 0) {
            console.log("❌ Nenhum novo imóvel para enviar.");
            return;
        }

        // Monta a mensagem com título e links
        let message = `📢 ${title}\n\n` + links.map(link => `🔗 ${link}`).join("\n");

        const response = await client.messages.create({
            from: TWILIO_WHATSAPP,
            to: `whatsapp:${TEST_PHONE_NUMBER}`,
            body: message,
        });
        
        console.log(`📨 Mensagem enviada: ${response.sid}`);
    } catch (error) {
        console.error("❌ Erro ao enviar mensagem:", error.message || error);
    }
};

export default sendWhatsApp;