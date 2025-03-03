import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "seuemail@gmail.com",
    pass: "suasenha",
  },
});

const sendEmail = async (to, subject, imoveis) => {
  const htmlContent = imoveis
    .map(imovel => `<p><a href="${imovel.link}">${imovel.title} - ${imovel.price}</a></p>`)
    .join("");

  await transporter.sendMail({
    from: "seuemail@gmail.com",
    to,
    subject,
    html: `<h2>Novos imóveis encontrados:</h2>${htmlContent}`,
  });

  console.log(`📨 E-mail enviado para ${to}`);
};

export default sendEmail;
