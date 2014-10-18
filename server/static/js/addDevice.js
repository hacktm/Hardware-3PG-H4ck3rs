(function (ns, undefined) {
    "use strict";

    var selectedDevice;
    var devices;

    var modal = $("#addDeviceModal");
    var modalError = $("#modalError");
    var modalSearchingIndicator = $("#addDeviceModal #searchingIndicator");
    var deviceList = $("#deviceList tbody");
    var deviceTable = $("#deviceList table");
    var addDeviceBtn = $("#addDeviceBtn");

    function handleDeviceListChange()
    {
        addDeviceBtn.enable();
        selectedDevice = devices[$(this).val()];
    }

    function showError(text) {
        modalError.find("span").html(text);
        modalError.show();
    }

    function handleAddDevice()
    {
        $.ajax({
            url: "/api/addDevice",
            type: "post",
            contentType: "application/json",
            data: JSON.stringify(selectedDevice),
            success: function (res) {
                modal.modal('hide');
            },
            error: function (res) {
                if (res.responseJSON.messsage)
                    showError(res.responseJSON.messsage);
                else
                    showError("Unknown server error");
            }
        })
    }

    function showDeviceList()
    {
        modalSearchingIndicator.show();
        deviceTable.hide();
        modalError.hide();

        modal.modal();

        $.ajax({
            url: "/api/discover",
        }).success(function (res) {
            devices = res.devices;

            $.get("/static/partials/deviceListRow.html", function (template) {
                deviceList.empty();
                $.each(devices, function (index, device) {
                    var templateInfo =  _.clone(device);
                    templateInfo.index = index;
                    deviceList.append(Mustache.render(template, templateInfo));
                });

                modalSearchingIndicator.hide();
                deviceTable.show();
            });
        });
    }

    $(document).on("change", "[name='selectedDevice']", handleDeviceListChange);
    addDeviceBtn.click(handleAddDevice);

    $(".addDeviceBtn").click(showDeviceList);

})(io.pible);
