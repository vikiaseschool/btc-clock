const API_URL = "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1";

async function fetchBitcoinPrice() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        const currentPriceUSD = data.prices[data.prices.length - 1][1];
        const price24hAgoUSD = data.prices[0][1];

        const changePercent = ((currentPriceUSD - price24hAgoUSD) / price24hAgoUSD) * 100;

        const formatter = new Intl.NumberFormat('cs-CZ');

        let arrowClass = "";
        let arrowDirection = "";
        if (changePercent > 0) {
            arrowClass = "green";
            arrowDirection = "&#x2191;";
        } else if (changePercent < 0) {
            arrowClass = "red";
            arrowDirection = "&#x2193;";
        }

        document.getElementById("priceUSD").innerText = `PRICE IN USD: ${formatter.format(currentPriceUSD.toFixed(0))}$`;
        document.getElementById("priceEUR").innerText = `PRICE IN EUR: ${formatter.format((currentPriceUSD * 0.98).toFixed(0))}€`;
        document.getElementById("priceCZK").innerText = `PRICE IN CZK: ${formatter.format((currentPriceUSD * 23.5).toFixed(0))}Kč`;

        const changeElement = document.getElementById("changePercent");
        changeElement.innerText = `24H CHANGE: ${changePercent.toFixed(2)}%`;
        changeElement.classList.add(arrowClass);

        const arrowElement = document.getElementById("changeArrow");
        arrowElement.innerHTML = arrowDirection;
        arrowElement.classList.add(arrowClass);
    } catch (error) {
        console.error("Error fetching Bitcoin price:", error);
    }
}

setInterval(fetchBitcoinPrice, 30000);

fetchBitcoinPrice();
