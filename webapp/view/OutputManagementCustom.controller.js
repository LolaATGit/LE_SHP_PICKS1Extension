jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
sap.ui.controller("i2d.le.delivery.pick.s1.LE_SHP_PICKS1Extension.view.OutputManagementCustom", {
	//    onInit: function () {
	//        var e = sap.ui.getCore().createComponent({
	//            name: "sap.ssuite.fnd.om.outputcontrol.outputitems",
	//            id: this.createId("DeliveryPickOutputComponent"),
	//            settings: { editMode: "D" }
	//        });
	//        this.byId("PickDeliveryOutputContainer").setComponent(e);
	//        this.oRouter.getRoute("output_header").attachMatched(this.onRoutePatternMatched, this);
	//        this.oRouter.getRoute("output_item").attachMatched(this.onRoutePatternMatched, this);
	//        if (!jQuery.support.touch) {
	//            this.getView().addStyleClass("sapUiSizeCompact");
	//        }
	//        this.setHeaderFooterOptions(this.getHeaderFooter());
	//    },
	//    onRoutePatternMatched: function (e) {
	//        var t;
	//        if (e.getParameter("name") === "output_header") {
	//            if (e.getParameter("arguments").DeliveryId) {
	//                t = sap.ui.component(this.byId("PickDeliveryOutputContainer").getComponent());
	//                t.setObjectId(e.getParameter("arguments").DeliveryId);
	//                t.setObjectType("OUTBOUND_DELIVERY");
	//                t.refresh();
	//            }
	//        } else if (e.getParameter("name") === "output_item") {
	//            if (e.getParameter("arguments").DeliveryItemId) {
	//                t = sap.ui.component(this.byId("PickDeliveryOutputContainer").getComponent());
	//                t.setObjectId(e.getParameter("arguments").DeliveryItemId);
	//                t.setObjectType("OUTBOUND_DELIVERY_ITEM");
	//                t.refresh();
	//            }
	//        }
	//    },
	//    getHeaderFooter: function () {
	//        var e = { sI18NFullscreenTitle: "PRINT_TITLE" };
	//        return e;
	//    }
});