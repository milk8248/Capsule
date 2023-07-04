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
    }, filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname),)
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
    db.db_query('SELECT csv.*, c.*, adv.value as airtightness_data\n' + 'FROM capsule.capsule_state_v csv,\n' + '     capsule.capsule c\n' + '         LEFT JOIN capsule.airtightness_data_v adv on adv.mac = c.mac\n' + 'WHERE csv.mac = c.mac')
        .then(data => {
            res.json(data)
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

router.get('/threshold', function (req, res, next) {
    db.db_query('SELECT * FROM capsule.threshold_v')
        .then(data => {
            res.json(data)
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

router.post('/threshold', function (req, res, next) {
    const payload = [moment().format(), req.body.type, req.body.value];
    db.db_insert('INSERT INTO capsule.threshold (timestamp, type, value) VALUES ($1, $2, $3) ON CONFLICT (type) DO UPDATE SET value = $3, timestamp = $1', payload)
        .then(result => {
            res.json({
                code: 200, massage: 'update success', response: [{
                    type: payload[2], value: payload[3],
                }]
            })
        })
        .catch(error => {
            res.status(500).send(error)
        });
});

router.put('/capsule/threshold', function (req, res, next) {
    const payload = [req.body.value, req.body.mac];
    db.db_update('UPDATE capsule.capsule SET threshold_' + req.body.type + ' = $1 where mac = $2', payload)
        .then(result => {
            res.json({
                code: 200, massage: 'update success', response: [{
                    mac: payload[1], type: req.body.type, value: payload[0],
                }]
            })
        })
        .catch(error => {
            res.status(500).send(error)
        });
});

//新增膠囊
router.post('/capsule', function (req, res, next) {

    db.db_query('Select * From capsule.threshold_v')
        .then(data => {
            let threshold_pressure_750 = 0
            let threshold_pressure_800 = 0
            let threshold_pressure_850 = 0
            let threshold_pressure_750_pcba = 0
            let threshold_pressure_800_pcba = 0
            let threshold_pressure_850_pcba = 0
            let threshold_thermometer = 0
            let threshold_thermometer_pcba = 0
            let threshold_rf = 0
            let threshold_rf_pcba = 0

            if (data.response.length > 0) {
                threshold_pressure_750 = data.response[0].pressure_750
                threshold_pressure_800 = data.response[0].pressure_800
                threshold_pressure_850 = data.response[0].pressure_850
                threshold_pressure_750_pcba = data.response[0].pressure_750_pcba
                threshold_pressure_800_pcba = data.response[0].pressure_800_pcba
                threshold_pressure_850_pcba = data.response[0].pressure_850_pcba
                threshold_thermometer = data.response[0].thermometer
                threshold_thermometer_pcba = data.response[0].thermometer_pcba
                threshold_rf = data.response[0].rf
                threshold_rf_pcba = data.response[0].rf_pcba
            }

            const reqBodyData = [req.body.mac.toLowerCase()];
            db.db_query('Select * From capsule.capsule Where mac = $1', reqBodyData)
                .then(data2 => {
                    if (data2.response.length == 0) {
                        const payload = [moment().format(), req.body.mac.toLowerCase(), threshold_pressure_750, threshold_pressure_800, threshold_pressure_850, threshold_pressure_750_pcba, threshold_pressure_800_pcba, threshold_pressure_850_pcba, threshold_thermometer, threshold_thermometer_pcba, threshold_rf, threshold_rf_pcba];
                        db.db_insert('INSERT INTO capsule.capsule (' + 'timestamp, mac, ' + 'threshold_pressure_750, ' + 'threshold_pressure_800, ' + 'threshold_pressure_850, ' + 'threshold_pressure_750_pcba, ' + 'threshold_pressure_800_pcba, ' + 'threshold_pressure_850_pcba, ' + 'threshold_thermometer, ' + 'threshold_thermometer_pcba, '+ 'threshold_rf, ' + 'threshold_rf_pcba ' + ') VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', payload)
                            .then(data3 => {
                                res.json({
                                    code: 200, massage: '寫入成功', response: [{
                                        timestamp: payload[0], mac: payload[1],
                                    }]
                                })
                            })
                    } else {
                        res.json({
                            code: 500, massage: '此膠囊已註冊'
                        })
                    }
                })
                .catch(error => {
                    res.status(500).send(error);
                });
        })
});

router.get('/capsule/:mac', function (req, res, next) {
    const data = [req.params.mac];
    db.db_query('Select csv.*,\n' +
        '       c.threshold_pressure_750,\n' +
        '       c.threshold_pressure_800,\n' +
        '       c.threshold_pressure_850,\n' +
        '       c.threshold_pressure_750_pcba,\n' +
        '       c.threshold_pressure_800_pcba,\n' +
        '       c.threshold_pressure_850_pcba,\n' +
        '       c.threshold_thermometer,\n' +
        '       c.threshold_thermometer_pcba,\n' +
        '       c.threshold_rf,\n' +
        '       c.threshold_rf_pcba,\n' +
        '       c.test_pressure_750,\n' +
        '       c.test_pressure_800,\n' +
        '       c.test_pressure_850,\n' +
        '       c.test_pressure_750_pcba,\n' +
        '       c.test_pressure_800_pcba,\n' +
        '       c.test_pressure_850_pcba,\n' +
        '       c.test_thermometer,\n' +
        '       c.test_thermometer_pcba,\n' +
        '       c.test_rf,\n' +
        '       c.test_rf_pcba\n' +
        'From capsule.capsule_state_v csv\n' +
        '         left join capsule.capsule c on csv.mac = c.mac\n' +
        'where csv.mac = $1', data)
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
                            code: 200, massage: '寫入成功', response: [{
                                timestamp: payload[0], mac: payload[1],
                            }]
                        })
                    })
            } else {
                res.json({
                    code: 500, massage: '此膠囊已註冊'
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
    db.db_query('Select * From capsule.ble_data where mac = $1 ORDER BY timestamp ASC', data)
        .then(data => {
            res.json(data)
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

router.get('/ble_pcba_data/:mac', function (req, res, next) {
    const data = [req.params.mac];
    db.db_query('Select * From capsule.ble_pcba_data where mac = $1 ORDER BY timestamp ASC', data)
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
                        code: 200, massage: 'update success', response: [{
                            mac: payload[0], type: payload[2], state: payload[3],
                        }]
                    })
                })
                .catch(error => {
                    res.status(500).send(error)
                });
            break;
        case '1':
            //將其他狀態為1的膠囊改成2
            const data = [moment().format(), req.body.mac.toLowerCase(), req.params.type]
            db.db_update('UPDATE capsule.capsule_state SET state = 2, endtime = $1 WHERE state = 1 and type = $3 and mac != $2', data)
                .then(result => {
                    res.json({
                        code: 200, massage: 'update success', response: [{
                            mac: payload[0], type: payload[2], state: payload[3],
                        }]
                    })
                })
                .catch(error => {
                    res.status(500).send(error)
                });
            //將此膠囊其他狀態改成2
            db.db_update('UPDATE capsule.capsule_state SET state = 2, endtime = $1 WHERE state = 1 and mac = $2', [moment().format(), req.body.mac.toLowerCase()])
                .then(result => {
                    res.json({
                        code: 200, massage: 'update success', response: [{
                            mac: payload[0], state: payload[1],
                        }]
                    })
                })
                .catch(error => {
                    res.status(500).send(error)
                });
            db.db_insert('INSERT INTO capsule.capsule_state (timestamp, mac, type, state, starttime) VALUES ($1, $2, $3, $4, $1) ON CONFLICT (mac, type) DO UPDATE SET state = $4, starttime = $1', payload)
                .then(result => {
                    res.json({
                        code: 200, massage: 'update success', response: [{
                            mac: payload[0], type: payload[2], state: payload[3],
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
                        code: 200, massage: 'update success', response: [{
                            mac: payload[0], type: payload[2], state: payload[3],
                        }]
                    })
                })
                .catch(error => {
                    res.status(500).send(error)
                });
            break;
        default:
            res.status(500).send({
                code: 500, massage: 'state error', response: []
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
                    // db.db_insert('INSERT INTO capsule.ble_data (timestamp, mac, temperature) VALUES ($1, $2, $3)', [moment().format(), data.response[0].mac, 27.4])
                    db.db_insert('INSERT INTO capsule.thermometer_data (timestamp, mac, value1, value2, value3, value4, raw) VALUES ($1, $2, $3, $4, $5, $6, $7)', payload)
                        .then(data2 => {
                            db.db_query('Select * From capsule.capsule Where mac = $1', [data.response[0].mac])
                                .then(data3 => {
                                    let threshold_thermometer = 0
                                    let device_data = []
                                    let device_avg = 0
                                    let device_starttime, device_endtime
                                    let ble_data = []
                                    let ble_avg = 0
                                    let ble_starttime, ble_endtime
                                    let pass_result = false

                                    if (data3.response.length > 0) {
                                        threshold_thermometer = data3.response[0].threshold_thermometer
                                        console.log(threshold_thermometer)


                                        db.db_query('Select * From capsule.thermometer_data Where mac = $1 ORDER BY timestamp DESC Limit 5', [data.response[0].mac])
                                            .then(res_thermometer_data => {
                                                for (let i = 0; i < res_thermometer_data.response.length; i++) {
                                                    device_data.push((res_thermometer_data.response[i].value1 + res_thermometer_data.response[i].value2) / 2)
                                                }
                                                if (res_thermometer_data.response.length >= 5) {
                                                    device_endtime = res_thermometer_data.response[0].timestamp
                                                    device_starttime = res_thermometer_data.response[res_thermometer_data.response.length - 1].timestamp
                                                    if ((device_endtime - device_starttime) > 60 * 1000) {
                                                        res.json({
                                                            code: 200,
                                                            massage: '寫入成功,DATA時間超過1分鐘無法比對',
                                                            response: [{
                                                                timestamp: payload[0],
                                                                mac: payload[1],
                                                                value1: payload[2],
                                                                value2: payload[3],
                                                                value3: payload[4],
                                                                value4: payload[5],
                                                                raw: payload[6],
                                                                device_starttime: device_starttime,
                                                                device_endtime: device_endtime
                                                            }]
                                                        })
                                                    }
                                                } else {
                                                    res.json({
                                                        code: 200,
                                                        massage: '寫入成功,DATA筆數不足無法比對',
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
                                                }
                                                const sum = device_data.reduce((a, b) => a + b, 0)
                                                device_avg = (sum / device_data.length) || 0

                                                db.db_query('Select * From capsule.ble_data Where mac = $1 AND timestamp <= $2  ORDER BY timestamp DESC', [data.response[0].mac, device_endtime])
                                                    .then(res_ble_data => {
                                                        if (res_ble_data.response.length >= 5) {
                                                            for (let i = 0; i < res_ble_data.response.length; i++) {
                                                                ble_data.push(res_ble_data.response[i].temperature)
                                                            }
                                                            ble_endtime = res_ble_data.response[0].timestamp
                                                            ble_starttime = res_ble_data.response[res_ble_data.response.length - 1].timestamp

                                                            const sum = ble_data.reduce((a, b) => a + b, 0)
                                                            ble_avg = (sum / ble_data.length) || 0

                                                            // console.log('threshold_thermometer', threshold_thermometer)
                                                            // console.log('thermometer_data', device_data)
                                                            // console.log('thermometer_avg', device_avg)
                                                            // console.log('device_starttime', device_starttime)
                                                            // console.log('device_endtime', device_endtime)
                                                            // console.log('diff_time', device_endtime - device_starttime)
                                                            // console.log('ble_thermometer_data', ble_data)
                                                            // console.log('ble_thermometer_avg', ble_avg)
                                                            // console.log('device_starttime', ble_starttime)
                                                            // console.log('device_endtime', ble_endtime)
                                                            // console.log('diff_time', ble_endtime - ble_starttime)

                                                            if ((ble_endtime - ble_starttime) > 60 * 1000) {
                                                                res.json({
                                                                    code: 200,
                                                                    massage: '寫入成功,BLE時間超過1分鐘無法比對',
                                                                    response: [{
                                                                        timestamp: payload[0],
                                                                        mac: payload[1],
                                                                        value1: payload[2],
                                                                        value2: payload[3],
                                                                        value3: payload[4],
                                                                        value4: payload[5],
                                                                        raw: payload[6],
                                                                        ble_starttime: ble_starttime,
                                                                        ble_endtime: ble_endtime,
                                                                        ble_data: res_ble_data.response
                                                                    }]
                                                                })
                                                            }

                                                            const pass_result = Math.abs(ble_avg - device_avg) < threshold_thermometer

                                                            db.db_update('UPDATE capsule.capsule SET test_thermometer = $2 WHERE mac = $1', [data.response[0].mac, pass_result])
                                                                .then(up_res => {
                                                                    res.json({
                                                                        code: 200,
                                                                        massage: '寫入成功,比對成功',
                                                                        response: [{
                                                                            timestamp: payload[0],
                                                                            mac: payload[1],
                                                                            value1: payload[2],
                                                                            value2: payload[3],
                                                                            value3: payload[4],
                                                                            value4: payload[5],
                                                                            raw: payload[6],
                                                                            threshold_thermometer: threshold_thermometer,
                                                                            device_data: res_thermometer_data.response,
                                                                            device_avg: device_avg,
                                                                            ble_data: res_ble_data.response,
                                                                            ble_avg: ble_avg,
                                                                            pass: pass_result
                                                                        }]
                                                                    })
                                                                })

                                                        } else {
                                                            res.json({
                                                                code: 200,
                                                                massage: '寫入成功,BLE筆數不足無法比對',
                                                                response: [{
                                                                    timestamp: payload[0],
                                                                    mac: payload[1],
                                                                    value1: payload[2],
                                                                    value2: payload[3],
                                                                    value3: payload[4],
                                                                    value4: payload[5],
                                                                    raw: payload[6],
                                                                    ble_data: res_ble_data.response
                                                                }]
                                                            })
                                                        }
                                                    })


                                            })
                                    }

                                })

                        })


                } else {
                    res.json({
                        code: 500, massage: '目前沒有要量測溫度的膠囊'
                    })
                }
            })
            .catch(error => {
                res.status(500).send(error);
            });
    } else {
        res.json({
            code: 500, massage: '輸入格式錯誤'
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
                    // db.db_insert('INSERT INTO capsule.ble_data (timestamp, mac, temperature) VALUES ($1, $2, $3)', [moment().format(), data.response[0].mac, 27.4])
                    db.db_insert('INSERT INTO capsule.thermometer_pcba_data (timestamp, mac, value1, value2, value3, value4, raw) VALUES ($1, $2, $3, $4, $5, $6, $7)', payload)
                        .then(data2 => {
                            db.db_query('Select * From capsule.capsule Where mac = $1', [data.response[0].mac])
                                .then(data3 => {
                                    let threshold_thermometer_pcba = 0
                                    let device_data = []
                                    let device_avg = 0
                                    let device_starttime, device_endtime
                                    let ble_data = []
                                    let ble_avg = 0
                                    let ble_starttime, ble_endtime

                                    if (data3.response.length > 0) {
                                        threshold_thermometer_pcba = data3.response[0].threshold_thermometer_pcba
                                        console.log(threshold_thermometer_pcba)


                                        db.db_query('Select * From capsule.thermometer_pcba_data Where mac = $1 ORDER BY timestamp DESC Limit 5', [data.response[0].mac])
                                            .then(res_thermometer_pcba_data => {
                                                for (let i = 0; i < res_thermometer_pcba_data.response.length; i++) {
                                                    device_data.push((res_thermometer_pcba_data.response[i].value3 + res_thermometer_pcba_data.response[i].value4) / 2)
                                                }
                                                if (res_thermometer_pcba_data.response.length >= 5) {
                                                    device_endtime = res_thermometer_pcba_data.response[0].timestamp
                                                    device_starttime = res_thermometer_pcba_data.response[res_thermometer_pcba_data.response.length - 1].timestamp
                                                    if ((device_endtime - device_starttime) > 60 * 1000) {
                                                        res.json({
                                                            code: 200,
                                                            massage: '寫入成功,DATA時間超過1分鐘無法比對',
                                                            response: [{
                                                                timestamp: payload[0],
                                                                mac: payload[1],
                                                                value1: payload[2],
                                                                value2: payload[3],
                                                                value3: payload[4],
                                                                value4: payload[5],
                                                                raw: payload[6],
                                                                device_starttime: device_starttime,
                                                                device_endtime: device_endtime
                                                            }]
                                                        })
                                                    }
                                                } else {
                                                    res.json({
                                                        code: 200,
                                                        massage: '寫入成功,DATA筆數不足無法比對',
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
                                                }
                                                const sum = device_data.reduce((a, b) => a + b, 0)
                                                device_avg = (sum / device_data.length) || 0

                                                db.db_query('Select * From capsule.ble_data Where mac = $1 AND timestamp < $2 ORDER BY timestamp DESC Limit 5', [data.response[0].mac, device_endtime])
                                                    .then(res_ble_data => {
                                                        if (res_ble_data.response.length >= 5) {
                                                            for (let i = 0; i < res_ble_data.response.length; i++) {
                                                                ble_data.push(res_ble_data.response[i].temperature)
                                                            }
                                                            ble_endtime = res_ble_data.response[0].timestamp
                                                            ble_starttime = res_ble_data.response[res_ble_data.response.length - 1].timestamp

                                                            const sum = ble_data.reduce((a, b) => a + b, 0)
                                                            ble_avg = (sum / ble_data.length) || 0

                                                            // console.log('threshold_thermometer', threshold_thermometer)
                                                            // console.log('thermometer_data', device_data)
                                                            // console.log('thermometer_avg', device_avg)
                                                            // console.log('device_starttime', device_starttime)
                                                            // console.log('device_endtime', device_endtime)
                                                            // console.log('diff_time', device_endtime - device_starttime)
                                                            // console.log('ble_thermometer_data', ble_data)
                                                            // console.log('ble_thermometer_avg', ble_avg)
                                                            // console.log('device_starttime', ble_starttime)
                                                            // console.log('device_endtime', ble_endtime)
                                                            // console.log('diff_time', ble_endtime - ble_starttime)

                                                            if ((ble_endtime - ble_starttime) > 60 * 1000) {
                                                                res.json({
                                                                    code: 200,
                                                                    massage: '寫入成功,BLE時間超過1分鐘無法比對',
                                                                    response: [{
                                                                        timestamp: payload[0],
                                                                        mac: payload[1],
                                                                        value1: payload[2],
                                                                        value2: payload[3],
                                                                        value3: payload[4],
                                                                        value4: payload[5],
                                                                        raw: payload[6],
                                                                        ble_starttime: ble_starttime,
                                                                        ble_endtime: ble_endtime,
                                                                        ble_data: res_ble_data.response
                                                                    }]
                                                                })
                                                            }

                                                            const pass_result = Math.abs(ble_avg - device_avg) < threshold_thermometer_pcba

                                                            db.db_update('UPDATE capsule.capsule SET test_thermometer_pcba = $2 WHERE mac = $1', [data.response[0].mac, pass_result])
                                                                .then(up_res => {
                                                                    res.json({
                                                                        code: 200,
                                                                        massage: '寫入成功,比對成功',
                                                                        response: [{
                                                                            timestamp: payload[0],
                                                                            mac: payload[1],
                                                                            value1: payload[2],
                                                                            value2: payload[3],
                                                                            value3: payload[4],
                                                                            value4: payload[5],
                                                                            raw: payload[6],
                                                                            threshold_thermometer_pcba: threshold_thermometer_pcba,
                                                                            device_data: res_thermometer_pcba_data.response,
                                                                            device_avg: device_avg,
                                                                            ble_data: res_ble_data.response,
                                                                            ble_avg: ble_avg,
                                                                            pass: pass_result
                                                                        }]
                                                                    })
                                                                })

                                                        } else {
                                                            res.json({
                                                                code: 200,
                                                                massage: '寫入成功,BLE筆數不足無法比對',
                                                                response: [{
                                                                    timestamp: payload[0],
                                                                    mac: payload[1],
                                                                    value1: payload[2],
                                                                    value2: payload[3],
                                                                    value3: payload[4],
                                                                    value4: payload[5],
                                                                    raw: payload[6],
                                                                    ble_data: res_ble_data.response
                                                                }]
                                                            })
                                                        }
                                                    })


                                            })
                                    }

                                })

                        })


                } else {
                    res.json({
                        code: 500, massage: '目前沒有要量測溫度的膠囊'
                    })
                }
            })
            .catch(error => {
                res.status(500).send(error);
            });
    } else {
        res.json({
            code: 500, massage: '輸入格式錯誤'
        })
    }
});

//新增壓力儀器的數值
router.post('/pressure/:type', function (req, res, next) {
    if (isNumeric(req.body.value)) {
        db.db_query('Select * From capsule.capsule_state_v Where pressure_' + req.params.type + ' = 1')
            .then(data => {
                if (data.response.length > 0) {
                    // db.db_insert('INSERT INTO capsule.ble_data (timestamp, mac, pressure) VALUES ($1, $2, $3)', [moment().format(), data.response[0].mac, 27.4])
                    const payload = [moment().format(), data.response[0].mac, req.body.value, req.body.raw, req.params.type];
                    db.db_insert('INSERT INTO capsule.pressure_data (timestamp, mac, value, raw, type) VALUES ($1, $2, $3, $4, $5)', payload)
                        .then(data2 => {
                            db.db_query('Select * From capsule.capsule Where mac = $1', [data.response[0].mac])
                                .then(data3 => {
                                    let threshold_pressure = 0
                                    let device_data = []
                                    let device_avg = 0
                                    let device_starttime, device_endtime
                                    let ble_data = []
                                    let ble_avg = 0
                                    let ble_starttime, ble_endtime

                                    if (data3.response.length > 0) {
                                        threshold_pressure = data3.response[0]['threshold_pressure_' + req.params.type]

                                        db.db_query('Select * From capsule.pressure_data Where mac = $1 AND type = $2 ORDER BY timestamp DESC Limit 5', [data.response[0].mac, req.params.type])
                                            .then(res_pressure_data => {
                                                for (let i = 0; i < res_pressure_data.response.length; i++) {
                                                    device_data.push(res_pressure_data.response[i].value)
                                                }
                                                if (res_pressure_data.response.length >= 5) {
                                                    device_endtime = res_pressure_data.response[0].timestamp
                                                    device_starttime = res_pressure_data.response[res_pressure_data.response.length - 1].timestamp
                                                    if ((device_endtime - device_starttime) > 60 * 1000) {
                                                        res.json({
                                                            code: 200,
                                                            massage: '寫入成功,DATA時間超過1分鐘無法比對',
                                                            response: [{
                                                                timestamp: payload[0],
                                                                mac: payload[1],
                                                                value: payload[2],
                                                                raw: payload[3],
                                                                device_starttime: device_starttime,
                                                                device_endtime: device_endtime
                                                            }]
                                                        })
                                                    }
                                                } else {
                                                    res.json({
                                                        code: 200,
                                                        massage: '寫入成功,DATA筆數不足無法比對',
                                                        response: [{
                                                            timestamp: payload[0],
                                                            mac: payload[1],
                                                            value: payload[2],
                                                            raw: payload[3]
                                                        }]
                                                    })
                                                }
                                                const sum = device_data.reduce((a, b) => a + b, 0)
                                                device_avg = (sum / device_data.length) || 0

                                                db.db_query('Select * From capsule.ble_data Where mac = $1 AND timestamp < $2 ORDER BY timestamp DESC Limit 5', [data.response[0].mac, device_endtime])
                                                    .then(res_ble_data => {
                                                        if (res_ble_data.response.length >= 5) {
                                                            for (let i = 0; i < res_ble_data.response.length; i++) {
                                                                ble_data.push(res_ble_data.response[i].pressure)
                                                            }
                                                            ble_endtime = res_ble_data.response[0].timestamp
                                                            ble_starttime = res_ble_data.response[res_ble_data.response.length - 1].timestamp

                                                            const sum = ble_data.reduce((a, b) => a + b, 0)
                                                            ble_avg = (sum / ble_data.length) || 0

                                                            console.log('threshold_pressure', threshold_pressure)
                                                            console.log('device_data', device_data)
                                                            console.log('device_avg', device_avg)
                                                            console.log('device_starttime', device_starttime)
                                                            console.log('device_endtime', device_endtime)
                                                            console.log('diff_time', device_endtime - device_starttime)
                                                            console.log('ble_data', ble_data)
                                                            console.log('ble_avg', ble_avg)
                                                            console.log('device_starttime', ble_starttime)
                                                            console.log('device_endtime', ble_endtime)
                                                            console.log('diff_time', ble_endtime - ble_starttime)

                                                            if ((ble_endtime - ble_starttime) > 60 * 1000) {
                                                                res.json({
                                                                    code: 200,
                                                                    massage: '寫入成功,BLE時間超過1分鐘無法比對',
                                                                    response: [{
                                                                        timestamp: payload[0],
                                                                        mac: payload[1],
                                                                        value: payload[2],
                                                                        raw: payload[3],
                                                                        ble_starttime: ble_starttime,
                                                                        ble_endtime: ble_endtime,
                                                                        ble_data: res_ble_data.response
                                                                    }]
                                                                })
                                                            }

                                                            const pass_result = Math.abs(ble_avg - device_avg) < threshold_pressure

                                                            db.db_update('UPDATE capsule.capsule SET test_pressure_' + req.params.type + ' = $2 WHERE mac = $1', [data.response[0].mac, pass_result])
                                                                .then(up_res => {
                                                                    res.json({
                                                                        code: 200,
                                                                        massage: '寫入成功,比對成功',
                                                                        response: [{
                                                                            timestamp: payload[0],
                                                                            mac: payload[1],
                                                                            value: payload[2],
                                                                            raw: payload[3],
                                                                            threshold_pressure: threshold_pressure,
                                                                            device_data: res_pressure_data.response,
                                                                            device_avg: device_avg,
                                                                            ble_data: res_ble_data.response,
                                                                            ble_avg: ble_avg,
                                                                            pass: pass_result
                                                                        }]
                                                                    })
                                                                })

                                                        } else {
                                                            res.json({
                                                                code: 200,
                                                                massage: '寫入成功,BLE筆數不足無法比對',
                                                                response: [{
                                                                    timestamp: payload[0],
                                                                    mac: payload[1],
                                                                    value: payload[2],
                                                                    raw: payload[3],
                                                                    ble_data: res_ble_data.response
                                                                }]
                                                            })
                                                        }
                                                    })


                                            })
                                    }

                                })

                        })


                } else {
                    res.json({
                        code: 500, massage: '目前沒有要量測溫度的膠囊'
                    })
                }
            })
            .catch(error => {
                res.status(500).send(error);
            });

    } else {
        res.json({
            code: 500, massage: '輸入格式錯誤'
        })
    }
});
//新增PCBA壓力儀器的數值
router.post('/pressure_pcba/:type', function (req, res, next) {
    if (isNumeric(req.body.value)) {
        db.db_query('Select * From capsule.capsule_state_v Where pressure_' + req.params.type + '_pcba = 1')
            .then(data => {
                if (data.response.length > 0) {
                    // db.db_insert('INSERT INTO capsule.ble_pcba_data (timestamp, mac, pressure) VALUES ($1, $2, $3)', [moment().format(), data.response[0].mac, 27.4])
                    const payload = [moment().format(), data.response[0].mac, req.body.value, req.body.raw, req.params.type];
                    db.db_insert('INSERT INTO capsule.pressure_pcba_data (timestamp, mac, value, raw, type) VALUES ($1, $2, $3, $4, $5)', payload)
                        .then(data2 => {
                            db.db_query('Select * From capsule.capsule Where mac = $1', [data.response[0].mac])
                                .then(data3 => {
                                    let threshold_pressure = 0
                                    let device_data = []
                                    let device_avg = 0
                                    let device_starttime, device_endtime
                                    let ble_data = []
                                    let ble_avg = 0
                                    let ble_starttime, ble_endtime

                                    if (data3.response.length > 0) {
                                        threshold_pressure = data3.response[0]['threshold_pressure_' + req.params.type + '_pcba']

                                        db.db_query('Select * From capsule.pressure_pcba_data Where mac = $1 AND type = $2 ORDER BY timestamp DESC Limit 5', [data.response[0].mac, req.params.type])
                                            .then(res_pressure_data => {
                                                for (let i = 0; i < res_pressure_data.response.length; i++) {
                                                    device_data.push(res_pressure_data.response[i].value)
                                                }
                                                if (res_pressure_data.response.length >= 5) {
                                                    device_endtime = res_pressure_data.response[0].timestamp
                                                    device_starttime = res_pressure_data.response[res_pressure_data.response.length - 1].timestamp
                                                    if ((device_endtime - device_starttime) > 60 * 1000) {
                                                        res.json({
                                                            code: 200,
                                                            massage: '寫入成功,DATA時間超過1分鐘無法比對',
                                                            response: [{
                                                                timestamp: payload[0],
                                                                mac: payload[1],
                                                                value: payload[2],
                                                                raw: payload[3],
                                                                device_starttime: device_starttime,
                                                                device_endtime: device_endtime
                                                            }]
                                                        })
                                                    }
                                                } else {
                                                    res.json({
                                                        code: 200,
                                                        massage: '寫入成功,DATA筆數不足無法比對',
                                                        response: [{
                                                            timestamp: payload[0],
                                                            mac: payload[1],
                                                            value: payload[2],
                                                            raw: payload[3]
                                                        }]
                                                    })
                                                }
                                                const sum = device_data.reduce((a, b) => a + b, 0)
                                                device_avg = (sum / device_data.length) || 0

                                                db.db_query('Select * From capsule.ble_pcba_data Where mac = $1 AND timestamp < $2 ORDER BY timestamp DESC Limit 5', [data.response[0].mac, device_endtime])
                                                    .then(res_ble_data => {
                                                        if (res_ble_data.response.length >= 5) {
                                                            for (let i = 0; i < res_ble_data.response.length; i++) {
                                                                ble_data.push(res_ble_data.response[i].pressure)
                                                            }
                                                            ble_endtime = res_ble_data.response[0].timestamp
                                                            ble_starttime = res_ble_data.response[res_ble_data.response.length - 1].timestamp

                                                            const sum = ble_data.reduce((a, b) => a + b, 0)
                                                            ble_avg = (sum / ble_data.length) || 0

                                                            console.log('threshold_pressure', threshold_pressure)
                                                            console.log('thermometer_data', device_data)
                                                            console.log('thermometer_avg', device_avg)
                                                            console.log('device_starttime', device_starttime)
                                                            console.log('device_endtime', device_endtime)
                                                            console.log('diff_time', device_endtime - device_starttime)
                                                            console.log('ble_thermometer_data', ble_data)
                                                            console.log('ble_thermometer_avg', ble_avg)
                                                            console.log('device_starttime', ble_starttime)
                                                            console.log('device_endtime', ble_endtime)
                                                            console.log('diff_time', ble_endtime - ble_starttime)

                                                            if ((ble_endtime - ble_starttime) > 60 * 1000) {
                                                                res.json({
                                                                    code: 200,
                                                                    massage: '寫入成功,BLE時間超過1分鐘無法比對',
                                                                    response: [{
                                                                        timestamp: payload[0],
                                                                        mac: payload[1],
                                                                        value: payload[2],
                                                                        raw: payload[3],
                                                                        ble_starttime: ble_starttime,
                                                                        ble_endtime: ble_endtime,
                                                                        ble_data: res_ble_data.response
                                                                    }]
                                                                })
                                                            }

                                                            const pass_result = Math.abs(ble_avg - device_avg) < threshold_pressure

                                                            db.db_update('UPDATE capsule.capsule SET test_pressure_' + req.params.type + '_pcba = $2 WHERE mac = $1', [data.response[0].mac, pass_result])
                                                                .then(up_res => {
                                                                    res.json({
                                                                        code: 200,
                                                                        massage: '寫入成功,比對成功',
                                                                        response: [{
                                                                            timestamp: payload[0],
                                                                            mac: payload[1],
                                                                            value: payload[2],
                                                                            raw: payload[3],
                                                                            threshold_pressure: threshold_pressure,
                                                                            device_data: res_pressure_data.response,
                                                                            device_avg: device_avg,
                                                                            ble_data: res_ble_data.response,
                                                                            ble_avg: ble_avg,
                                                                            pass: pass_result
                                                                        }]
                                                                    })
                                                                })

                                                        } else {
                                                            res.json({
                                                                code: 200,
                                                                massage: '寫入成功,BLE筆數不足無法比對',
                                                                response: [{
                                                                    timestamp: payload[0],
                                                                    mac: payload[1],
                                                                    value: payload[2],
                                                                    raw: payload[3],
                                                                    ble_data: res_ble_data.response
                                                                }]
                                                            })
                                                        }
                                                    })


                                            })
                                    }

                                })

                        })


                } else {
                    res.json({
                        code: 500, massage: '目前沒有要量測溫度的膠囊'
                    })
                }
            })
            .catch(error => {
                res.status(500).send(error);
            });

    } else {
        res.json({
            code: 500, massage: '輸入格式錯誤'
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
                            code: 200, massage: '寫入成功', response: [{
                                timestamp: payload[0], mac: payload[1], value: payload[2], raw: payload[3]
                            }]
                        })
                    })
            } else {
                res.json({
                    code: 500, massage: '目前沒有要量測氣密的膠囊'
                })
            }
        })
        .catch(error => {
            res.status(500).send(error);
        });
});


//新增RF儀器的數值
router.post('/rf', function (req, res, next) {
    if (isNumeric(req.body.value1)) {
        db.db_query('Select * From capsule.capsule_state_v Where rf = 1')
            .then(data => {
                if (data.response.length > 0) {
                    const payload = [moment().format(), data.response[0].mac, req.body.value1, req.body.value2, req.body.raw];
                    db.db_insert('INSERT INTO capsule.rf_data (timestamp, mac, value1, value2, raw) VALUES ($1, $2, $3, $4, $5)', payload)
                        .then(data2 => {
                            db.db_query('Select * From capsule.capsule Where mac = $1', [data.response[0].mac])
                                .then(data3 => {
                                    let threshold_rf = 0
                                    if (data3.response.length > 0) {
                                        threshold_rf = data3.response[0].threshold_rf
                                        console.log(threshold_rf)
                                        let pass_result = req.body.value1>threshold_rf
                                        db.db_update('UPDATE capsule.capsule SET test_rf = $2 WHERE mac = $1', [data.response[0].mac, pass_result])
                                            .then(up_res => {
                                                res.json({
                                                    code: 200,
                                                    massage: '寫入成功,比對成功',
                                                    response: [{
                                                        timestamp: payload[0],
                                                        mac: payload[1],
                                                        value1: payload[2],
                                                        value2: payload[3],
                                                        raw: payload[4],
                                                        threshold_rf: threshold_rf,
                                                        pass: pass_result
                                                    }]
                                                })
                                            })
                                    }else{
                                        res.json({
                                            code: 200,
                                            massage: '無此膠囊資料',
                                            response: [{
                                                timestamp: payload[0],
                                                mac: payload[1],
                                                value1: payload[2],
                                                value2: payload[3],
                                                raw: payload[4]
                                            }]
                                        })
                                    }

                                })
                        })
                } else {
                    res.json({
                        code: 500, massage: '目前沒有要量測RF的膠囊'
                    })
                }
            })
            .catch(error => {
                res.status(500).send(error);
            });
    } else {
        res.json({
            code: 500, massage: '輸入格式錯誤'
        })
    }
});

//新增RF儀器的數值
router.post('/rf_pcba', function (req, res, next) {
    if (isNumeric(req.body.value1)) {
        db.db_query('Select * From capsule.capsule_state_v Where rf_pcba = 1')
            .then(data => {
                if (data.response.length > 0) {
                    const payload = [moment().format(), data.response[0].mac, req.body.value1, req.body.value2, req.body.raw];
                    db.db_insert('INSERT INTO capsule.rf_pcba_data (timestamp, mac, value1, value2, raw) VALUES ($1, $2, $3, $4, $5)', payload)
                        .then(data2 => {
                            db.db_query('Select * From capsule.capsule Where mac = $1', [data.response[0].mac])
                                .then(data3 => {
                                    let threshold_rf_pcba = 0
                                    if (data3.response.length > 0) {
                                        threshold_rf_pcba = data3.response[0].threshold_rf_pcba
                                        let pass_result = req.body.value1>threshold_rf_pcba
                                        db.db_update('UPDATE capsule.capsule SET test_rf = $2 WHERE mac = $1', [data.response[0].mac, pass_result])
                                            .then(up_res => {
                                                res.json({
                                                    code: 200,
                                                    massage: '寫入成功,比對成功',
                                                    response: [{
                                                        timestamp: payload[0],
                                                        mac: payload[1],
                                                        value1: payload[2],
                                                        value2: payload[3],
                                                        raw: payload[4],
                                                        threshold_rf_pcba: threshold_rf_pcba,
                                                        pass: pass_result
                                                    }]
                                                })
                                            })
                                    }else{
                                        res.json({
                                            code: 200,
                                            massage: '無此膠囊資料',
                                            response: [{
                                                timestamp: payload[0],
                                                mac: payload[1],
                                                value1: payload[2],
                                                value2: payload[3],
                                                raw: payload[4]
                                            }]
                                        })
                                    }

                                })
                        })
                } else {
                    res.json({
                        code: 500, massage: '目前沒有要量測RF的PCBA'
                    })
                }
            })
            .catch(error => {
                res.status(500).send(error);
            });
    } else {
        res.json({
            code: 500, massage: '輸入格式錯誤'
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
                                code: 200, massage: '寫入成功', response: [{
                                    timestamp: payload[0], mac: payload[1], value: payload[2], raw: payload[3]
                                }]
                            })
                        })
                } else {
                    res.json({
                        code: 500, massage: '目前沒有要量測壓力的膠囊'
                    })
                }
            })
            .catch(error => {
                res.status(500).send(error);
            });
    } else {
        res.json({
            code: 500, massage: '輸入格式錯誤'
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
        db.db_query('SELECT * FROM capsule.capsule_state WHERE mac = $1 and state = 1 ORDER BY timestamp DESC Limit 1', [req.body.mac.toLowerCase()])
            .then(res_cs => {
                if(res_cs.response.length>0) {
                    let table = ''
                    if (res_cs.response[0].type.indexOf('pcba')>=0) {
                        table = '_pcba'
                    }
                    db.db_insert('INSERT INTO capsule.ble' + table + '_data (timestamp, mac, rssi, pressure, temperature, voltage, raw) VALUES ($1, $2, $3, $4, $5, $6, $7)', payload)
                        .then(data => {
                            res.json({
                                code: 200, massage: '寫入成功', response: [{
                                    isPcba: table !== '',
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
                }else{
                    res.json({
                        code: 500, massage: '沒有要寫入的藍芽裝置'
                    })
                }
            })
    } else {
        res.json({
            code: 500, massage: '輸入格式錯誤'
        })
    }
});

router.post('/upload_ble_csv', upload.single('file'), (req, res) => {
    csvToDb(__dirname + '/../uploads/' + req.file.filename)
    res.json({
        code: 200, msg: 'File successfully inserted!', file: req.file,
    })
})

router.post('/upload_ble_receiver_csv', upload.single('file'), (req, res) => {
    receiverCsvToDb(__dirname + '/../uploads/' + req.file.filename)
    res.json({
        code: 200, msg: 'File successfully inserted!', file: req.file,
    })
})

//取得壓力結果
router.post('/result/pressure', function (req, res, next) {

    let pressure_data = {}
    let ble_pressure_data = {}

    const payload = [req.body.mac, req.body.type];
    db.db_query('Select * From capsule.pressure_data Where mac=$1 and type=$2 order by timestamp desc Limit 5', payload)
        .then(data => {
            if (data.response.length == 5) {
                let lastTimestamp = data.response[0].timestamp;
                let firstTimestamp = data.response[4].timestamp;
                let duration = moment(lastTimestamp) - moment(firstTimestamp)
                if (duration >= 60000) {
                    res.json({
                        code: 500, massage: '資料量超過一分鐘'
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
                        timestamp: moment(firstTimestamp) + duration / 2, value: value_avg
                    }
                    res.json({
                        code: 200, massage: pressure_data
                    })
                }
                console.log(moment(lastTimestamp) - moment(firstTimestamp));
                res.json({
                    code: 200, massage: '資料量11不足'
                })
            } else {
                res.json({
                    code: 500, massage: '資料量不足'
                })
            }
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

router.get('/check/pressure/:type', function (req, res, next) {
    let end_time = moment(req.query.end_time).format()
    let mac = req.query.mac
    let threshold = req.query.threshold

    let device_data = []
    let device_avg = 0
    let device_starttime, device_endtime
    let ble_data = []
    let ble_avg = 0
    let ble_starttime, ble_endtime
    db.db_query('Select * From capsule.pressure_data Where mac = $1 AND type = $2 AND timestamp <= $3  ORDER BY timestamp DESC Limit 5', [mac, req.params.type, end_time])
        .then(res_pressure_data => {
            for (let i = 0; i < res_pressure_data.response.length; i++) {
                device_data.push(res_pressure_data.response[i].value)
            }
            if (res_pressure_data.response.length >= 5) {
                device_endtime = res_pressure_data.response[0].timestamp
                device_starttime = res_pressure_data.response[res_pressure_data.response.length - 1].timestamp
                if ((device_endtime - device_starttime) > 60 * 1000) {
                    res.json({
                        code: 200,
                        massage: 'DATA時間超過1分鐘無法比對',
                        response: [{
                            mac: mac,
                            end_time: end_time,
                            device_starttime: device_starttime,
                            device_endtime: device_endtime,
                            device_data: res_pressure_data.response
                        }]
                    })
                }
            } else {
                res.json({
                    code: 200, massage: 'DATA筆數不足無法比對', response: [{
                        mac: mac,
                        end_time: end_time,
                        device_data: res_pressure_data.response
                    }]
                })
            }
            const sum = device_data.reduce((a, b) => a + b, 0)
            device_avg = (sum / device_data.length) || 0

            db.db_query('Select * From capsule.ble_data Where mac = $1 AND timestamp <= $2 ORDER BY timestamp DESC Limit 5', [mac, device_endtime])
                .then(res_ble_data => {
                    if (res_ble_data.response.length >= 5) {
                        for (let i = 0; i < res_ble_data.response.length; i++) {
                            ble_data.push(res_ble_data.response[i].pressure)
                        }
                        ble_endtime = res_ble_data.response[0].timestamp
                        ble_starttime = res_ble_data.response[res_ble_data.response.length - 1].timestamp

                        const sum = ble_data.reduce((a, b) => a + b, 0)
                        ble_avg = (sum / ble_data.length) || 0

                        // console.log('threshold_pressure', threshold_pressure)
                        // console.log('device_data', device_data)
                        // console.log('device_avg', device_avg)
                        // console.log('device_starttime', device_starttime)
                        // console.log('device_endtime', device_endtime)
                        // console.log('diff_time', device_endtime - device_starttime)
                        // console.log('ble_data', ble_data)
                        // console.log('ble_avg', ble_avg)
                        // console.log('device_starttime', ble_starttime)
                        // console.log('device_endtime', ble_endtime)
                        // console.log('diff_time', ble_endtime - ble_starttime)

                        if ((ble_endtime - ble_starttime) > 60 * 1000) {
                            res.json({
                                code: 200,
                                massage: 'BLE時間超過1分鐘無法比對',
                                response: [{
                                    mac: mac,
                                    end_time: end_time,
                                    device_starttime: device_starttime,
                                    device_endtime: device_endtime,
                                    ble_starttime: ble_starttime,
                                    ble_endtime: ble_endtime,
                                    ble_data: res_ble_data.response
                                }]
                            })
                        }

                        const pass_result = Math.abs(ble_avg - device_avg) < threshold

                        res.json({
                            code: 200, massage: '比對成功', response: [{
                                mac: mac,
                                end_time: end_time,
                                device_starttime: device_starttime,
                                device_endtime: device_endtime,
                                threshold: threshold,
                                device_data: res_pressure_data.response,
                                device_avg: device_avg,
                                ble_data: res_ble_data.response,
                                ble_avg: ble_avg,
                                pass: pass_result
                            }]
                        })

                    } else {
                        res.json({
                            code: 200, massage: 'BLE筆數不足無法比對', response: [{
                                mac: mac,
                                end_time: end_time,
                                device_starttime: device_starttime,
                                device_endtime: device_endtime,
                                device_data: res_pressure_data.response,
                                ble_data: res_ble_data.response,
                            }]
                        })
                    }
                })


        })

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
