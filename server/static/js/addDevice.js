(function (ns, undefined) {
    "use strict";

    var selectedDevice;
    var devices;

    var modal = $("#addDeviceModal");
    var modalError = $("#modalError");
    var loadingIndicator = $("#addDeviceModal .searchingIndicator");
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
        var index = $("[name=selectedDevice]:checked").val();
        var device = devices[index];
        device.type = $("#deviceType_" + index).val();

        $.ajax({
            url: "/api/addDevice",
            type: "post",
            contentType: "application/json",
            data: JSON.stringify(selectedDevice),
            success: function (res) {
                ns.updateDeviceList();
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
        loadingIndicator.show();
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

                loadingIndicator.hide();
                deviceTable.show();
            });
        });
    }

    $(document).on("change", "[name='selectedDevice']", handleDeviceListChange);
    addDeviceBtn.click(handleAddDevice);
    $("#refreshDeviceBtn").click(showDeviceList);

    $(".addDeviceBtn").click(showDeviceList);

})(io.pible);
