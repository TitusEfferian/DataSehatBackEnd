const mongoose = require('mongoose');
const config = require('../config/database');

// Record Schema
const RecordSchema = mongoose.Schema({
    timestamp: {
        type: Number
    },
    hash: {
        type: String
    },
    albumin: {
        type: String
    },
    blood_group: {
        type: String
    },
    blood_pressure: {
        type: String
    },
    chest_x_ray: {
        type: String
    },
    ears: {
        type: String
    },
    eyes: {
        type: String
    },
    haemoglobin: {
        type: String
    },
    heart: {
        type: String
    },
    height: {
        type: String
    },
    lungs: {
        type: String
    },
    nose: {
        type: String
    },
    sugar: {
        type: String
    },
    skin: {
        type: String
    }
});

const Record = module.exports = mongoose.model('Record', RecordSchema);

module.exports.addRecord = (newRecord, callback) => {
    newRecord.save(callback);
}

module.exports.getRecordByHash = (hash, callback) => {
    Record.findOne({hash: hash}, callback);
}
