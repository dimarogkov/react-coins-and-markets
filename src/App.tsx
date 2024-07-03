import { useEffect, useState } from 'react';

const API_URL = 'https://api.coingecko.com/api/v3/coins/markets';

interface Coin {
    id: string;
    name: string;
    image: string;
    current_price: string;
    circulating_supply: string;
}

const getCoins = async (coinsParams: string) => {
    const res = await fetch(`${API_URL}?${coinsParams}&sparkline=false`);

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return res.json();
};

export const App = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [coins, setCoins] = useState<Coin[]>([]);
    const [currentPriceValue, setCurrentPriceValue] = useState('usd');
    const [orderValue, setOrderValue] = useState('market_cap_desc');
    const [perPageValue, setPerPageValue] = useState('10');

    useEffect(() => {
        setIsLoading(true);

        getCoins(`vs_currency=${currentPriceValue}&order=${orderValue}&per_page=${perPageValue}&page=1`)
            .then(setCoins)
            .finally(() => setIsLoading(false));
    }, [currentPriceValue, orderValue, perPageValue]);

    return (
        <section>
            <h1>Coins & Markets</h1>

            {!isLoading ? (
                <>
                    <div>
                        <select value={currentPriceValue} onChange={({ target }) => setCurrentPriceValue(target.value)}>
                            <option value='usd'>USD</option>
                            <option value='eur'>EUR</option>
                        </select>

                        <select value={orderValue} onChange={({ target }) => setOrderValue(target.value)}>
                            <option value='market_cap_desc'>Market cap descending</option>
                            <option value='market_cap_asc'>Market cap ascending</option>
                        </select>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Current Price</th>
                                <th>Circulating Supply</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coins.map(({ id, name, current_price, circulating_supply }) => (
                                <tr key={id}>
                                    <td>{name}</td>
                                    <td>
                                        {current_price} {currentPriceValue}
                                    </td>
                                    <td>{circulating_supply}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div>
                        <select value={perPageValue} onChange={({ target }) => setPerPageValue(target.value)}>
                            <option value='5'>5 / page</option>
                            <option value='10'>10 / page</option>
                            <option value='20'>20 / page</option>
                            <option value='50'>50 / page</option>
                            <option value='100'>100 / page</option>
                        </select>
                    </div>
                </>
            ) : (
                <div>
                    <span>Loading...</span>
                </div>
            )}
        </section>
    );
};
