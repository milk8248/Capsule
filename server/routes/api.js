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
    db.db_query('SELECT csv.*, ad.value as airtightness_data FROM capsule.capsule_state_v csv LEFT JOIN capsule.airtightness_data_v ad on csv.mac = ad.mac')
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
    db.db_query('Select * From capsule.capsule Where mac = $1', reqBodyData)
        .then(data => {
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
    db.db_query('Select * From capsule.capsule_state_v where mac = $1', data)
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

router.get('/capsule/pressure_pcba/:mac', function (req, res, next) {
    const data = [req.params.mac];
    db.db_query('Select * From capsule.pressure_pcba_data where mac = $1 ORDER BY timestamp ASC', data)
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

router.get('/capsule/rf/:mac', function (req, res, next) {
    const data = [req.params.mac];
    db.db_query('Select * From capsule.rf_data where mac = $1 ORDER BY timestamp ASC', data)
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
router.get('/capsule/rf_pcba/:mac', function (req, res, next) {
    const data = [req.params.mac];
    db.db_query('Select * From capsule.rf_pcba_data where mac = $1 ORDER BY timestamp ASC', data)
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

//New查詢目前要測量Type的膠囊MAC
router.get('/capsule/state/:mac', function (req, res, next) {
    const data = [req.params.mac];
    db.db_query('Select * From capsule.capsule_state Where mac = $1', data)
        .then(data => {
            res.json(data)
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

//New查詢目前要測量Type的膠囊MAC
router.get('/state/:type', function (req, res, next) {
    const data = [req.params.type];
    db.db_query('Select * From capsule.capsule_state Where type = $1 and state = 1', data)
        .then(data => {
            res.json(data)
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

//更新目前要測量Type的膠囊MAC
router.put('/state/:type', (req, res) => {
    const payload = [moment().format(), req.body.mac.toLowerCase(), req.params.type, req.body.state]
    switch (req.body.state) {
        case '0':
            db.db_delete("DELETE FROM capsule.capsule_state WHERE mac = $1 and type = $2", [req.body.mac.toLowerCase(), req.params.type])
                .then(result => {
                    res.json({
                        code: 200,
                        massage: 'update success',
                        response: [{
                            mac: payload[0],
                            type: payload[2],
                            state: payload[3],
                        }]
                    })
                })
                .catch(error => {
                    res.status(500).send(error)
                });
            break;
        case '1':
            const data = [moment().format(), req.body.mac.toLowerCase(), req.params.type]
            db.db_update('UPDATE capsule.capsule_state SET state = 2, endtime = $1 WHERE state = 1 and type = $3 and mac != $2', data)
                .then(result => {
                    res.json({
                        code: 200,
                        massage: 'update success',
                        response: [{
                            mac: payload[0],
                            type: payload[2],
                            state: payload[3],
                        }]
                    })
                })
                .catch(error => {
                    res.status(500).send(error)
                });
            db.db_insert('INSERT INTO capsule.capsule_state (timestamp, mac, type, state, starttime) VALUES ($1, $2, $3, $4, $1) ON CONFLICT (mac, type) DO UPDATE SET state = $4, starttime = $1', payload)
                .then(result => {
                    res.json({
                        code: 200,
                        massage: 'update success',
                        response: [{
                            mac: payload[0],
                            type: payload[2],
                            state: payload[3],
                        }]
                    })
                })
                .catch(error => {
                    res.status(500).send(error)
                });
            break;
        case '2':
            db.db_insert('INSERT INTO capsule.capsule_state (timestamp, mac, type, state, starttime, endtime) VALUES ($1, $2, $3, $4, $1, $1) ON CONFLICT (mac, type) DO UPDATE SET state = $4, endtime = $1', payload)
                .then(result => {
                    res.json({
                        code: 200,
                        massage: 'update success',
                        response: [{
                            mac: payload[0],
                            type: payload[2],
                            state: payload[3],
                        }]
                    })
                })
                .catch(error => {
                    res.status(500).send(error)
                });
            break;
        default:
            res.status(500).send({
                code: 500,
                massage: 'state error',
                response: []
            })
    }
})

//新增溫度儀器的數值
router.post('/thermometer', function (req, res, next) {
    if (isNumeric(req.body.value1) && isNumeric(req.body.value2) && isNumeric(req.body.value3) && isNumeric(req.body.value4)) {
        db.db_query('Select * From capsule.capsule_state_v Where thermometer = 1')
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

//新增PCBA溫度儀器的數值
router.post('/thermometer_pcba', function (req, res, next) {
    if (isNumeric(req.body.value1) && isNumeric(req.body.value2) && isNumeric(req.body.value3) && isNumeric(req.body.value4)) {
        db.db_query('Select * From capsule.capsule_state_v Where thermometer_pcba = 1')
            .then(data => {
                if (data.response.length > 0) {
                    const payload = [moment().format(), data.response[0].mac, req.body.value1, req.body.value2, req.body.value3, req.body.value4, req.body.raw];
                    db.db_insert('INSERT INTO capsule.thermometer_pcba_data (timestamp, mac, value1, value2, value3, value4, raw) VALUES ($1, $2, $3, $4, $5, $6, $7)', payload)
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
                        massage: '目前沒有要量測溫度的PCBA'
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
router.post('/pressure/:type', function (req, res, next) {
    if (isNumeric(req.body.value)) {
        db.db_query('Select * From capsule.capsule_state_v Where pressure_' + req.params.type + ' = 1')
            .then(data => {
                if (data.response.length > 0) {
                    const payload = [moment().format(), data.response[0].mac, req.body.value, req.body.raw, req.params.type];
                    db.db_insert('INSERT INTO capsule.pressure_data (timestamp, mac, value, raw, type) VALUES ($1, $2, $3, $4, $5)', payload)
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
//新增PCBA壓力儀器的數值
router.post('/pressure_pcba/:type', function (req, res, next) {
    if (isNumeric(req.body.value)) {
        db.db_query('Select * From capsule.capsule_state_v Where pressure_' + req.params.type + '_pcba = 1')
            .then(data => {
                if (data.response.length > 0) {
                    const payload = [moment().format(), data.response[0].mac, req.body.value, req.body.raw, req.params.type];
                    db.db_insert('INSERT INTO capsule.pressure_pcba_data (timestamp, mac, value, raw, type) VALUES ($1, $2, $3, $4, $5)', payload)
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
                        massage: '目前沒有要量測壓力的PCBA'
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
    db.db_query('Select * From capsule.capsule_state_v Where airtightness = 1')
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
});


//新增RF儀器的數值
router.post('/rf', function (req, res, next) {
    if (isNumeric(req.body.value1) && isNumeric(req.body.value2) && isNumeric(req.body.threshold)) {
        db.db_query('Select * From capsule.capsule_state_v Where rf = 1')
            .then(data => {
                if (data.response.length > 0) {
                    const payload = [moment().format(), data.response[0].mac, req.body.value1, req.body.value2, req.body.result, req.body.threshold, req.body.raw];
                    db.db_insert('INSERT INTO capsule.rf_data (timestamp, mac, value1, value2, result, threshold, raw) VALUES ($1, $2, $3, $4, $5, $6, $7)', payload)
                        .then(data => {
                            res.json({
                                code: 200,
                                massage: '寫入成功',
                                response: [{
                                    timestamp: payload[0],
                                    mac: payload[1],
                                    value1: payload[2],
                                    value2: payload[3],
                                    result: payload[4],
                                    threshold: payload[5],
                                    raw: payload[6]
                                }]
                            })
                        })
                } else {
                    res.json({
                        code: 500,
                        massage: '目前沒有要量測RF的膠囊'
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

//新增RF儀器的數值
router.post('/rf_pcba', function (req, res, next) {
    if (isNumeric(req.body.value1) && isNumeric(req.body.value2) && isNumeric(req.body.threshold)) {
        db.db_query('Select * From capsule.capsule_state_v Where rf_pcba = 1')
            .then(data => {
                if (data.response.length > 0) {
                    const payload = [moment().format(), data.response[0].mac, req.body.value1, req.body.value2, req.body.result, req.body.threshold, req.body.raw];
                    db.db_insert('INSERT INTO capsule.rf_pcba_data (timestamp, mac, value1, value2, result, threshold, raw) VALUES ($1, $2, $3, $4, $5, $6, $7)', payload)
                        .then(data => {
                            res.json({
                                code: 200,
                                massage: '寫入成功',
                                response: [{
                                    timestamp: payload[0],
                                    mac: payload[1],
                                    value1: payload[2],
                                    value2: payload[3],
                                    result: payload[4],
                                    threshold: payload[5],
                                    raw: payload[6]
                                }]
                            })
                        })
                } else {
                    res.json({
                        code: 500,
                        massage: '目前沒有要量測RF的PCBA'
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

//新增藍芽膠囊讀出的數值
router.post('/ble_data', function (req, res, next) {
    if (isNumeric(req.body.pressure) && isNumeric(req.body.temperature)) {
        const payload = [moment().format(), req.body.mac.toLowerCase(), req.body.rssi, req.body.pressure, req.body.temperature, req.body.voltage, req.body.raw];
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

//取得壓力結果
router.post('/result/pressure', function (req, res, next) {

    let pressure_data = {}
    let ble_pressure_data={}

    const payload = [req.body.mac, req.body.type];
    db.db_query('Select * From capsule.pressure_data Where mac=$1 and type=$2 order by timestamp desc limit 5', payload)
        .then(data => {
            if (data.response.length == 5) {
                let lastTimestamp = data.response[0].timestamp;
                let firstTimestamp = data.response[4].timestamp;
                let duration = moment(lastTimestamp) - moment(firstTimestamp)
                if (duration >= 60000) {
                    res.json({
                        code: 500,
                        massage: '資料量超過一分鐘'
                    })
                } else {
                    const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;
                    let value_array = [];
                    for (let i = 0; i < data.response.length; i++) {
                        value_array.push(data.response[i].value)
                    }
                    const value_avg = average(value_array);
                    console.log(value_array)
                    pressure_data = {
                        timestamp:moment(firstTimestamp)+duration/2,
                        value:value_avg
                    }
                    res.json({
                        code: 200,
                        massage: pressure_data
                    })
                }
                console.log(moment(lastTimestamp) - moment(firstTimestamp));
                res.json({
                    code: 200,
                    massage: '資料量11不足'
                })
            } else {
                res.json({
                    code: 500,
                    massage: '資料量不足'
                })
            }
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

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
