const app = require('./app');
const { PORT } = require('./config');

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION!');
    console.log(err.name, err.message);
    process.exit(1);
});

app.listen(PORT, () => {
    console.log(`App running on port ${PORT} ...`);
});

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION!.');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});