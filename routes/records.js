const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const Record = require('../models/record');
const User = require('../models/user');
const nem = require("nem-sdk").default;
const verify = require('../verify/auth');
const endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

// Add medical records 
router.post('/', verify.auth, (req, res, next) => {
    const newRecord = new Record({
        timestamp: req.body.timestamp,
        albumin: req.body.albumin,
        blood_group: req.body.blood_group,
        blood_pressure: req.body.blood_pressure,
        chest_x_ray: req.body.chest_x_ray,
        ears: req.body.ears,
        eyes: req.body.eyes,
        haemoglobin: req.body.haemoglobin,
        heart: req.body.heart,
        height: req.body.height,
        lungs: req.body.lungs,
        nose: req.body.nose,
        sugar: req.body.sugar,
        skin: req.body.skin
    });

    new Promise((resolve, reject) => {
        // Get user info
        User.getUserById(req.data._id, (err, user) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                // Send token to store hash in blokchain
                let common = nem.model.objects.create('common')('devcamp123', '9060cfbc84379d4f43ea6c007e88be8de22d2270f348712ab489176d6644a980');
                let hash = crypto.createHmac('sha256', user.secret).update(JSON.stringify(newRecord)).digest('hex');
                let transferTransaction = nem.model.objects.create('transferTransaction')(user.address, 1, hash);
                let preparedTransaction = nem.model.transactions.prepare('transferTransaction')(common, transferTransaction, nem.model.network.data.testnet.id);
                nem.model.transactions.send(common, preparedTransaction, endpoint).then(res => {
                    newRecord.hash = hash;
                    // Add new medical record
                    Record.addRecord(newRecord, (err) => {
                        if (err) {
                            console.log(err);
                            reject(err);
                        } else {
                            resolve();
                        }
                    })
                }).catch(err => {
                    console.log(err);
                    reject(err);
                })
            }
        });
    }).then(() => {
        res.json({
            success: true,
            message: 'Successfully add new record.'
        });
    }).catch((err) => {
        console.log(err);
        res.json({
            success: false,
            message: 'Failed to add new record.'
        });
    })
});

// Get user latest medical record
router.get('/', verify.auth, (req, res) => {
    new Promise((resolve, reject) => {
        // Get user info
        User.getUserById(req.data._id, (err, user) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                // Check user blockchain history
                nem.com.requests.account.transactions.incoming(endpoint, user.address).then(res => {
                    let message = nem.utils.format.hexMessage(res.data[0].transaction.message)
                    Record.getRecordByHash(message, (err, record) => {
                        if (err) {
                            console.log(err);
                            reject(err);
                        } else {
                            if (record) {
                                previousRecord = {
                                    _id: record.id,
                                    timestamp: record.timestamp,
                                    albumin: record.albumin,
                                    blood_group: record.blood_group,
                                    blood_pressure: record.blood_pressure,
                                    chest_x_ray: record.chest_x_ray,
                                    ears: record.ears,
                                    eyes: record.eyes,
                                    haemoglobin: record.haemoglobin,
                                    heart: record.heart,
                                    height: record.height,
                                    lungs: record.lungs,
                                    nose: record.nose,
                                    sugar: record.sugar,
                                    skin: record.skin
                                }
                                let hash = crypto.createHmac('sha256', user.secret).update(JSON.stringify(previousRecord)).digest('hex');
                                if (message == hash) resolve(record) 
                                else {
                                    nem.com.requests.account.transactions.incoming(endpoint, user.address).then(res => {
                                        reject("The system still verifying the data, please try again in few minutes.")
                                    }).catch(() => {
                                        reject("WARNING! Medical record is not valid, contact authority immediately!")
                                    });
                                }
                            } else reject("You have no medical record yet.")
                        }
                    });
                }).catch((err) => {
                    console.log(err);
                    reject("You have no medical record yet.")
                })
            }
        });
    }).then((record) => {
        res.json({
            success: true,
            message: 'Medical record valid',
            data: {
                record
            }
        });
    }).catch((err) => {
        console.log(err);
        res.json({
            success: false,
            message: err
        });
    })
});

module.exports = router;