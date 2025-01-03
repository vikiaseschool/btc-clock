const API_URL_BTC = "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1";
const API_URL_ETH = "https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=1";

const currencyRates = {
    usd: 1,
    eur: 0.98,
    czk: 23.5
};

let currentCrypto = "btc";

async function fetchCryptoPrice(crypto = 'btc', currency = 'usd') {
    let apiUrl = (crypto === 'btc') ? API_URL_BTC : API_URL_ETH;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const currentPriceUSD = data.prices[data.prices.length - 1][1];
        const price24hAgoUSD = data.prices[0][1];

        const changePercent = ((currentPriceUSD - price24hAgoUSD) / price24hAgoUSD) * 100;

        const formatter = new Intl.NumberFormat('cs-CZ');
        const currentPrice = currentPriceUSD * currencyRates[currency];
        const formattedPrice = formatter.format(currentPrice.toFixed(0));

        let arrowClass = "";
        let arrowDirection = "";
        if (changePercent > 0) {
            arrowClass = "green";
            arrowDirection = "&#x2191;";
        } else if (changePercent < 0) {
            arrowClass = "red";
            arrowDirection = "&#x2193;";
        }

        document.getElementById("price").innerText = `${formattedPrice} ${currency.toUpperCase()}`;
        const changeElement = document.getElementById("changePercent");
        changeElement.innerText = `24H CHANGE: ${changePercent.toFixed(2)}%`;
        changeElement.classList.add(arrowClass);

        const arrowElement = document.getElementById("changeArrow");
        arrowElement.innerHTML = arrowDirection;
        arrowElement.classList.add(arrowClass);
    } catch (error) {
        console.error("Error fetching crypto price:", error);
    }
}

function updateCurrentTime() {
    const now = new Date();
    const options = {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    const formattedTime = now.toLocaleString('en-US', options);
    document.getElementById('currentTime').innerText = `${formattedTime}`;
}

setInterval(updateCurrentTime, 1000);

document.getElementById("currencySelector").addEventListener("change", (event) => {
    fetchCryptoPrice(currentCrypto, event.target.value);
});

document.getElementById("cryptoSelector").addEventListener("change", (event) => {
    currentCrypto = event.target.value;
    const cryptoName = (currentCrypto === 'btc') ? "Bitcoin Clock" : "Ethereum Clock";
    document.getElementById("cryptoName").innerText = cryptoName;
    fetchCryptoPrice(currentCrypto, document.getElementById("currencySelector").value);
});

fetchCryptoPrice(currentCrypto);
updateCurrentTime();
