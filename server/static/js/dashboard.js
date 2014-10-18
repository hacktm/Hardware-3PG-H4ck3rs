(function(ns, undefined) {
    "use strict";

    ns.updateDeviceList = function () {
        $.ajax({
            url: "/api/deviceList",
            success: function (res) {
                console.log(res);
            }
        })
    };

    setInterval(ns.updateDeviceList, 1000);
}(io.pible));
