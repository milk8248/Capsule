const express = require('express');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();
const moment = require('moment');
const csv = require('fast-csv');
const path = require('path');
const db = require('../db_handler');

var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'uploads')
    },
    filename: (req, file, callBack) => {
        callBack(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname),
        )
    },
})
const upload = multer({
    storage: storage,
})

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}


/* GET users listing. */
router.get('/', function (req, res, next) {
    res.json({
        msg: 'User!'
    })
});

router.get('/capsule', function (req, res, next) {
    db.db_query('Select * From capsule.capsule')
        .then(data => {
            res.json(data)
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

//新增膠囊
router.post('/capsule', function (req, res, next) {
    const reqBodyData = [req.body.mac.toLowerCase()];
    console.log(reqBodyData)
    db.db_query('Select * From capsule.capsule Where mac = $1', reqBodyData)
        .then(data => {
            console.log(data.response.length)
            if (data.response.length == 0) {
                const payload = [moment().format(), req.body.mac.toLowerCase()];
                db.db_insert('INSERT INTO capsule.capsule (timestamp, mac) VALUES ($1, $2)', payload)
                    .then(data => {
                        res.json({
                            code: 200,
                            massage: '寫入成功',
                            response: [{
                                timestamp: payload[0],
                                mac: payload[1],
                            }]
                        })
                    })
            } else {
                res.json({
                    code: 500,
                    massage: '此膠囊已註冊'
                })
            }
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

router.get('/capsule/:mac', function (req, res, next) {
    const data = [req.params.mac];
    db.db_query('Select * From capsule.capsule where mac = $1', data)
        .then(data => {
            res.json(data)
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

router.get('/receiver', function (req, res, next) {
    db.db_query('Select * From capsule.receiver')
        .then(data => {
            res.json(data)
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

//新增膠囊
router.post('/receiver', function (req, res, next) {
    const reqBodyData = [req.body.mac.toLowerCase()];
    console.log(reqBodyData)
    db.db_query('Select * From capsule.receiver Where mac = $1', reqBodyData)
        .then(data => {
            console.log(data.response.length)
            if (data.response.length == 0) {
                const payload = [moment().format(), req.body.mac.toLowerCase()];
                db.db_insert('INSERT INTO capsule.receiver (timestamp, mac) VALUES ($1, $2)', payload)
                    .then(data => {
                        res.json({
                            code: 200,
                            massage: '寫入成功',
                            response: [{
                                timestamp: payload[0],
                                mac: payload[1],
                            }]
                        })
                    })
            } else {
                res.json({
                    code: 500,
                    massage: '此膠囊已註冊'
                })
            }
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

router.get('/receiver/:mac', function (req, res, next) {
    const data = [req.params.mac];
    db.db_query('Select * From capsule.receiver where mac = $1', data)
        .then(data => {
            res.json(data)
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

router.get('/ble_data/:mac', function (req, res, next) {
    const data = [req.params.mac];
    db.db_query('Select * From capsule.ble_data where mac = $1', data)
        .then(data => {
            res.json(data)
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

router.get('/ble_receiver_data/:mac', function (req, res, next) {
    const data = [req.params.mac];
    db.db_query('Select * From capsule.receiver_data where mac = $1', data)
        .then(data => {
            res.json(data)
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

router.get('/receiver/pressure/:mac', function (req, res, next) {
    const data = [req.params.mac];
    db.db_query('Select * From capsule.receiver_pressure_data where mac = $1 ORDER BY timestamp ASC', data)
        .then(data => {
            // data.response.map(entry => {
            //     entry.timestamp_tw = moment(entry.timestamp).format('YYYY-MM-DD HH:mm:ss')
            // })
            res.json(data)
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

router.get('/capsule/pressure/:mac', function (req, res, next) {
    const data = [req.params.mac];
    db.db_query('Select * From capsule.pressure_data where mac = $1 ORDER BY timestamp ASC', data)
        .then(data => {
            // data.response.map(entry => {
            //     entry.timestamp_tw = moment(entry.timestamp).format('YYYY-MM-DD HH:mm:ss')
            // })
            res.json(data)
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

router.get('/capsule/thermometer/:mac', function (req, res, next) {
    const data = [req.params.mac];
    db.db_query('Select * From capsule.thermometer_data where mac = $1 ORDER BY timestamp ASC', data)
        .then(data => {
            // data.response.map(entry => {
            //     entry.timestamp_tw = moment(entry.timestamp).format('YYYY-MM-DD HH:mm:ss')
            // })
            res.json(data)
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

router.get('/capsule/thermometer_pcba/:mac', function (req, res, next) {
    const data = [req.params.mac];
    db.db_query('Select * From capsule.thermometer_pcba_data where mac = $1 ORDER BY timestamp ASC', data)
        .then(data => {
            // data.response.map(entry => {
            //     entry.timestamp_tw = moment(entry.timestamp).format('YYYY-MM-DD HH:mm:ss')
            // })
            res.json(data)
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

router.get('/capsule/airtightness/:mac', function (req, res, next) {
    const data = [req.params.mac];
    db.db_query('Select * From capsule.airtightness_data where mac = $1 ORDER BY timestamp ASC', data)
        .then(data => {
            // data.response.map(entry => {
            //     entry.timestamp_tw = moment(entry.timestamp).format('YYYY-MM-DD HH:mm:ss')
            // })
            res.json(data)
        })
        .catch(error => {
            res.status(500).send(error);
        });
});


router.get('/thermometer_data', function (req, res, next) {
    db.db_query('Select * From capsule.thermometer_data ORDER BY timestamp ASC')
        .then(data => {
            // data.response.map(entry => {
            //     entry.timestamp_tw = moment(entry.timestamp).format('YYYY-MM-DD HH:mm:ss')
            // })
            res.json(data)
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

router.get('/insert', function (req, res, next) {
    res.json({
        msg: 'User insert!'
    })
});

//查詢目前要測量溫度的膠囊MAC
router.get('/thermometer', function (req, res, next) {
    db.db_query('Select * From capsule.capsule Where thermometer_state = 1')
        .then(data => {
            res.json(data)
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

//查詢目前要測量溫度的膠囊PCBA MAC
router.get('/thermometer_pcba', function (req, res, next) {
    db.db_query('Select * From capsule.capsule Where thermometer_pcba_state = 1')
        .then(data => {
            res.json(data)
        })
        .catch(error => {
            res.status(500).send(error);
        });
});


//查詢目前要測量壓力的膠囊MAC
router.get('/pressure', function (req, res, next) {
    db.db_query('Select * From capsule.capsule Where pressure_state = 1')
        .then(data => {
            res.json(data)
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

//查詢目前要測量氣密的膠囊MAC
router.get('/airtightness', function (req, res, next) {
    db.db_query('Select * From capsule.capsule Where airtightness_state = 1')
        .then(data => {
            res.json(data)
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

//新增溫度儀器的數值
router.post('/thermometer', function (req, res, next) {
    if (isNumeric(req.body.value1) && isNumeric(req.body.value2) && isNumeric(req.body.value3) && isNumeric(req.body.value4)) {
        db.db_query('Select * From capsule.capsule Where thermometer_state = 1')
            .then(data => {
                if (data.response.length > 0) {
                    const payload = [moment().format(), data.response[0].mac, req.body.value1, req.body.value2, req.body.value3, req.body.value4, req.body.raw];
                    db.db_insert('INSERT INTO capsule.thermometer_data (timestamp, mac, value1, value2, value3, value4, raw) VALUES ($1, $2, $3, $4, $5, $6, $7)', payload)
                        .then(data => {
                            res.json({
                                code: 200,
                                massage: '寫入成功',
                                response: [{
                                    timestamp: payload[0],
                                    mac: payload[1],
                                    value1: payload[2],
                                    value2: payload[3],
                                    value3: payload[4],
                                    value4: payload[5],
                                    raw: payload[6]
                                }]
                            })
                        })
                } else {
                    res.json({
                        code: 500,
                        massage: '目前沒有要量測溫度的膠囊'
                    })
                }
            })
            .catch(error => {
                res.status(500).send(error);
            });
    } else {
        res.json({
            code: 500,
            massage: '輸入格式錯誤'
        })
    }
});

//新增壓力儀器的數值
router.post('/pressure', function (req, res, next) {
    if (isNumeric(req.body.value)) {
        db.db_query('Select * From capsule.capsule Where pressure_state = 1')
            .then(data => {
                if (data.response.length > 0) {
                    const payload = [moment().format(), data.response[0].mac, req.body.value, req.body.raw];
                    db.db_insert('INSERT INTO capsule.pressure_data (timestamp, mac, value, raw) VALUES ($1, $2, $3, $4)', payload)
                        .then(data => {
                            res.json({
                                code: 200,
                                massage: '寫入成功',
                                response: [{
                                    timestamp: payload[0],
                                    mac: payload[1],
                                    value: payload[2],
                                    raw: payload[3]
                                }]
                            })
                        })
                } else {
                    res.json({
                        code: 500,
                        massage: '目前沒有要量測壓力的膠囊'
                    })
                }
            })
            .catch(error => {
                res.status(500).send(error);
            });
    } else {
        res.json({
            code: 500,
            massage: '輸入格式錯誤'
        })
    }
});

//新增氣密儀器的數值
router.post('/airtightness', function (req, res, next) {
    if (isNumeric(req.body.value)) {
        db.db_query('Select * From capsule.capsule Where airtightness_state = 1')
            .then(data => {
                if (data.response.length > 0) {
                    const payload = [moment().format(), data.response[0].mac, req.body.value, req.body.raw];
                    db.db_insert('INSERT INTO capsule.airtightness_data (timestamp, mac, value, raw) VALUES ($1, $2, $3, $4)', payload)
                        .then(data => {
                            res.json({
                                code: 200,
                                massage: '寫入成功',
                                response: [{
                                    timestamp: payload[0],
                                    mac: payload[1],
                                    value: payload[2],
                                    raw: payload[3]
                                }]
                            })
                        })
                } else {
                    res.json({
                        code: 500,
                        massage: '目前沒有要量測氣密的膠囊'
                    })
                }
            })
            .catch(error => {
                res.status(500).send(error);
            });
    } else {
        res.json({
            code: 500,
            massage: '輸入格式錯誤'
        })
    }
});

//新增接收器的壓力儀器的數值
router.post('/receiver_pressure', function (req, res, next) {
    if (isNumeric(req.body.value)) {
        db.db_query('Select * From capsule.receiver Where pressure_state = 1')
            .then(data => {
                if (data.response.length > 0) {
                    const payload = [moment().format(), data.response[0].mac, req.body.value, req.body.raw];
                    db.db_insert('INSERT INTO capsule.receiver_pressure_data (timestamp, mac, value, raw) VALUES ($1, $2, $3, $4)', payload)
                        .then(data => {
                            res.json({
                                code: 200,
                                massage: '寫入成功',
                                response: [{
                                    timestamp: payload[0],
                                    mac: payload[1],
                                    value: payload[2],
                                    raw: payload[3]
                                }]
                            })
                        })
                } else {
                    res.json({
                        code: 500,
                        massage: '目前沒有要量測壓力的膠囊'
                    })
                }
            })
            .catch(error => {
                res.status(500).send(error);
            });
    } else {
        res.json({
            code: 500,
            massage: '輸入格式錯誤'
        })
    }
});

//更新目前要測量壓力的接收器MAC
router.put('/receiver/pressure', (req, res) => {
    if (req.body.state == '0') {
        const data = [req.body.mac.toLowerCase()];
        db.db_update('UPDATE capsule.receiver SET pressure_state = 0 WHERE mac = $1', data)
            .then(data => {
                res.json(data)
            })
            .catch(error => {
                res.status(500).send(error);
            });
    } else if (req.body.state == '1') {

        db.db_update('UPDATE capsule.receiver SET pressure_state = 2, pressure_endtime = $1 WHERE pressure_state = 1', [moment().format()])

        const data = [req.body.mac.toLowerCase(), moment().format()];
        db.db_update('UPDATE capsule.receiver SET pressure_state = 1, pressure_starttime = $2 WHERE mac = $1', data)
            .then(data => {
                res.json(data)
            })
            .catch(error => {
                res.status(500).send(error);
            });
    } else if (req.body.state == '2') {

        const data = [req.body.mac.toLowerCase(), moment().format()];
        db.db_update('UPDATE capsule.receiver SET pressure_state = 2, pressure_endtime = $2 WHERE mac = $1', data)
            .then(data => {
                res.json(data)
            })
            .catch(error => {
                res.status(500).send(error);
            });
    }
})


//更新目前要測量壓力的膠囊MAC
router.put('/capsule/pressure', (req, res) => {
    if (req.body.state == '0') {
        console.log(moment().format())
        const data = [req.body.mac.toLowerCase()];
        db.db_update('UPDATE capsule.capsule SET pressure_state = 0 WHERE mac = $1', data)
            .then(data => {
                res.json(data)
            })
            .catch(error => {
                res.status(500).send(error);
            });
    } else if (req.body.state == '1') {

        db.db_update('UPDATE capsule.capsule SET pressure_state = 2, pressure_endtime = $1 WHERE pressure_state = 1', [moment().format()])

        const data = [req.body.mac.toLowerCase(), moment().format()];
        db.db_update('UPDATE capsule.capsule SET pressure_state = 1, pressure_starttime = $2 WHERE mac = $1', data)
            .then(data => {
                res.json(data)
            })
            .catch(error => {
                res.status(500).send(error);
            });
    } else if (req.body.state == '2') {

        const data = [req.body.mac.toLowerCase(), moment().format()];
        db.db_update('UPDATE capsule.capsule SET pressure_state = 2, pressure_endtime = $2 WHERE mac = $1', data)
            .then(data => {
                res.json(data)
            })
            .catch(error => {
                res.status(500).send(error);
            });
    }
})

//更新目前要測量PCBA溫度的膠囊MAC
router.put('/capsule/thermometer_pcba', (req, res) => {
    if (req.body.state == '0') {
        const data = [req.body.mac.toLowerCase()];
        db.db_update('UPDATE capsule.capsule SET thermometer_pcba_state = 0 WHERE mac = $1', data)
            .then(data => {
                res.json(data)
            })
            .catch(error => {
                res.status(500).send(error);
            });
    } else if (req.body.state == '1') {

        db.db_update('UPDATE capsule.capsule SET thermometer_pcba_state = 2, thermometer_pcba_endtime = $1 WHERE thermometer_pcba_state = 1', [moment().format()])
        const data = [req.body.mac.toLowerCase(), moment().format()];
        db.db_update('UPDATE capsule.capsule SET thermometer_pcba_state = 1, thermometer_pcba_starttime = $2 WHERE mac = $1', data)
            .then(data => {
                res.json(data)
            })
            .catch(error => {
                res.status(500).send(error);
            });
    } else if (req.body.state == '2') {

        const data = [req.body.mac.toLowerCase(), moment().format()];
        db.db_update('UPDATE capsule.capsule SET thermometer_pcba_state = 2, thermometer_pcba_endtime = $2 WHERE mac = $1', data)
            .then(data => {
                res.json(data)
            })
            .catch(error => {
                res.status(500).send(error);
            });
    } else if (req.body.state == '3') {

        const data = [req.body.mac.toLowerCase(), null, null];
        db.db_update('UPDATE capsule.capsule SET thermometer_pcba_state = 0, thermometer_pcba_starttime=$2, thermometer_pcba_endtime = $3 WHERE mac = $1', data)
            .then(data => {
                res.json(data)
            })
            .catch(error => {
                res.status(500).send(error);
            });
    }
})

//更新目前要測量溫度的膠囊MAC
router.put('/capsule/thermometer', (req, res) => {
    if (req.body.state == '0') {
        console.log(moment().format())
        const data = [req.body.mac.toLowerCase()];
        db.db_update('UPDATE capsule.capsule SET thermometer_state = 0 WHERE mac = $1', data)
            .then(data => {
                res.json(data)
            })
            .catch(error => {
                res.status(500).send(error);
            });
    } else if (req.body.state == '1') {

        db.db_update('UPDATE capsule.capsule SET thermometer_state = 2, thermometer_endtime = $1 WHERE thermometer_state = 1', [moment().format()])
        const data = [req.body.mac.toLowerCase(), moment().format()];
        db.db_update('UPDATE capsule.capsule SET thermometer_state = 1, thermometer_starttime = $2 WHERE mac = $1', data)
            .then(data => {
                res.json(data)
            })
            .catch(error => {
                res.status(500).send(error);
            });
    } else if (req.body.state == '2') {

        const data = [req.body.mac.toLowerCase(), moment().format()];
        db.db_update('UPDATE capsule.capsule SET thermometer_state = 2, thermometer_endtime = $2 WHERE mac = $1', data)
            .then(data => {
                res.json(data)
            })
            .catch(error => {
                res.status(500).send(error);
            });
    } else if (req.body.state == '3') {

        const data = [req.body.mac.toLowerCase(), null, null];
        db.db_update('UPDATE capsule.capsule SET thermometer_state = 0, thermometer_starttime=$2, thermometer_endtime = $3 WHERE mac = $1', data)
            .then(data => {
                res.json(data)
            })
            .catch(error => {
                res.status(500).send(error);
            });
    }
})

//查詢目前要測量壓力的膠囊MAC
router.get('/pressure', function (req, res, next) {
    db.db_query('Select * From capsule.capsule Where pressure_state = 1')
        .then(data => {
            res.json(data)
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

//更新目前要測量氣密的膠囊MAC
router.put('/capsule/airtightness', (req, res) => {
    if (req.body.state == '0') {
        console.log(moment().format())
        const data = [req.body.mac.toLowerCase()];
        db.db_update('UPDATE capsule.capsule SET airtightness_state = 0 WHERE mac = $1', data)
            .then(data => {
                res.json(data)
            })
            .catch(error => {
                res.status(500).send(error);
            });
    } else if (req.body.state == '1') {

        db.db_update('UPDATE capsule.capsule SET airtightness_state = 2, airtightness_endtime = $1 WHERE airtightness_state = 1', [moment().format()])

        const data = [req.body.mac.toLowerCase(), moment().format()];
        db.db_update('UPDATE capsule.capsule SET airtightness_state = 1, airtightness_starttime = $2 WHERE mac = $1', data)
            .then(data => {
                res.json(data)
            })
            .catch(error => {
                res.status(500).send(error);
            });
    } else if (req.body.state == '2') {

        const data = [req.body.mac.toLowerCase(), moment().format()];
        db.db_update('UPDATE capsule.capsule SET airtightness_state = 2, airtightness_endtime = $2 WHERE mac = $1', data)
            .then(data => {
                res.json(data)
            })
            .catch(error => {
                res.status(500).send(error);
            });
    }
})

//新增藍芽膠囊讀出的數值
router.post('/ble_data', function (req, res, next) {
    if (isNumeric(req.body.pressure) && isNumeric(req.body.temperature)) {
        const payload = [moment().format(), req.body.mac, req.body.rssi, req.body.pressure, req.body.temperature, req.body.voltage, req.body.raw];
        db.db_insert('INSERT INTO capsule.ble_data (timestamp, mac, rssi, pressure, temperature, voltage, raw) VALUES ($1, $2, $3, $4, $5, $6, $7)', payload)
            .then(data => {
                res.json({
                    code: 200,
                    massage: '寫入成功',
                    response: [{
                        timestamp: payload[0],
                        mac: payload[1],
                        rssi: payload[2],
                        pressure: payload[3],
                        temperature: payload[4],
                        voltage: payload[5],
                        raw: payload[6]
                    }]
                })
            })
    } else {
        res.json({
            code: 500,
            massage: '輸入格式錯誤'
        })
    }
});

router.post('/upload_ble_csv', upload.single('file'), (req, res) => {
    csvToDb(__dirname + '/../uploads/' + req.file.filename)
    res.json({
        code: 200,
        msg: 'File successfully inserted!',
        file: req.file,
    })
})

router.post('/upload_ble_receiver_csv', upload.single('file'), (req, res) => {
    receiverCsvToDb(__dirname + '/../uploads/' + req.file.filename)
    res.json({
        code: 200,
        msg: 'File successfully inserted!',
        file: req.file,
    })
})


function csvToDb(csvUrl) {
    let stream = fs.createReadStream(csvUrl)
    let collectionCsv = []
    let csvFileStream = csv
        .parse()
        .on('data', function (data) {
            collectionCsv.push(data)
        })
        .on('end', function () {
            collectionCsv.forEach(row => {
                if (row[0] == 'Date') {
                    return
                }
                row[0] = moment(row[0], 'YYYYMMDD-hh:mm:ss').format()
                row[1] = row[1].toLowerCase()
                // console.log(row)
                payload = [row[0], row[1]]
                db.db_query('select * from capsule.ble_data where timestamp = $1 and mac = $2', payload)
                    .then(data => {
                        if (data.response.length == 0) {
                            db.db_insert('INSERT INTO capsule.ble_data (timestamp, mac, rssi, pressure, temperature, counter, voltage) VALUES ($1, $2, $3, $4, $5, $6, $7)', row)
                        }
                    })
            })
            fs.unlinkSync(csvUrl)
        })
    stream.pipe(csvFileStream)
}

function receiverCsvToDb(csvUrl) {
    let stream = fs.createReadStream(csvUrl)
    let collectionCsv = []
    let csvFileStream = csv
        .parse()
        .on('data', function (data) {
            collectionCsv.push(data)
        })
        .on('end', function () {
            collectionCsv.forEach(row => {
                if (row[0] == 'Date') {
                    return
                }
                row[0] = moment(row[0], 'YYYYMMDD-hh:mm:ss').format()
                row[1] = row[1].toLowerCase()
                // console.log(row)
                payload = [row[0], row[1]]
                db.db_query('select * from capsule.receiver_data where timestamp = $1 and mac = $2', payload)
                    .then(data => {
                        if (data.response.length == 0) {
                            db.db_insert('INSERT INTO capsule.receiver_data (timestamp, mac, rssi, tag_pressure, reader_pressure, pressure_diff, tag_temperature, reader_temperature, tag_counter, tag_voltage, reader_antenna) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', row)
                        }
                    })
            })
            fs.unlinkSync(csvUrl)
        })
    stream.pipe(csvFileStream)
}

module.exports = router;
