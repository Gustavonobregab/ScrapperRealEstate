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
        
                // Pequeno delay para evitar erros
                await new Promise(r => setTimeout(r, 2000));
        
                // Clica no campo de bairro para ativá-lo e abrir a aba de digitação
                await page.waitForSelector("div.sc-4018a969-0.jsjvMc", { visible: true });
                await page.click("div.sc-4018a969-0.jsjvMc");
                console.log("📝 Campo de busca de bairro ativado.");
        
                // Aguarda o input específico aparecer e foca nele
                const inputSelector = "input#ds-inputchips-element-58-input";
                await page.waitForSelector(inputSelector, { visible: true });
                await page.focus(inputSelector);
        
                // Limpa o campo antes de digitar
                await page.evaluate((selector) => {
                    document.querySelector(selector).value = "";
                }, inputSelector);
        
                // Digita o nome do bairro no campo de busca
                await page.type(inputSelector, bairro, { delay: 100 });
                console.log(`⌨️ Digitado: ${bairro}`);
        
                // Pausa para inspeção do autocomplete
                // console.log("⏸️ **PAUSA** - Inspecione o autocomplete (10s)...");
                // await new Promise(r => setTimeout(r, 30000));
                
                const listaSelector = "li.sc-3bb93d69-0";

                await page.waitForSelector(listaSelector, { timeout: 5000 });
                console.log("📜 Sugestões de autocomplete carregadas.");

                // Clica no primeiro link da lista de autocomplete
                const primeiroItemSelector = "li.sc-3bb93d69-0 a";
                const primeiroItem = await page.$(primeiroItemSelector);
                if (primeiroItem) {
                    await primeiroItem.click();
                    console.log(`✅ Primeiro bairro da lista selecionado.`);
                } else {
                    console.log(`🚫 Nenhum bairro encontrado na lista.`);
                }
            }
        
            }
         
    
    

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
