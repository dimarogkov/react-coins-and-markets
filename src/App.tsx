import { useEffect, useMemo, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { langs } from '@uiw/codemirror-extensions-langs';

import { LuChevronDown, LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { code } from './code';
import cn from 'classnames';

const API_URL = 'https://api.coingecko.com/api/v3/coins/markets';
const TOTAL_PAGE_COUNT = 10000;

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
    const [isMount, setIsMount] = useState(false);
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

        setIsMount(true);
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
        <section className='relative w-full max-w-screen-2xl text-left text-sm tracking-wide p-5 md:p-6 lg:p-8 m-auto'>
            <h1 className='w-full font-medium text-2xl mb-6 last:mb-0'>Coins & Markets</h1>

            <div className='w-full'>
                <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 w-full mb-6 last:mb-0'>
                    <div className='relative flex items-center h-10 cursor-pointer'>
                        <select
                            value={currentPriceValue}
                            onChange={({ target }) => setCurrentPriceValue(target.value)}
                            className='w-full h-full px-3 pr-11 rounded-md border cursor-pointer outline-none appearance-none border-gray focus:border-black transition-all duration-300'
                        >
                            <option value='usd'>USD</option>
                            <option value='eur'>EUR</option>
                        </select>

                        <LuChevronDown className='absolute right-3 w-5 h-5 text-gray' />
                    </div>

                    <div className='relative flex items-center h-10 cursor-pointer'>
                        <select
                            value={orderValue}
                            onChange={({ target }) => setOrderValue(target.value)}
                            className='w-full h-full px-3 pr-11 rounded-md border cursor-pointer outline-none appearance-none border-gray focus:border-black transition-all duration-300'
                        >
                            <option value='market_cap_desc'>Market cap descending</option>
                            <option value='market_cap_asc'>Market cap ascending</option>
                        </select>

                        <LuChevronDown className='absolute right-3 w-5 h-5 text-gray' />
                    </div>
                </div>

                <div className='relative w-full min-h-80 mb-6 last:mb-0'>
                    {isLoading && (
                        <div className='absolute z-10 top-0 left-0 flex items-center justify-center w-full h-full bg-light/65'>
                            <svg
                                aria-hidden='true'
                                className='inline w-10 h-10 text-gray animate-spin fill-blue'
                                viewBox='0 0 100 101'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                                    fill='currentColor'
                                />
                                <path
                                    d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                                    fill='currentFill'
                                />
                            </svg>
                        </div>
                    )}

                    {isMount && (
                        <div className='w-full overflow-x-auto mb-6 last:mb-0'>
                            <table className='relative table-fixed w-full min-w-[800px] border border-collapse break-all border-gray'>
                                <thead className='bg-light'>
                                    <tr>
                                        <th className='border border-gray p-3'>Name</th>
                                        <th className='border border-gray p-3'>Current Price</th>
                                        <th className='border border-gray p-3'>Circulating Supply</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {coins.map(({ id, name, image, current_price, circulating_supply }) => (
                                        <tr className='transition-colors duration-300 hover:bg-light' key={id}>
                                            <td className='border border-gray p-3'>
                                                <div className='flex items-center gap-3 w-full'>
                                                    <div className='relative w-8 h-8 rounded-full overflow-hidden'>
                                                        <img
                                                            src={image}
                                                            alt={name}
                                                            className='absolute top-0 left-0 w-full h-full object-cover object-center'
                                                        />
                                                    </div>

                                                    <span>{name}</span>
                                                </div>
                                            </td>
                                            <td className='border border-gray p-3'>
                                                {current_price} {currentPriceValue}
                                            </td>
                                            <td className='border border-gray p-3'>{circulating_supply}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className='flex items-center justify-end flex-col-reverse sm:flex-row gap-5 sm:gap-6'>
                    <ul className='flex gap-2'>
                        <li
                            className={cn(
                                'flex items-center justify-center w-8 h-8 rounded-md border border-gray transition-colors duration-300 hover:border-blue hover:text-blue',
                                {
                                    'opacity-35 pointer-events-none': currentPage === 1,
                                    'cursor-pointer': currentPage !== 1,
                                }
                            )}
                            onClick={getPreviousPage}
                        >
                            <LuChevronLeft />
                        </li>

                        {pageNumbers.map((pageNumber) => (
                            <li
                                key={pageNumber}
                                onClick={() => setCurrentPage(pageNumber)}
                                className={cn(
                                    'flex items-center justify-center w-8 h-8 rounded-md border transition-colors duration-300 hover:border-blue hover:text-blue',
                                    {
                                        'border-blue bg-blue text-white pointer-events-none':
                                            pageNumber === currentPage,
                                        'border-gray cursor-pointer': pageNumber !== currentPage,
                                    }
                                )}
                            >
                                {pageNumber}
                            </li>
                        ))}

                        <li
                            className={cn(
                                'flex items-center justify-center w-8 h-8 rounded-md border border-gray transition-colors duration-300 hover:border-blue hover:text-blue',
                                {
                                    'opacity-35 pointer-events-none': currentPage === TOTAL_PAGE_COUNT,
                                    'cursor-pointer': currentPage !== TOTAL_PAGE_COUNT,
                                }
                            )}
                            onClick={getNextPage}
                        >
                            <LuChevronRight />
                        </li>
                    </ul>

                    <div className='relative flex items-center w-full sm:w-fit h-10 cursor-pointer'>
                        <select
                            value={perPageValue}
                            onChange={({ target }) => setPerPageValue(+target.value)}
                            className='w-full h-full px-3 pr-11 rounded-md border cursor-pointer outline-none appearance-none border-gray focus:border-black transition-all duration-300'
                        >
                            <option value='5'>5 / page</option>
                            <option value='10'>10 / page</option>
                            <option value='20'>20 / page</option>
                            <option value='50'>50 / page</option>
                            <option value='100'>100 / page</option>
                        </select>

                        <LuChevronDown className='absolute right-3 w-5 h-5 text-gray' />
                    </div>
                </div>
            </div>

            <CodeMirror
                theme='light'
                value={`// App.tsx\n${code}`}
                style={{ marginTop: '20px' }}
                extensions={[langs.tsx()]}
                contentEditable
                spellCheck={false}
                autoCapitalize='off'
                autoCorrect='off'
                translate='no'
                maxHeight='1000px'
            />
        </section>
    );
};
