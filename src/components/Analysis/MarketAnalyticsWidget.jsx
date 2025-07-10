import React, { useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { Spin, Button, Card } from 'antd';
import { ReloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { marketSummary } from '../../api/apis';
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, YAxis } from 'recharts';
import { formatPrice } from '../../utils/formatter';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const advancesDeclinesBar = (numAdvances, numDeclines) => {
    const total = numAdvances + numDeclines;
    const advPct = total ? (numAdvances / total) * 100 : 50;
    const decPct = total ? (numDeclines / total) * 100 : 50;
    return (
        <div className='flex flex-col flex-1 mb-2'>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span className='text-green-600 font-semibold text-lg'>{numAdvances}</span>
                <span className='text-red-600 font-semibold text-lg'>{numDeclines}</span>
            </div>
            <div className='w-full mt-1'>
                <div className="flex h-2 rounded-lg overflow-hidden">
                    <div className='bg-green-600' style={{ width: `${advPct}%`, transition: 'width 0.3s' }} />
                    <div className='bg-red-600' style={{ width: `${decPct}%`, transition: 'width 0.3s' }} />
                </div>

            </div>
        </div>
    );
};

const scriptsList = (data, classes, title) => (
    <Card size="small" title={title} className={`mr-0 md:mr-4 flex flex-col flex-1 ${classes}`} classNames={{ body: 'flex-1 flex flex-col ' }}>
        <div className='flex flex-col flex-1'>
            {data.map(idx => (
                <div key={idx.scriptId} className='flex flex-1 items-center justify-between py-1 border-b border-neutral-700 last:border-none'>
                    <div className='text-sm md:text-base text-gray-300 font-semibold'>{idx.scriptId}</div>
                    <div className={`rounded-md p-1 flex md:flex-col items-center justify-center w-[130px] ${idx.change >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                        <div className='text-white mr-1 font-semibold text-sm'>{formatPrice(idx.price)}</div>
                        <div className='text-white text-xs'>
                            <span className='hidden md:inline'>{idx.change >= 0 ? '+' : ''}{formatPrice(idx.change)}</span><span> ({formatPrice(idx.changePct)}%)</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </Card>
);

const futuresList = (data, classes, title) => (
    <Card size="small" title={title} className={`mr-0 md:mr-4 ${classes}`}>
        <div className='flex flex-col flex-1'>
            {data.map(idx => (
                <div key={idx?.underlyingQuote?.scriptId} className='flex flex-1 flex-col items-center justify-between py-1 border-b border-neutral-700 last:border-none'>
                    <div className='text-base text-white font-semibold py-2'>{idx?.underlyingQuote?.scriptId}</div>
                    <div className='flex w-full'>
                        <div className={`p-1 flex flex-col flex-1 items-center justify-center ${idx?.underlyingQuote?.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            <div className='mr-1 font-semibold text-sm'>{formatPrice(idx?.underlyingQuote?.price)}</div>
                            <div className='text-xs'>
                                ({idx?.underlyingQuote?.change >= 0 ? '+' : ''}{formatPrice(idx?.underlyingQuote?.changePct)}%)
                            </div>
                        </div>
                        <div className={`p-1 flex flex-col flex-1 items-center justify-center text-fuchsia-600`}>
                            <div className='mr-1 font-semibold text-sm'>OI Change</div>
                            <div className='text-xs'>
                                ({idx?.oiChange >= 0 ? '+' : ''}{formatPrice((idx?.oiChange * 100) / idx?.oi || 0)}%)
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </Card>
);

const advancesDeclinesChart = (timestamps, advances, declines) => {
    const chartData = (timestamps || []).map((t, i) => ({
        time: new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        Advances: advances[i],
        Declines: declines[i],
    }));
    return (
        <div className='w-full flex-1 items-center justify-center'>
            <ResponsiveContainer width="100%" height={100}>
                <LineChart data={chartData} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="#282828" />
                    <XAxis dataKey="time" minTickGap={30} hide={true} />
                    <YAxis domain={[0, 'auto']} hide={true} />
                    <Tooltip />
                    <Line type="monotone" dataKey="Advances" stroke="#38c172" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Declines" stroke="#e3342f" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

const TopMoversCarousel = ({ data, title, titleClasses }) => {
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4.5,
        slidesToScroll: 2,
        arrows: true,
        responsive: [
            { breakpoint: 1600, settings: { slidesToShow: 4 } },
            { breakpoint: 1400, settings: { slidesToShow: 3.5 } },
            { breakpoint: 1200, settings: { slidesToShow: 3 } },
            { breakpoint: 1000, settings: { slidesToShow: 2.5 } },
            { breakpoint: 800, settings: { slidesToShow: 2 } },
            { breakpoint: 600, settings: { slidesToShow: 1.5, slidesToScroll: 1 } },
            { breakpoint: 400, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
    };
    return (
        <div className="mb-4">
            <div className={`font-semibold text-base mb-2 ml-2 ${titleClasses}`}>{title}</div>
            <Slider {...settings}>
                {data.map((item, idx) => (
                    <TopMoverCarouselCard key={item.scriptId || idx} {...item} />
                ))}
            </Slider>
        </div>
    );
};

// Carousel Card Template for Top Movers
const TopMoverCarouselCard = ({ scriptId, price, change, changePct }) => {
    const isPositive = change > 0;
    return (
        <div className="bg-black shadow-lg rounded-lg shadow flex flex-col mx-2 relative overflow-hidden">
            <div className='flex-1 flex content-center justify-center text-center text-lg text-neutral-200 p-2'>{scriptId}</div>
            <div className={`flex flex-col items-center justify-center flex-1 ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}>
                <div className='flex-1 flex flex-col p-2'>
                    <div className="font-semibold text-base text-gray-900 mb-1 text-center">{formatPrice(typeof price === 'object' ? price.parsedValue : price)}</div>
                    <div className={`text-sm font-semibold text-center `}>{isPositive ? '+' : ''}{formatPrice(typeof change === 'object' ? change.parsedValue : change)}
                        <span className="ml-1">({isPositive ? '+' : ''}{formatPrice(changePct)}%)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MarketAnalyticsWidget = forwardRef((props, ref) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const fetchMarketSummary = useCallback(async (isAuto = false) => {
        if (!isAuto) setLoading(true);
        if (!isAuto) setError(null);
        try {
            const res = await marketSummary();
            setData(res?.marketAnalysis || {});
            if (!isAuto) setError(null);
        } catch (err) {
            if (!isAuto) setError(err);
        } finally {
            if (!isAuto) setLoading(false);
        }
    }, []);

    useImperativeHandle(ref, () => ({
        refresh: () => fetchMarketSummary(false)
    }));

    useEffect(() => {
        fetchMarketSummary(false);
    }, [fetchMarketSummary]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchMarketSummary(true);
        }, 10000); // 10 seconds
        return () => clearInterval(intervalId);
    }, [fetchMarketSummary]);

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                <Spin size="large" />
                <div style={{ marginTop: 16, fontSize: 16, color: '#888' }}>Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
                <ExclamationCircleOutlined style={{ fontSize: 40, color: '#ff4d4f' }} />
                <div style={{ marginTop: 16, fontSize: 16, color: '#ff4d4f' }}>Could not load. Please try again</div>
                <Button type="primary" icon={<ReloadOutlined />} onClick={fetchMarketSummary} style={{ marginTop: 16 }}>
                    Refresh
                </Button>
            </div>
        );
    }

    const { numAdvances = 0, numDeclines = 0, advances = [], declines = [], timestamps = [], globalIndices = [], indices = [], heavyweights = [], topGainers = [], topLosers = [], longs = [], shorts = [], longUnwinds = [], shortCovers = [] } = data || {};

    return (
        <div style={{ width: '100%', maxWidth: 1400, margin: '0 auto', padding: 12 }}>
            {/* Top Section: Bar, Chart, Indices */}
            <div className='flex-col flex md:flex-row mb-4'>
                <div className='flex flex-col flex-1 mb-3 md:mb-0'>
                    {scriptsList(indices, '', 'Indices')}
                </div>
                <div className='flex flex-col flex-1 mb-3 md:mb-0'>
                    {scriptsList(heavyweights, '', 'Heavy Weights')}
                </div>
                <div className='flex flex-col w-full md:w-auto md:min-w-[300px] md:mr-2'>
                    <Card size="small" title="Market Breadth" className='flex flex-col mb-3 md:mb-0'>
                        {advancesDeclinesBar(numAdvances, numDeclines)}
                        {advancesDeclinesChart(timestamps, advances, declines)}
                    </Card>
                    {scriptsList(globalIndices, 'md:mt-2 md:flex-1 md:w-full', 'Global Indices')}
                </div>
            </div>
            {/* Top Gainers/Losers Carousels */}
            <div className="p-4 px-8">
                <div className="flex-1">
                    <TopMoversCarousel data={topGainers} title="Top Gainers" titleClasses="text-green-500" />
                </div>
                <div className="flex-1">
                    <TopMoversCarousel data={topLosers} title="Top Losers" titleClasses="text-red-500" />
                </div>
            </div>

            <div className="mb-2 text-lg font-semibold text-neutral-200">Futures Action</div>
            <div className='flex flex-col md:flex-row'>
                <div className='flex flex-col flex-1 mb-3'>
                    {futuresList(longs, '', 'Fresh Longs')}
                </div>
                <div className='flex flex-col flex-1 mb-3'>
                    {futuresList(shorts, '', 'Fresh Shorts')}
                </div>
                <div className='flex flex-col flex-1 mb-3'>
                    {futuresList(longUnwinds, '', 'Long Unwinding')}
                </div>
                <div className='flex flex-col flex-1 mb-3'>
                    {futuresList(shortCovers, '', 'Short Covering')}
                </div>
            </div>
        </div>
    );
});

export default MarketAnalyticsWidget; 