jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("i2d.le.delivery.pick.s1.util.serialNumberHelper");
sap.ui.controller("i2d.le.delivery.pick.s1.LE_SHP_PICKS1Extension.view.S2Custom", {
	//    onInit: function () {
	//        this.oUtil = i2d.le.delivery.pick.s1.util.util;
	//        this.oMessageHandler = i2d.le.delivery.pick.s1.util.messageHandler;
	//        this.oValueHelpHelper = i2d.le.delivery.pick.s1.util.valueHelpHelper;
	//        this.oSerialNumberHelper = i2d.le.delivery.pick.s1.util.serialNumberHelper;
	//        this.bDirectLoad = true;
	//        this.oDeliveryHeader = {};
	//        this.oErrorHandler = i2d.le.delivery.pick.s1.util.errorHandling;
	//        this.oUtil.setFieldControlModel(this.getView());
	//        if (!jQuery.support.touch) {
	//            this.getView().addStyleClass("sapUiSizeCompact");
	//        }
	//        var e = new sap.ui.model.json.JSONModel();
	//        this.getView().setModel(e, "actionMessageModel");
	//        this.oRouter.getTarget("DeliveryItem").attachDisplay(this.onTargetMatched, this);
	//    },
	//    alterUpDownIcons: function () {
	//        if (this._oControlStore.oDownButton) {
	//            this._oControlStore.oDownButton.setIcon("sap-icon://navigation-up-arrow");
	//            this._oControlStore.oDownButton.setTooltip(this.oUtil.getBundleText(this, "UP"));
	//        }
	//        if (this._oControlStore.oUpButton) {
	//            this._oControlStore.oUpButton.setIcon("sap-icon://navigation-down-arrow");
	//            this._oControlStore.oUpButton.setTooltip(this.oUtil.getBundleText(this, "DOWN"));
	//        }
	//    },
	//    onTargetMatched: function (e) {
	//        this.S2RouteMatched("/" + e.getParameter("data").contextPath);
	//    },
	//    S2RouteMatched: function (e) {
	//        var t = this.getView();
	//        this.aChangedItems = [];
	//        if (t.getModel().getProperty(e)) {
	//            var i = new sap.ui.model.Context(t.getModel(), e);
	//            this.oDeliveryHeader = this.getView().getModel().getProperty("/DeliveryHeader('" + i.getProperty("DeliveryID") + "')", undefined, true);
	//            this.refreshScreen(i);
	//            this.bDirectLoad = false;
	//            this.setHeaderFooterOptions(this.getHeaderFooter());
	//            this.alterUpDownIcons();
	//        } else {
	//            this.loadData(e);
	//        }
	//    },
	//    getItemIndex: function () {
	//        var e = 0;
	//        var t = this.oDeliveryHeader.DeliveryItems.results || [];
	//        var i = this.getView().getBindingContext().getProperty("ItemID");
	//        for (e = 0; e < t.length; e++) {
	//            if (t[e].ItemID === i) {
	//                return e;
	//            }
	//        }
	//    },
	//    refreshScreen: function (e) {
	//        var t = this.getView();
	//        this.aChangedItems = this.oUtil.getChangedItems();
	//        var i = e.getModel().getProperty(e.getPath()).SerialNrRelevance;
	//        if (i === "X") {
	//            this.initializeSerialNumberTable(e);
	//            this.byId("massSelectButton").setEnabled(true);
	//            this.byId("sortSNTableButton").setEnabled(true);
	//        } else {
	//            var a = this.byId("S2SerialNumberTable");
	//            a.destroyItems();
	//            this.byId("massSelectButton").setEnabled(false);
	//            this.byId("sortSNTableButton").setEnabled(false);
	//            var s = this.oUtil.getBundleText(this, "LABEL_SER_NUM_TABLE") + " (0)";
	//            a.getHeaderToolbar().getTitleControl().setText(s);
	//        }
	//        this.getView().setBindingContext(e);
	//        this.setupValueLists();
	//        var r;
	//        var n = this.oUtil.getChangedItemIndex(e.getPath(), this.aChangedItems);
	//        if (n !== undefined) {
	//            r = this.aChangedItems[n].data;
	//        } else {
	//            r = t.getModel().getProperty(t.getBindingContext().getPath());
	//        }
	//        if (this.getView().getModel("FieldControl").getData().InputEditable) {
	//            this.getChangeableFields().forEach(function (e) {
	//                var t = this.byId(e);
	//                this.oUtil.setChangedProperty(t, r);
	//            }, this);
	//            this.updateConversionRate();
	//            this.updateBaseQuantity();
	//        }
	//        this.aChangedItems = jQuery.extend(true, [], this.oUtil.getChangedItems());
	//    },
	//    getChangeableFields: function () {
	//        var e = [
	//            "S2DeliveryQuantityInBaseText",
	//            "S2DeliveryQuantityInSalesUoMInput",
	//            "S2PickedQuantityInput",
	//            "S2DeliveryQuantityUoMCodeInput",
	//            "S2StorageLocationCodeInput",
	//            "S2PickedQuantityUoMCodeInput",
	//            "S2DeliveryStorageLocationText"
	//        ];
	//        return e;
	//    },
	//    loadData: function (e) {
	//        this.getView().bindElement(e);
	//        this.getView().getElementBinding().attachEventOnce("dataReceived", this.onDataLoaded, this);
	//    },
	//    onDataLoaded: function () {
	//        this.bDirectLoad = true;
	//        this.refreshScreen(this.getView().getBindingContext());
	//        if (!this.oDeliveryHeader.DeliveryID) {
	//            var e = "/DeliveryHeader('" + this.getView().getBindingContext().getProperty("DeliveryID") + "')";
	//            var t = {
	//                success: jQuery.proxy(this.onHeaderManuallyLoadedSuccess, this),
	//                error: jQuery.proxy(this.onHeaderManuallyLoadedError, this),
	//                urlParameters: "$expand=DeliveryItems"
	//            };
	//            if (!this.BusyDialog) {
	//                this.BusyDialog = sap.ui.xmlfragment(this.createId("BusyDialog"), "i2d.le.delivery.pick.s1.fragments.BusyDialog", this);
	//            }
	//            this.BusyDialog.open();
	//            this.getView().getModel().read(e, t);
	//        } else {
	//            this.setHeaderFooterOptions(this.getHeaderFooter());
	//        }
	//    },
	//    onHeaderManuallyLoadedSuccess: function (e) {
	//        this.BusyDialog.close();
	//        this.oDeliveryHeader = e;
	//        if (this.oDeliveryHeader.DeliveryGoodsIssueStatusCode === "C" || this.oDeliveryHeader.DeliveryGoodsIssueStatusCode === "") {
	//            this.oUtil.setFieldControlProperty("InputEditable", false);
	//            this.oUtil.setFieldControlProperty("PickedQuantityEditable", false);
	//        }
	//        this.setHeaderFooterOptions(this.getHeaderFooter());
	//    },
	//    onHeaderManuallyLoadedError: function (e) {
	//        this.BusyDialog.close();
	//        this.oErrorHandler._handleError(e, this);
	//    },
	//    setupValueLists: function () {
	//        var e, t, i;
	//        var a = this.getView();
	//        var s = this.byId("S2DeliveryQuantityUoMCodeInput");
	//        var r = this.byId("S2StorageLocationCodeInput");
	//        i2d.le.delivery.pick.s1.util.suggestionHelper.registerSuggestForMaterialUoMCode(s);
	//        e = new sap.ui.model.json.JSONModel({ PlantCode: a.getBindingContext().getProperty("PlantCode") });
	//        t = [
	//            {
	//                labelPath: "/#VL_SH_H_T001L_OLD_SHP_ODATA/LGORT/@sap:label",
	//                path: "LGORT"
	//            },
	//            {
	//                labelPath: "/#VL_SH_H_T001L_OLD_SHP_ODATA/LGOBE/@sap:label",
	//                path: "LGOBE"
	//            }
	//        ];
	//        e = [{
	//                path: "WERKS",
	//                value: a.getBindingContext().getProperty("PlantCode")
	//            }];
	//        i = "VL_SH_H_T001L_OLD_SHP_ODATA";
	//        i2d.le.delivery.pick.s1.util.suggestionHelper.registerInputSuggestion(r, t, "20%", i, e);
	//    },
	//    initializeSerialNumberTable: function (e) {
	//        var t = this.byId("S2SerialNumberTable");
	//        t.destroyItems();
	//        t.setBindingContext(e);
	//        var i = e.getModel();
	//        var a = e.sPath;
	//        var s = [];
	//        var r = this.oUtil.getChangedItems();
	//        var n = this.oSerialNumberHelper.getCurrentDeliveryQuantity(r, i, a);
	//        var o;
	//        s = this.oSerialNumberHelper.getChangedSerialNumbersForItem(r, a);
	//        if (Array.isArray(s)) {
	//            o = n - s.length;
	//            this.oSerialNumberHelper.snTableFactory(s, t, o, this);
	//        } else {
	//            t.setBusy(true);
	//            i.read(a + "?$expand=SerialNumbers", {
	//                async: true,
	//                success: jQuery.proxy(this.onSNReadSuccess, this),
	//                error: this.onSNReadError
	//            });
	//        }
	//    },
	//    onDeliveryHeaderReadSuccess: function (e, t) {
	//        this.oDeliveryHeader = e;
	//        var i = this.byId("S2SerialNumberTable");
	//        i.setBusy(false);
	//        var a = i.getBindingContext();
	//        var s = a.getModel();
	//        var r = a.sPath;
	//        var n = this.oUtil.getChangedItems();
	//        var o = this.oSerialNumberHelper.getCurrentDeliveryQuantity(n, s, r);
	//        var l = this.oDataSerialNumbers.SerialNumbers.results;
	//        var d = o - l.length;
	//        i2d.le.delivery.pick.s1.util.serialNumberHelper.snTableFactory(l, i, d, this);
	//    },
	//    onSNReadSuccess: function (e, t) {
	//        this.oDataSerialNumbers = e;
	//        this.getView().getModel().read("DeliveryHeader('" + e.DeliveryID + "')", {
	//            async: true,
	//            success: jQuery.proxy(this.onDeliveryHeaderReadSuccess.bind(this)),
	//            error: this.onSNReadError
	//        });
	//    },
	//    onSNReadError: function (e) {
	//        var t = this.byId("S2SerialNumberTable");
	//        t.setBusy(false);
	//    },
	//    handleUoMCodeChange: function (e) {
	//        var t;
	//        var i = e.getSource();
	//        var a = this.oUtil.handleUoMCodeChange(i, this.byId("S2DeliveryQuantityInSalesUoMInput"), "MEINH");
	//        if (a || a === "") {
	//            if (a.MEINH) {
	//                t = a.MEINH;
	//            } else {
	//                t = a;
	//            }
	//            i.setValue(t);
	//            this.aChangedItems = this.oUtil.handleItemChange(i, t, "value", this.aChangedItems, this.getView().getModel(), true);
	//            this.changeDependentUoMCodeFields(a);
	//            this.updateBaseQuantity();
	//        }
	//    },
	//    handleStorageLocationChange: function (e) {
	//        var t = e.getSource();
	//        var i = e.getParameter("value");
	//        if (!t.getModel("SuggestModel")) {
	//            t.data("retriggerChange", true);
	//            t.fireSuggest();
	//            return;
	//        }
	//        var a = this.oUtil.validateChangedCode(t, i, "LGORT", "ERROR_INVALID_VH", "ERROR_INVALID_VH_SHORT");
	//        if (a) {
	//            i = a.LGORT;
	//            t.setValue(i);
	//            this.aChangedItems = this.oUtil.handleItemChange(t, i, "value", this.aChangedItems, this.getView().getModel(), true);
	//            this.byId("S2DeliveryStorageLocationText").setValue(a.LGOBE);
	//            var s = this.oUtil.getChangedItemIndex(t.getBindingContext().getPath(), this.aChangedItems);
	//            this.aChangedItems[s].data.StorageLocationName = a.LGOBE;
	//        }
	//    },
	//    handleAmountChange: function (e) {
	//        var t = e.getSource();
	//        var i = this.oUtil.getBundleText(this, "ERROR_INVALID_NUMBER", [t.getValue()]);
	//        var a = this.oUtil.getBundleText(this, "ERROR_INVALID_NUMBER_SHORT");
	//        var s = this.byId("S2SerialNumberTable");
	//        if (s.getBusy()) {
	//            s.data("retriggerAmountChange", t);
	//        } else {
	//            var r = this.oUtil.handleQuantityChange(t, e.getParameter("value"), i, a);
	//            var n = this.byId("S2DeliveryQuantityUoMCodeInput");
	//            if (!r) {
	//                return;
	//            }
	//            this.aChangedItems = this.oUtil.handleItemChange(t, r, "value", this.aChangedItems, this.getView().getModel(), true);
	//            if (t.getId() === this.createId("S2DeliveryQuantityInSalesUoMInput")) {
	//                this.oUtil.validateEmptyUoM(t.getValue(), n);
	//                if (n.getValue() === "" && t.getValue() === "0") {
	//                    this.oMessageHandler.removeMessage(n);
	//                }
	//                this.updateBaseQuantity();
	//                var o = s.getBindingContext();
	//                var l = o.getModel().getProperty(o.getPath()).SerialNrRelevance;
	//                if (l === "X") {
	//                    this.oSerialNumberHelper.updateSNTable(this);
	//                }
	//            }
	//            this.checkPickedQuantity();
	//        }
	//        if (t.getBindingPath("value") === "PickedQuantity") {
	//            this.getView().getModel().setProperty(t.getBindingContext().getPath() + "/PickedQuantity", t.getValue());
	//        }
	//    },
	//    changeDependentUoMCodeFields: function (e) {
	//        var t = this.byId("S2PickedQuantityUoMCodeInput");
	//        t.setValue(e.MEINH);
	//        t.fireChange({
	//            value: e.MEINH,
	//            newValue: e.MEINH
	//        });
	//        var i = i2d.le.delivery.pick.s1.util.formatter.formatConcatenateQuantityUoM(e.UMREN, e.MEINH);
	//        var a = i2d.le.delivery.pick.s1.util.formatter.formatConcatenateQuantityUoM(e.UMREZ, this.getView().getBindingContext().getProperty("DeliveryQuantityBaseUoMCode"));
	//        this.byId("S2DeliveryItemConversionRateDivisor").setValue(i);
	//        this.byId("S2DeliveryItemConversionRateFactor").setValue(a);
	//        var s = this.oUtil.getChangedItemIndex(t.getBindingContext().getPath(), this.aChangedItems);
	//        this.aChangedItems[s].data.SalesToBaseFactor = e.UMREZ;
	//    },
	//    updateConversionRate: function () {
	//        if (this.aChangedItems.length === 0) {
	//            return;
	//        }
	//        var e;
	//        var t = this.oUtil.getChangedItemIndex(this.getView().getBindingContext().getPath(), this.aChangedItems);
	//        if (t !== undefined) {
	//            e = this.aChangedItems[t].data;
	//        } else {
	//            e = this.getView().getModel().getProperty(this.getView().getBindingContext().getPath());
	//        }
	//        var i = i2d.le.delivery.pick.s1.util.formatter.formatConcatenateQuantityUoM(e.SalesToBaseDivisor, e.DeliveryQuantitySalesUoMCode);
	//        var a = i2d.le.delivery.pick.s1.util.formatter.formatConcatenateQuantityUoM(e.SalesToBaseFactor, e.DeliveryQuantityBaseUoMCode);
	//        this.byId("S2DeliveryItemConversionRateDivisor").setValue(i);
	//        this.byId("S2DeliveryItemConversionRateFactor").setValue(a);
	//    },
	//    updateBaseQuantity: function () {
	//        var e;
	//        var t = this.byId("S2DeliveryQuantityInBaseText");
	//        var i = this.oUtil.getChangedItemIndex(this.getView().getBindingContext().getPath(), this.aChangedItems);
	//        if (i === undefined) {
	//            return;
	//        }
	//        var a = this.aChangedItems[i].data;
	//        var s = parseFloat(a.SalesToBaseDivisor, 10);
	//        var r = parseFloat(a.SalesToBaseFactor, 10);
	//        var n = parseFloat(a.DeliveryQuantityInSalesUoM, 10);
	//        if (!s && !r) {
	//            return;
	//        }
	//        e = (n / s * r).toString();
	//        t.setValue(t.getBindingInfo("value").formatter.call(t, e));
	//        a.DeliveryQuantityInBaseUoM = e;
	//    },
	//    onRegisterVHDialog: function (e) {
	//        this.oValueHelpHelper.onRegisterVHDialog(e, this);
	//    },
	//    handleS2Cancel: function () {
	//        if (this.oUtil.getRequestLoading()) {
	//            jQuery.sap.delayedCall(100, this, this.navBack);
	//            return;
	//        }
	//        var e = this.byId("S2SerialNumberTable");
	//        if (e.getBusy()) {
	//            e.setBusy(false);
	//            e.data("processingCanceled", true);
	//        }
	//        if (this.aChangedItems.length > 0 && JSON.stringify(this.aChangedItems) !== JSON.stringify(this.oUtil.getChangedItems()) || this.oMessageHandler.checkMessages(undefined, false)) {
	//            this.oUtil.showCancelPopup.call(this, "WARNING_DIALOG_TEXT", "WARNING_DIALOG_TITLE", this.closeCancelPopup);
	//        } else {
	//            this.navBack();
	//        }
	//    },
	//    closeCancelPopup: function (e) {
	//        if (e === sap.m.MessageBox.Action.OK) {
	//            this.aChangedItems = this.oUtil.getChangedItems();
	//            this.oMessageHandler.clearMessages();
	//            this.navBack();
	//        }
	//    },
	//    handleS2OK: function () {
	//        var e = this.byId("S2SerialNumberTable");
	//        if (this.oSerialNumberHelper.getTableStatus(e) === false) {
	//            sap.m.MessageBox.error(this.oUtil.getBundleText(this, "ERROR_INVALID_SN"), { styleClass: "sapUiSizeCompact" });
	//            return;
	//        }
	//        var t = this.oSerialNumberHelper.getSNArrayFromTable(e);
	//        var i = t.length;
	//        var a = this.oSerialNumberHelper.removeDuplicateObjectsFromArray(t, "SerialNumberID", false);
	//        if (a.length < i) {
	//            this.oSerialNumberHelper.updateSNTable(this);
	//            return;
	//        }
	//        this.navBack();
	//    },
	//    checkPickedQuantity: function () {
	//        var e = this.oUtil.getChangedItemIndex(this.getView().getBindingContext().getPath(), this.aChangedItems);
	//        var t = this.byId("S2PickedQuantityInput");
	//        var i;
	//        var a;
	//        if (e === undefined) {
	//            return;
	//        }
	//        var s = this.aChangedItems[e].data;
	//        if (parseFloat(s.PickedQuantity) > parseFloat(s.DeliveryQuantityInSalesUoM)) {
	//            i = this.oUtil.getBundleText(this, "ERROR_PICKED_QUANTITY_S2");
	//            a = this.oUtil.getBundleText(this, "ERROR_PICKED_QTY_SHORT");
	//            this.oMessageHandler.addMessage(t, i, sap.ui.core.ValueState.Error, true, a);
	//        } else if (!isNaN(this.oUtil.getAmount(this.byId("S2PickedQuantityInput").getValue()))) {
	//            this.oMessageHandler.removeMessage(this.byId("S2PickedQuantityInput"));
	//            this.checkDlvQuantitySerNoCount();
	//        }
	//    },
	//    checkDlvQuantitySerNoCount: function () {
	//        var e = this.oUtil.getChangedItemIndex(this.getView().getBindingContext().getPath(), this.aChangedItems);
	//        var t = this.byId("S2DeliveryQuantityInSalesUoMInput");
	//        var i = this.aChangedItems[e].data;
	//        var a = parseFloat(i.SerialNumberCount);
	//        var s = parseFloat(i.DeliveryQuantityInBaseUoM);
	//        var r = this.oUtil.getBundleText(this, "ERROR_DLV_QUANTITY_QT_SERIAL_COUNT_SHORT", a);
	//        var n = this.oUtil.getBundleText(this, "ERROR_DLV_QUANTITY_QT_SERIAL_COUNT", a);
	//        if (a > s) {
	//            this.oMessageHandler.addMessage(t, n, "Error", true, r);
	//        } else {
	//            this.oMessageHandler.removeMessage(t);
	//        }
	//    },
	//    changeUpDownPosition: function (e) {
	//        var t = this.byId("S2SerialNumberTable");
	//        if (t.getBusy()) {
	//            t.data("retriggerChangeUpDown", e);
	//            return;
	//        }
	//        if (this.oUtil.getRequestLoading()) {
	//            jQuery.sap.delayedCall(100, this, this.navBack, [e]);
	//            return;
	//        }
	//        var i = this.oUtil.getBundleText(undefined, "ERROR_NAV_TO_ITEM");
	//        if (this.oMessageHandler.checkMessages(undefined, undefined, i)) {
	//            return;
	//        }
	//        if (this.oSerialNumberHelper.getTableStatus(t) === false) {
	//            sap.m.MessageBox.error(this.oUtil.getBundleText(this, "ERROR_INVALID_SN"), { styleClass: "sapUiSizeCompact" });
	//            return;
	//        }
	//        this.oUtil.setChangedItems(this.aChangedItems);
	//        var a = "/DeliveryItems(DeliveryID='" + this.oDeliveryHeader.DeliveryItems.results[e].DeliveryID + "',ItemID='" + this.oDeliveryHeader.DeliveryItems.results[e].ItemID + "')";
	//        if (this.bDirectLoad) {
	//            this.loadData(a);
	//        } else {
	//            this.refreshScreen(new sap.ui.model.Context(this.getView().getModel(), a));
	//        }
	//        this.setHeaderFooterOptions(this.getHeaderFooter());
	//    },
	//    navBack: function () {
	//        var e = this.oUtil.getBundleText(undefined, "ERROR_NAV_TO");
	//        if (this.oMessageHandler.checkMessages(undefined, undefined, e)) {
	//            return;
	//        }
	//        this.oUtil.setChangedItems(this.aChangedItems);
	//        this.oDeliveryHeader = {};
	//        if (this.bDirectLoad) {
	//            this.oRouter.navTo("fullscreenWithDelivery", { id: this.getView().getBindingContext().getProperty("DeliveryID") }, false);
	//        } else {
	//            window.history.back();
	//        }
	//    },
	//    navToItemOutputMgmt: function (e) {
	//        if (this.oUtil.getRequestLoading()) {
	//            jQuery.sap.delayedCall(100, this, this.onItemOutputPressed(e));
	//            return;
	//        }
	//        if (this.oMessageHandler.checkMessages(undefined, undefined, "ERROR_TEXT_OUTPUT")) {
	//            return;
	//        }
	//        var t = e.getSource().getBindingContext();
	//        var i = t.getModel().getProperty(t.sPath);
	//        var a = i.DeliveryID;
	//        var s = i.ItemID;
	//        a = this.oUtil.adjustLeadingZeros(a, 10);
	//        s = this.oUtil.adjustLeadingZeros(s, 6);
	//        var r = a.concat(s);
	//        this.oRouter.navTo("output_item", { DeliveryItemId: r });
	//    },
	//    getNumberOfDeliveryItemOutputs: function () {
	//        var e = this.getView();
	//        var t = e.getModel().getObject(e.getBindingContext().getPath());
	//        return t.NumberOfOutputs;
	//    },
	//    isDisplayItemOutputButtonEnabled: function () {
	//        return this.getNumberOfDeliveryItemOutputs() > 0;
	//    },
	//    getHeaderFooter: function () {
	//        var e = {
	//            onBack: jQuery.proxy(this.handleS2Cancel, this),
	//            sI18NDetailTitle: this.oUtil.getBundleText(this, "DETAIL_TITLE", [
	//                1,
	//                1
	//            ]),
	//            buttonList: []
	//        };
	//        var t = this.oDeliveryHeader.DeliveryItems.results;
	//        e.oUpDownOptions = {
	//            iPosition: this.getItemIndex(),
	//            iCount: t ? t.length : 0,
	//            fSetPosition: jQuery.proxy(this.changeUpDownPosition, this),
	//            sI18NDetailTitle: "DETAIL_TITLE"
	//        };
	//        if (this.oDeliveryHeader.DeliveryGoodsIssueStatusCode !== "C") {
	//            e.oEditBtn = {
	//                sI18nBtnTxt: this.oUtil.getBundleText(this, "DIALOG_OK"),
	//                onBtnPressed: jQuery.proxy(this.handleS2OK, this)
	//            };
	//            e.buttonList.push({
	//                sI18nBtnTxt: this.oUtil.getBundleText(this, "DIALOG_CANCEL"),
	//                onBtnPressed: jQuery.proxy(this.handleS2Cancel, this)
	//            });
	//        }
	//        if (this.oDeliveryHeader.IsCloud === "X") {
	//            e.buttonList.push({
	//                sI18nBtnTxt: this.oUtil.getBundleText(this, "ITEM_PRINT"),
	//                onBtnPressed: jQuery.proxy(this.navToItemOutputMgmt, this),
	//                bDisabled: !this.isDisplayItemOutputButtonEnabled()
	//            });
	//        }
	//        if (this.extHookModifyFooterOptions) {
	//            e = this.extHookModifyFooterOptions(e);
	//        }
	//        return e;
	//    },
	//    setChangedItems: function (e) {
	//        this.aChangedItems = e;
	//    },
	//    getChangedItems: function () {
	//        return this.aChangedItems;
	//    },
	//    onSNMassSelect: function (e) {
	//        var t = this.getView().byId("S2SerialNumberTable");
	//        if (this.oSerialNumberHelper.getTableStatus(t)) {
	//            this.onRegisterVHDialog(e);
	//        } else {
	//            sap.m.MessageBox.error(this.oUtil.getBundleText(this, "ERROR_INVALID_SN"), { styleClass: "sapUiSizeCompact" });
	//            return;
	//        }
	//    },
	//    onSNDelete: function (e) {
	//        e.getSource().setEnabled(false);
	//        var t = this.getView().byId("S2SerialNumberTable");
	//        this.oSerialNumberHelper.deleteSelectedLinesFromTable(t, this);
	//        this.checkDlvQuantitySerNoCount();
	//    },
	//    onSNSort: function (e) {
	//        this.oSerialNumberHelper.handleSerialNumberSort(e, this);
	//    },
	//    enableClearSelected: function (e) {
	//        var t = e.getSource();
	//        var i = t.getSelectedItem();
	//        var a = this.byId("removeSNButton");
	//        a.setEnabled(i === null ? false : true);
	//    },
	//    onBreadCrumbPressed: function (e) {
	//        this.oRouter.navTo("fullscreenWithDelivery", { id: this.getView().getBindingContext().getProperty("DeliveryID") }, false);
	//    }
	extHookModifyFooterOptions: function(e) {
		// Place your hook implementation code here 
	}
});