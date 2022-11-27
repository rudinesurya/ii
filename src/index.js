const express = require('express')
const bodyParser = require("body-parser");
const cors = require('cors')
const app = express()
const { PORT } = require('./config');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const StartServer = async () => {
    app.use(cors())
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    function addMinutes(date, minutes) {
        return new Date(date.getTime() + minutes * 60000);
    }

    function aggre(arr, startIndex, endIndex) {
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

    app.post('/', async (req, res) => {

        try {
            const response = await fetch('https://reference.intellisense.io/test.dataprovider');
            const json = await response.json();

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

            const period = req.body.period;
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
            res.json(result);

        } catch (err) {
            console.log(err);
        }
    })

    app.listen(PORT, () => {
        console.log(`Example app listening on port ${PORT}`)
    })
}

StartServer()