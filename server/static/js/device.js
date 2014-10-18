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

        toggleState: function () {
            var state = $("[name=state]:checked").val();

            $.ajax({
                url: "/api/setState/" + this.deviceInfo.id + "/" + state,
                type: "post",
                success: $.proxy(function (res) {
                    if (state == "on")
                    {
                        this.dom.find(".onBtn").removeClass("btn-default").addClass("btn-primary");
                        this.dom.find(".offBtn").removeClass("btn-danger").addClass("btn-default");
                    }
                    else
                    {
                        this.dom.find(".onBtn").removeClass("btn-primary").addClass("btn-default");
                        this.dom.find(".offBtn").removeClass("btn-default").addClass("btn-danger");
                    }
                }, this)
            })
        },

        getDOM: function (callback) {
            $.get("/static/partials/dashboardItem.html", $.proxy(function (template) {
                this.dom = $(Mustache.render(template, this.deviceInfo));

                this.dom.find(".deviceName .fa-times").click($.proxy(this.remove, this));
                this.dom.find("[name=state]").on("change", $.proxy(this.toggleState, this));

                callback.call(this, this.dom);
            }, this));
        }
    };

    ns.Device = Device;
}(io.pible));
