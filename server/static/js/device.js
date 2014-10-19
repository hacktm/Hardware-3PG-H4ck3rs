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

        augmentDOM: function(dom){
            // should be implemented by children
        },

        getDOM: function (callback) {
            $.get("/static/partials/dashboardItem_" + this.deviceInfo.type + ".html", $.proxy(function (template) {
                this.dom = $(Mustache.render(template, this.deviceInfo));

                this.dom.find(".deviceName .fa-times").click($.proxy(this.remove, this));

                this.augmentDOM();

                callback.call(this, this.dom);
            }, this));
        }
    };


    function ToggleDevice(deviceInfo)
    {
        this.deviceInfo = deviceInfo;
        this.dom = null;
    }

    $.extend(ToggleDevice.prototype, Device.prototype);

    ToggleDevice.prototype = $.extend(ToggleDevice.prototype, {
        toggleState: function () {
            var state = $("[name=state]:checked").val();

            $.ajax({
                url: "/api/sendComman/" + this.deviceInfo.id + "/" + state,
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
            });
        },

        augmentDOM: function(){
            this.dom.find("[name=state]").on("change", $.proxy(this.toggleState, this));
        }
    });

    function TempDevice(deviceInfo)
    {
        this.deviceInfo = deviceInfo;
        this.dom = null;

    }

    $.extend(TempDevice.prototype, Device.prototype);

    TempDevice.prototype = $.extend(TempDevice.prototype, {
        updateTemp: function () {
            console.log("Temp!");
        }
    });


    ns.ToggleDevice = ToggleDevice;
    ns.TempDevice = TempDevice;
}(io.pible));
