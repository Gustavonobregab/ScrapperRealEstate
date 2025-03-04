import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const { TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP } = process.env;

if (!TWILIO_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP) {
    console.error("❌ Erro: Verifique se as variáveis de ambiente estão configuradas corretamente.");
    process.exit(1);
}

const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

const sendWhatsApp = async (to, message) => {
    if (!to.startsWith("+")) {
        console.error("❌ Erro: O número de telefone deve incluir o código do país (ex: +55 para Brasil).");
        return;
    }

    try {
        const response = await client.messages.create({
            from: TWILIO_WHATSAPP, // Número do Twilio Sandbox
            to: `whatsapp:${to}`, // Número de destino
            body: message,
        });
        console.log(`📨 Mensagem enviada para ${to}: ${response.sid}`);
    } catch (error) {
        console.error("❌ Erro ao enviar mensagem:", error.message || error);
    }
};

// Substitua pelo seu número do WhatsApp cadastrado no Twilio Sandbox
sendWhatsApp("+5583988146652", "Olá! Testando envio pelo Twilio.");
