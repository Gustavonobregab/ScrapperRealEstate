import puppeteer from "puppeteer";

const BASE_URL = "https://www.olx.com.br/estado-pb/paraiba/joao-pessoa";

/**
 * Função principal para scraping.
 */
const scrapeOlx = async (cliente = null) => {
  console.log("🕵️ Scraping iniciado...");

  const searchUrl = generateSearchUrl(cliente);
  console.log("🔍 URL base:", searchUrl);

  const browser = await puppeteer.launch({
    // 🧪 MODO TESTE (navegador visível):
    headless: false,

    // ✅ MODO PRODUÇÃO (navegador invisível, ideal para servidores):
    // headless: 'new', // <== descomente esta linha para produção
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
  );

  const allResults = {};

  try {
    await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 120000 });
    console.log("🌐 Página carregada com sucesso.");

    await handleCookiePopup(page);

    for (const bairro of cliente.bairros) {
      const results = await filterAndExtract(page, bairro);
      if (results.length) {
        allResults[bairro] = results;
      } else {
        console.log(`🚫 Nenhum imóvel encontrado em ${bairro}`);
      }
    }

    return allResults;
  } catch (error) {
    console.error("❌ Erro durante o scraping:", error);
    return {};
  } finally {
    await browser.close();
  }
};

/**
 * Gera a URL de busca com os filtros aplicados.
 */
const generateSearchUrl = (cliente) => {
  const urlParams = new URLSearchParams({ q: "apartamento", sf: "1" });

  if (cliente?.valorMin) urlParams.append("ps", cliente.valorMin);
  if (cliente?.valorMax) urlParams.append("pe", cliente.valorMax);

  return `${BASE_URL}?${urlParams.toString()}`;
};

/**
 * Lida com o popup de cookies caso apareça.
 */
const handleCookiePopup = async (page) => {
  const popupSelector = ".adopt-c-deHaIO";
  const acceptBtnSelector = "#adopt-accept-all-button";
  const rejectBtnSelector = "#adopt-reject-all-button";

  const popup = await page.$(popupSelector);
  if (popup) {
    console.log("🍪 Popup de cookies detectado.");

    const acceptButton = await page.$(acceptBtnSelector);
    const rejectButton = await page.$(rejectBtnSelector);

    if (acceptButton) {
      await acceptButton.click();
      console.log("✅ Popup fechado clicando em 'Aceitar'.");
    } else if (rejectButton) {
      await rejectButton.click();
      console.log("✅ Popup fechado clicando em 'Rechazar'.");
    }
  }
};

/**
 * Filtra por bairro e extrai os imóveis.
 */
const filterAndExtract = async (page, bairro) => {
  console.log(`🔎 Buscando imóveis em: ${bairro}`);

  try {
    await clickLocalizacao(page);

    const inputSelector = "input#ds-inputchips-element-58-input";
    await page.waitForSelector(inputSelector, { visible: true });

    await page.evaluate((selector) => {
      const input = document.querySelector(selector);
      if (input) input.value = "";
    }, inputSelector);

    await page.type(inputSelector, bairro, { delay: 100 });

    await new Promise(resolve => setTimeout(resolve, 3000)); 

    const listaSelector = "li.sc-3bb93d69-0";
    await page.waitForSelector(listaSelector, { timeout: 5000 });

    const primeiroItem = await page.$("li.sc-3bb93d69-0 a");
    if (primeiroItem) {
      await primeiroItem.click();
      console.log(`✅ Bairro "${bairro}" selecionado.`);
    } else {
      console.log(`🚫 Nenhum resultado para "${bairro}".`);
      return [];
    }

    await new Promise(resolve => setTimeout(resolve, 5000));

    return await extractListings(page);
  } catch (error) {
    console.error(`❌ Erro ao processar bairro "${bairro}":`, error);
    return [];
  }
};

/**
 * Tenta abrir o seletor de localização.
 */
const clickLocalizacao = async (page) => {
  const métodos = [
    async () => {
      await page.waitForSelector("div.sc-4018a969-0.bQWLjN", { visible: true, timeout: 2000 });
      await page.click("div.sc-4018a969-0.bQWLjN");
      return true;
    },
    async () => {
      const [el] = await page.$x("//div[contains(@class, 'sc-4018a969-0') and .//span[text()='João Pessoa']]");
      if (el) {
        await el.click();
        return true;
      }
      throw new Error("Elemento não encontrado via XPath");
    },
    async () => {
      const el = await page.$("div.sc-4018a969-0 span[data-ds-component='DS-Text']");
      if (el) {
        await (await el.getProperty('parentElement')).click();
        return true;
      }
      throw new Error("Elemento não encontrado via atributo data-ds-component");
    }
  ];

  for (const metodo of métodos) {
    try {
      await metodo();
      return true;
    } catch (_) {}
  }

  throw new Error("Nenhum dos métodos de clique na localização funcionou.");
};

/**
 * Extrai os imóveis da página.
 */
const extractListings = async (page) => {
  try {
    await page.waitForSelector("#main-content section a", { timeout: 20000 });

    return await page.evaluate(() =>
      [...document.querySelectorAll("#main-content section")]
        .slice(0, 6)
        .map((element) => ({
          title: element.querySelector("a.olx-ad-card__title-link h2")?.innerText.trim() || "Sem título",
          price: element.querySelector("span")?.innerText.trim() || "Sem preço",
          link: element.querySelector("a.olx-ad-card__title-link")?.href || "#",
        }))
    );
  } catch (error) {
    console.error("❌ Erro ao extrair imóveis:", error);
    return [];
  }
};

export default scrapeOlx;
