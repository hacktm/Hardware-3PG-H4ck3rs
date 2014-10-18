(function(ns, undefined) {
    "use strict";

    var dashboard = $("#dashboard #dashboardItems");
    var loadingIndicator = $("#dashboard .searchingIndicator");
    var emptyDashboardWidget = $("#emptyDashboard");

    var devices = [];

    ns.updateDeviceList = function () {
        $.ajax({
            url: "/api/deviceList",
            success: function (res) {
                loadingIndicator.hide();
                if (res.devices.length)
                {
                    if (res.devices.length != devices.length)
                    {
                        devices = _.clone(res.devices);
                        dashboard.empty();

                        $.each(res.devices, function (index, device) {
                            $.get("/static/partials/dashboardItem.html", function (template) {
                                dashboard.append(Mustache.render(template, device));
                            });
                        });
                    }
                }
                else
                {
                    dashboard.hide();
                    emptyDashboardWidget.show();
                }

            }
        });
    };

    setInterval(ns.updateDeviceList, 1000);
}(io.pible));
