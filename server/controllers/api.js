var express = require('express');
var router = express.Router();
var _ = require('lodash');

var fs = require('fs');

var mockDevices = [
    {
        "manufacturer": "Pible",
        "name": "Uber",
        "id": "00:00:00:00:00"
    },

    {
        "manufacturer": "Pible",
        "name": "Mini",
        "id": "00:00:00:00:01"
    },

    {
        "manufacturer": "Pible",
        "name": "Giugiuc",
        "id": "00:00:00:00:02"
    },
];

var DEVICES_FILE = "devices.json";
var SIMULATED_DELAY = 1000;

router.get("/discover", function (req, res) {
    setTimeout(function () {
        res.send({status: "ok", devices: mockDevices  });
    }, SIMULATED_DELAY);
});

router.post("/addDevice", function (req, res) {

    var devices;
    var device = req.body;

    if (!device)
    {
        res.status(400).send({status: "error", messsage: "Device not specified"});
        return;
    }

    fs.readFile(DEVICES_FILE, function (err, data) {

        if (!err)
        {
            devices = JSON.parse(data);

            if (!_.find(devices, function (item) {return item.id == device.id;}))
            {
                devices.push(device);

                fs.writeFile(DEVICES_FILE, JSON.stringify(devices), function (err) {
                    if (!err)
                        res.send({status: "ok", added: device});
                    else
                        res.status(500).send({status: "error", message:"Can't write device to file"});
                });
            }
            else
            {
                res.status(400).send({status: "error", messsage: "Device already added"});
                return;
            }
        }
        else
            res.status(500).send({status: "error", messsage: "Can't access devices file"});
    });
});

router.get("/deviceList", function (req, res) {
    fs.readFile(DEVICES_FILE, function (err, data) {
        if (!err)
        {
            res.send({status: "ok", devices: JSON.parse(data) });
        }
        else
            res.status(500).send({status: "error", messsage: "Can't read devices from list"});
    });
});


router.get("/state/:deviceId", function (req, res) {
    setTimeout(function () {
        res.send({status:"ok", device: req.params.deviceId, state: "on"});
    }, SIMULATED_DELAY);
});

router.post("/state/:deviceId/:state", function (req, res) {
    setTimeout(function () {
        res.send({status: "ok", device: req.params.deviceId, state: req.params.state});
    }, SIMULATED_DELAY);
});


module.exports = router;