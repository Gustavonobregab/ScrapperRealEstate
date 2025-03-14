import puppeteer from "puppeteer";

const scrapeOlxTest = async (cliente = null) => {
  console.log("🕵️ Scraping iniciado...");

  let baseUrl = "https://www.olx.com.br/estado-pb/paraiba/joao-pessoa";
  const urlParams = new URLSearchParams({ q: "apartamento" });

  urlParams.append("sf", "1"); // Imóveis recentes

  if (cliente) {
    if (cliente.valorMin) urlParams.append("ps", cliente.valorMin);
    if (cliente.valorMax) urlParams.append("pe", cliente.valorMax);
  }

  baseUrl = `${baseUrl}?${urlParams.toString()}`;
  console.log("🔍 URL gerada:", baseUrl);

  const browser = await puppeteer.launch({
    headless: false, // Mantenha visível para testar
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
  );

  try {
    await page.goto(baseUrl, { waitUntil: "networkidle2", timeout: 120000 });
    console.log("🌐 Página carregada com sucesso.");

    // 🛑 Detecta e fecha o popup de cookies antes de continuar
    try {
      const popupSelector = ".adopt-c-deHaIO"; // Classe do popup
      const acceptBtnSelector = "#adopt-accept-all-button"; // Botão "Aceitar"
      const rejectBtnSelector = "#adopt-reject-all-button"; // Botão "Rechazar"

      if (await page.$(popupSelector)) {
        console.log("🍪 Popup de cookies detectado.");

        if (await page.$(acceptBtnSelector)) {
          await page.click(acceptBtnSelector);
          console.log("✅ Popup fechado clicando em 'Aceitar'.");
        } else if (await page.$(rejectBtnSelector)) {
          await page.click(rejectBtnSelector);
          console.log("✅ Popup fechado clicando em 'Rechazar'.");
        }
      }
    } catch (error) {
      console.log("✅ Nenhum popup de cookies detectado.");
    }

    if (cliente?.bairros && cliente.bairros.length > 0) {
        console.log(`🎯 Aplicando filtros para os bairros: ${cliente.bairros.join(", ")}`);
      
        for (const bairro of cliente.bairros) {
          console.log(`🔎 Tentando filtrar pelo bairro: ${bairro}`);
      
          // 🛠️ Pequeno delay para evitar erros
          await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 2000)));
      
          // Garante que o input está visível
          await page.waitForSelector("#oraculo-62-input", { visible: true, timeout: 30000 });
          console.log("📝 Campo de busca de bairro encontrado.");
      
          // Clica no input para ativá-lo
          await page.click("#oraculo-62-input");
          await page.click("#oraculo-62-input"); // Segundo clique para garantir foco
      
          // Limpa o campo antes de digitar
          await page.evaluate(() => {
            document.querySelector("#oraculo-62-input").value = "";
          });
      
          // Digita o bairro no campo de busca
          await page.type("#oraculo-62-input", bairro, { delay: 100 });
          console.log(`⌨️ Digitado: ${bairro}`);

    //       console.log("⏸️ **PAUSA** - Inspecione as opções no navegador (30s)...");
    //    await gitpage.evaluate(() => new Promise((resolve) => setTimeout(resolve, 30000)));
      
            await page.waitForSelector("#oraculo-62-autocomplete-list .exen0V a", { timeout: 5000 });
            console.log("📜 Sugestões de autocomplete encontradas.");

            // Clica na primeira sugestão da lista
            await page.click("#oraculo-62-autocomplete-list .exen0V a");
            console.log(`✅ Bairro "${bairro}" selecionado.`);

        }}

    // Aguarda imóveis aparecerem
    await page.waitForSelector("#main-content section a", { timeout: 20000 });
    const results = await page.evaluate(() => {
      return [...document.querySelectorAll("#main-content section")]
        .slice(0, 6)
        .map((element) => {
          const linkElement = element.querySelector("a.olx-ad-card__title-link");
          return {
            title: linkElement?.querySelector("h2")?.innerText.trim() || "Sem título",
            price: element.querySelector("span")?.innerText.trim() || "Sem preço",
            link: linkElement?.href || "#",
          };
        });
    });

    return results;
  } catch (error) {
    console.error("❌ Erro durante o scraping:", error);
    return [];
  } finally {
    await browser.close();
  }
};

export default scrapeOlxTest;
