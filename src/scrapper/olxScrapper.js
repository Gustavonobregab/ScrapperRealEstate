import puppeteer from "puppeteer";

const scrapeOlx = async (cliente = null) => {
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

export default scrapeOlx;
