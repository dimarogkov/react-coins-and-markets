import { useEffect, useState } from 'react';

const API_URL = 'https://api.coingecko.com/api/v3/coins/markets';

interface Coin {
    id: string;
    name: string;
    image: string;
    current_price: string;
    circulating_supply: string;
}

const getCoins = async () => {
    const res = await fetch(`${API_URL}?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false`);

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return res.json();
};

export const App = () => {
    const [coins, setCoins] = useState<Coin[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        getCoins()
            .then(setCoins)
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <section>
            <h1>Coins & Markets</h1>

            {!isLoading ? (
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
                                <td>{current_price}</td>
                                <td>{circulating_supply}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>
                    <span>Loading...</span>
                </div>
            )}
        </section>
    );
};
