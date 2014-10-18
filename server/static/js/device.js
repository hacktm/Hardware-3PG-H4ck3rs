(function(ns, undefined) {
    "use strict";

    function Device(deviceInfo) {
        this.deviceInfo = deviceInfo;
        this.dom = null;
    }

    Device.prototype = {
        remove: function () {
            $.ajax({
                url: "/api/removeDevice/" + this.deviceInfo.id,
                type: "delete",
                success: $.proxy(function () {
                    this.dom.remove();
                }, this)
            });

        },

        getDOM: function (callback) {
            $.get("/static/partials/dashboardItem.html", $.proxy(function (template) {
                this.dom = $(Mustache.render(template, this.deviceInfo));
                this.dom.find(".deviceName .fa-times").click($.proxy(this.remove, this));

                callback.call(this, this.dom);
            }, this));
        }
    };

    ns.Device = Device;
}(io.pible));
