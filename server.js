const express = require('express');
const helmet = require('helmet');

const server = express();

const cohortsRouter = require('./cohorts/cohorts-router.js');
const studentsRouter = require('./students/students-router.js');

server.use(helmet());
server.use(express.json());


server.use('/api/cohorts', cohortsRouter);
server.use('/api/students', studentsRouter);


server.get('/', (req, res) => {
    res.send({ message: 'Hello from Patty. BE Week2-Day3 Project'})
});

module.exports = server;