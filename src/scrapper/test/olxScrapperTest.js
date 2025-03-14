import puppeteer from "puppeteer";

const scrapeOlxTest = async (cliente = null) => {
  console.log("🕵️ Scraping iniciado...");

  let baseUrl = "https://www.olx.com.br/estado-pb/paraiba/joao-pessoa";
  const urlParams = new URLSearchParams({ q: "apartamento" });

  
   urlParams.append("sf", "1");  //imóveis recentes

  if (cliente) {
    if (cliente.valorMin) urlParams.append("ps", cliente.valorMin);
    if (cliente.valorMax) urlParams.append("pe", cliente.valorMax);
  }

  // Montando a URL final
  baseUrl = `${baseUrl}?${urlParams.toString()}`;

  console.log("🔍 URL gerada:", baseUrl);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
  );
  
  try {
    await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 120000 });
    console.log("🌐 Página carregada com sucesso.");

/*    if (cliente?.bairros && cliente.bairros.length > 0) {
      console.log(`🎯 Aplicando filtros para os bairros: ${cliente.bairros.join(", ")}`);

      for (const bairro of cliente.bairros) {
        console.log(`🔎 Tentando filtrar pelo bairro: ${bairro}`);

        // Aguardar o campo de busca do bairro e clicar
        await page.waitForSelector('[placeholder="Digite um bairro ou cidade"]', { timeout: 30000})
        console.log("📝 Campo de busca de bairro encontrado.");

        // Limpar o input antes de digitar
        await page.evaluate(() => {
          document.querySelector("#location-autocomplete-desktop-input").value = "";
        });

        // Digitar o nome do bairro
        console.log(`⏳ Digitando o nome do bairro: ${bairro}`);
        await page.type("#location-autocomplete-desktop-input", bairro, { delay: 100 });

        // Aguardar lista de sugestões aparecer
        console.log("🔍 Aguardando sugestões de bairro...");
        await page.waitForFunction(
          () => document.querySelector('[aria-controls="location-autocomplete-desktop-autocomplete-list"]').getAttribute("aria-expanded") === "true",
          { timeout: 10000 }
        );
        console.log("✔️ Sugestões carregadas.");

        // Esperar um pouco para garantir que as sugestões carreguem
        await page.waitForTimeout(1500);

        // Selecionar a primeira sugestão
        console.log("🔎 Selecionando a primeira sugestão...");
        const suggestions = await page.$$('#location-autocomplete-desktop-autocomplete-list li');
        if (suggestions.length > 0) {
          await suggestions[0].click();
          console.log(`✅ Bairro "${bairro}" aplicado com sucesso!`);
        } else {
          console.log(`⚠️ Nenhuma sugestão encontrada para "${bairro}".`);
          continue; // Pula para o próximo bairro, se houver
        }

        // Aplicar o filtro (esperar botão aparecer)
        console.log("🔘 Aplicando o filtro de bairro...");
        await page.waitForSelector('button.sc-1fj0zlm-0.sc-1u27bza-2.gObUhg', { timeout: 10000 });
        await page.click('button.sc-1fj0zlm-0.sc-1u27bza-2.gObUhg');

        // Esperar a página recarregar
        console.log("⏳ Esperando a página recarregar após aplicar o filtro...");
        await page.waitForNavigation({ waitUntil: "domcontentloaded" }); 
      } 
    } */

    await page.waitForSelector("#main-content section a", { timeout: 20000 });
    const results = await page.evaluate(() => {
      return [...document.querySelectorAll("#main-content section")]
        .slice(0, 6) // 🚀 Pegando apenas os 6 primeiros imóveis
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
