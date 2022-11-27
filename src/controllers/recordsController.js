const catchAsync = require('../utils/catchAsync');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const AppError = require('../utils/appError');

exports.aggr = catchAsync(async (req, res, next) => {
    const response = await fetch('https://reference.intellisense.io/test.dataprovider');
    const json = await response.json();

    const period = req.body.period;
    if (isNaN(period))
        return next(new AppError('Period must be a number!', 400));
    if (period < 0) 
        return next(new AppError('Period cannot be less than 0!', 400));

    const m660_3000 = json["660"]["3000"];
    const m660_3001 = json["660"]["3001"];
    const m660_3002 = json["660"]["3002"];
    const m660_3003 = json["660"]["3003"];
    const m660_3004 = json["660"]["3004"];
    const m660_3005 = json["660"]["3005"];
    const m660 = [m660_3000, m660_3001, m660_3002, m660_3003, m660_3004, m660_3005];
    const m660_result = [[], [], [], [], [], []];

    const time = json["660"]["time"];
    const time_result = [];

    let startLap = new Date(time[0]);
    let startIndex = 0;
    let i = 0;
    time_result.push(time[i]);

    while (i < time.length) {
        const endOfLap = addMinutes(startLap, period);

        if (new Date(time[i]) >= endOfLap) {
            for (let x = 0; x < m660.length; ++x) {
                const aggregated = aggre(m660[x], startIndex, i - 1);
                m660_result[x].push(aggregated);
            }
            time_result.push(time[i]);
            startIndex = i;
            startLap = endOfLap;
        }
        else {
            ++i;
        }
    }

    const result = {
        "660": {
            "3000": m660_result[0],
            "3001": m660_result[1],
            "3002": m660_result[2],
            "3003": m660_result[3],
            "3004": m660_result[4],
            "3005": m660_result[5],
            "time": time_result
        }
    };

    res.status(200).json(result);
});

const addMinutes = (date, minutes) => {
    return new Date(date.getTime() + minutes * 60000);
}

const aggre = (arr, startIndex, endIndex) => {
    let nonNulls = [];
    for (let i = startIndex; i <= endIndex; ++i) {
        if (arr[i])
            nonNulls.push(arr[i]);
    }

    if (nonNulls.length === 0)
        return null;

    let sum = 0;
    for (let i = 0; i < nonNulls.length; ++i) {
        sum += nonNulls[i];
    }
    return sum / nonNulls.length;
}