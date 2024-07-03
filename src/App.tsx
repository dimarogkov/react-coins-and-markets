import { useEffect, useMemo, useState } from 'react';

const API_URL = 'https://api.coingecko.com/api/v3/coins/markets';
// const TOTAL_PAGE_COUNT = 10000;
const TOTAL_PAGE_COUNT = 10;

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

const getNumbers = (from: number, to: number) => {
    const numbers = [];

    for (let n = from; n <= to; n += 1) {
        numbers.push(n);
    }

    return numbers;
};

export const App = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [coins, setCoins] = useState<Coin[]>([]);
    const [currentPriceValue, setCurrentPriceValue] = useState('usd');
    const [orderValue, setOrderValue] = useState('market_cap_desc');
    const [perPageValue, setPerPageValue] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const [startValue, setStartValue] = useState(1);
    const [endValue, setEndValue] = useState(5);

    useEffect(() => {
        const coinsParams = `vs_currency=${currentPriceValue}&order=${orderValue}&per_page=${perPageValue.toString()}&page=${currentPage.toString()}`;

        setIsLoading(true);

        getCoins(coinsParams)
            .then(setCoins)
            .finally(() => setIsLoading(false));
    }, [currentPage, currentPriceValue, orderValue, perPageValue]);

    const getPreviousPage = () => {
        setCurrentPage((prevState) => (prevState !== 1 ? prevState - 1 : prevState));
    };

    const getNextPage = () => {
        setCurrentPage((prevState) => {
            return prevState !== Math.ceil(TOTAL_PAGE_COUNT / perPageValue) ? prevState + 1 : prevState;
        });
    };

    const pageNumbers = useMemo(() => {
        const firstThree = [1, 2, 3];
        const lastThree = [TOTAL_PAGE_COUNT - 2, TOTAL_PAGE_COUNT - 1, TOTAL_PAGE_COUNT];

        switch (true) {
            case firstThree.includes(currentPage):
                setStartValue(1);
                setEndValue(5);
                break;
            case lastThree.includes(currentPage):
                setStartValue(TOTAL_PAGE_COUNT - 4);
                setEndValue(TOTAL_PAGE_COUNT);
                break;
            default:
                setStartValue(currentPage - 2);
                setEndValue(currentPage + 2);
        }

        return getNumbers(startValue, endValue);
    }, [currentPage, endValue, startValue]);

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
                        <ul>
                            <li className={currentPage === 1 ? 'disabled' : ''} onClick={getPreviousPage}>
                                {'<'}
                            </li>

                            {pageNumbers.map((pageNumber) => (
                                <li
                                    className={pageNumber === currentPage ? 'active' : ''}
                                    onClick={() => setCurrentPage(pageNumber)}
                                    key={pageNumber}
                                >
                                    {pageNumber}
                                </li>
                            ))}

                            <li className={currentPage === TOTAL_PAGE_COUNT ? 'disabled' : ''} onClick={getNextPage}>
                                {'>'}
                            </li>
                        </ul>

                        <select value={perPageValue} onChange={({ target }) => setPerPageValue(+target.value)}>
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
