jQuery.sap.declare("i2d.le.delivery.pick.s1.view.S1");
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.ui.core.format.DateFormat");
i2d.le.delivery.pick.s1.view.S1Controller = {
	onInit: function() {
		var e = this;
		this.oFormatter = i2d.le.delivery.pick.s1.util.formatter;
		this.oUtil = i2d.le.delivery.pick.s1.util.util;
		this.oMessageHandler = i2d.le.delivery.pick.s1.util.messageHandler;
		this.oValueHelpHelper = i2d.le.delivery.pick.s1.util.valueHelpHelper;
		this.oTabBarHelper = i2d.le.delivery.pick.s1.util.tabBarHelper;
		this.oErrorHandler = i2d.le.delivery.pick.s1.util.errorHandling;
		this.bDeliverySelected = false;
		this.aChangedItems = [];
		this.oChangedHeader = {};
		this.aTableElments = [];
		this.oHeader = {};
		this.sHash = "";
		var t = new sap.ui.model.json.JSONModel();
		this.getView().setModel(t, "actionMessageModel");
		this.oUtil.setFieldControlModel(this.getView());
		var i = this.getView().getModel();
		i.setSizeLimit(1000000);
		i.attachRequestCompleted(this.handleRequestCompleted, this);
		var a = sap.ushell.Container.getService("CrossApplicationNavigation");
		this.oUtil.setIntentSupported(a);
		if (!jQuery.support.touch) {
			this.getView().addStyleClass("sapUiSizeCompact");
		}
		this.getOwnerComponent().createComponent({
			usage: "attachmentReuseComponent",
			settings: {
				mode: "C",
				objectKey: "{parts:[{path:'DeliveryId'}]}",
				objectType: "LIKP",
				onupload: [
					e.handleAttachmentUpload,
					e
				],
				ondelete: [
					e.handleAttachmentDelete,
					e
				]
			}
		}).then(function(t) {
			e.byId("PickDeliveryAttachmentContainer").setComponent(t);
			e.oAttachmentComp = t;
		});
		this.getView().byId("S1AttachmentsTab").bindProperty("count", {
			path: "NumberOfAttachments",
			mode: "sap.ui.model.BindingMode.TwoWay"
		});
		var s = sap.ui.core.Component.getOwnerIdFor(this.getView());
		this._oComponentData = sap.ui.component(s).getComponentData();
		if (this._oComponentData && this._oComponentData.startupParameters && this._oComponentData.startupParameters.OutboundDelivery) {
			var n = this._oComponentData.startupParameters.OutboundDelivery[0];
			var r = n.replace(/\b0+/g, "");
			this.routeWithDeliveryMatched(r);
		} else {
			this.oRouter.attachRouteMatched(function(e) {
				if (e.getParameter("name") === "fullscreenWithDelivery") {
					this.routeWithDeliveryMatched(e.getParameter("arguments").id);
				}
			}, this);
		}
		this.getView().addEventDelegate({
			onBeforeShow: function(e) {
				if (e.direction === "backToPage") {
					this.refreshTable();
				}
			}
		}, this);
		this.byId("S1ActualGIDatePicker").addEventDelegate({
			onAfterRendering: this.onGIDateRerendering
		}, this);
		this.registerTypeAhead();
		this.setHeaderFooterOptions(this.getHeaderFooter());
		this.getView().byId("S1ReferenceDocumentInput").addEventDelegate({
			onAfterRendering: function(e) {
				this.getView().byId("S1ReferenceDocumentInput").focus();
			}
		}, this);
	},
	handleRequestCompleted: function(e) {
		if (e.getParameter("success") !== true) {
			var t = e.getParameters().errorobject;
			if (t) {
				this.oErrorHandler._handleError(t, this);
			}
		}
	},
	routeWithDeliveryMatched: function(e) {
		if (!this.getView().getBindingContext() || this.getView().getBindingContext().getProperty("DeliveryID") !== e) {
			var t = this.byId("S1ReferenceDocumentInput");
			this.refreshScreen(e);
			t.setValue(e);
			if (this.oUtil.getChangedItems().length > 0) {
				this.getView().getElementBinding().attachEventOnce("dataReceived", this.refreshTable, this);
			}
		}
		this.setHeaderFooterOptions(this.getHeaderFooter());
	},
	updateAttachmentComponent: function(e) {
		var t = e.getSource().getBindingContext().getPath();
		var i = this.getView().getModel().getObject(t).DeliveryID;
		var a = "0000000000";
		var s = (a + i.toString()).slice(-a.length);
		this.oAttachmentComp.setObjectKey(s);
		this.oAttachmentComp.refresh();
		var n = null;
		var r = this;
		this.oAttachmentComp.getAttachmentCount(function(e) {
			n = e.TotalCount;
			var i = r.getView().getModel();
			i.getObject(t).NumberOfAttachments = n;
			r.getView().byId("S1AttachmentsTab").getBinding("count").refresh();
		});
	},
	handleAttachmentUpload: function(e) {
		if (e.getParameter("status") === "UPLOADCOMPLETED") {
			this.handleAttachmentChange();
		}
	},
	handleAttachmentDelete: function(e) {
		if (e.getParameter("status") === "DELETED") {
			this.handleAttachmentChange();
		}
	},
	handleAttachmentChange: function() {
		var e = this;
		e.oAttachmentComp.save(true, function(t) {
			e.oAttachmentComp.getAttachmentCount(function(t) {
				e.updateAttachmentCount(t.TotalCount);
			});
		});
	},
	updateAttachmentCount: function(e) {
		var t = this.getView().byId("S1AttachmentsTab");
		var i = t.getBindingContext().getPath();
		var a = this.getView().getModel();
		t.setCount(e);
		a.getObject(i).NumberOfAttachments = e;
		t.getBinding("count").refresh();
	},
	refreshTable: function() {
		if (this.aTableElments.length === 0) {
			this.aTableElments = this.getTableElements();
		}
		this.aChangedItems = this.oUtil.getChangedItems();
		if (this.aChangedItems.length > 0) {
			this.aChangedItems.forEach(function(e) {
				if (e.bUpdateTable) {
					this.aTableElments[e.path].forEach(function(t) {
						this.oUtil.setChangedProperty(sap.ui.getCore().byId(t), e.data);
					}, this);
					e.bUpdateTable = false;
				}
			}, this);
		}
	},
	getTableElements: function() {
		var e = {};
		var t = this.byId("S1DeliveryItemsTable").getItems();
		t.forEach(function(t) {
			var i = t.getBindingContext().getPath();
			t.getCells().forEach(function(t, a) {
				if (!e[i]) {
					e[i] = [];
				}
				e[i][a] = t.getId();
			});
		});
		return e;
	},
	onRefDocChanged: function(e) {
		var t = e.getParameter("value");
		if (this.aChangedItems.length > 0 || this.oChangedHeader.data) {
			this.oUtil.showCancelPopup.call(this, "WARNING_DIALOG_DELIVERY_TEXT", "WARNING_DIALOG_TITLE", this.closeCancelPopup);
			return;
		}
		t = t.trim();
		this.refreshScreen(t);
	},
	closeCancelPopup: function(e) {
		var t = this.byId("S1ReferenceDocumentInput");
		if (e === sap.m.MessageBox.Action.OK) {
			this.oUtil.setChangedItems([]);
			var i = t.getValue();
			this.refreshScreen(i);
		} else {
			t.setValue(t.getBindingContext().getProperty("DeliveryID"));
		}
	},
	refreshScreen: function(e) {
		var t = e;
		if (t) {
			var i = this.getView();
			var a = true;
			this.aTableElments = [];
			while (a) {
				if (t.charAt(0) === "0") {
					t = t.slice(1, t.length);
				} else {
					a = false;
				}
			}
			var s = "/DeliveryHeader('" + t + "')";
			i.bindElement("/DeliveryHeader('" + t + "')", {
				expand: "DeliveryItems"
			});
			if (!i.getModel().getProperty(s)) {
				i.getElementBinding().attachEventOnce("dataReceived", this.onDataLoaded, this);
				i.getElementBinding().attachChange(this.updateScreenAfterItemChangeEvent, this);
			} else {
				this.showDeliveryDetails();
				this.updateScreenAfterItemRefresh();
			}
			this.oUtil.setFieldControlProperty("HeaderExpanded", false);
			this.oUtil.setFieldControlProperty("HeaderNotExpanded", true);
		} else {
			this.hideDeliveryDetails();
		}
	},
	onDataLoaded: function(e) {
		if (this.getView().getModel().getProperty(e.getSource().getPath())) {
			this.showDeliveryDetails();
		} else {
			this.hideDeliveryDetails();
		}
	},
	showDeliveryDetails: function() {
		var e = this.getView();
		var t = this.byId("S1ReferenceDocumentInput");
		this.oRouter.navTo("fullscreenWithDelivery", {
			id: e.getBindingContext().getProperty("DeliveryID")
		}, true);
		this.updateScreen(true);
		this.bDeliverySelected = true;
		this.oTabBarHelper.updateItemTableHeader(this.byId("S1DeliveryItemsTable").getItems().length);
		this.setHeaderFooterOptions(this.getHeaderFooter());
		this.aChangedItems = [];
		this.oChangedHeader = {};
		this.oMessageHandler.clearMessages();
		if (t.getValueState() === sap.ui.core.ValueState.Error) {
			t.setValueState(sap.ui.core.ValueState.None);
		}
	},
	hideDeliveryDetails: function(e) {
		var t = this.byId("S1ReferenceDocumentInput");
		if (!e) {
			t.setValueState(sap.ui.core.ValueState.Error);
			t.setValueStateText(this.oUtil.getBundleText(this, "ERROR_INVALID_DELIVERY_SHORT", [t.getValue()]));
		} else {
			t.setValue("");
		}
		this.oRouter.navTo("fullscreen", undefined, true);
		this.updateScreen(false);
		this.bDeliverySelected = false;
		this.setHeaderFooterOptions(this.getHeaderFooter());
		this.aChangedItems = [];
		this.oChangedHeader = {};
		this.oMessageHandler.clearMessages();
	},
	updateScreen: function(e) {
		this.byId("S1ContentBox").setVisible(e);
		this.byId("S1MessagePage").setVisible(!e);
	},
	updateScreenAfterItemChangeEvent: function(e) {
		if (this.getView().getBindingContext()) {
			this.updateScreenAfterItemRefresh();
		}
	},
	updateScreenAfterItemRefresh: function() {
		this.oTabBarHelper.updateTabBar(this.getView(), true);
		this.setHeaderFooterOptions(this.getHeaderFooter());
		this.aTableElments = [];
	},
	handleTableLineSelect: function() {
		this.setHeaderFooterOptions(this.getHeaderFooter());
	},
	handleTableItemPress: function(e) {
		this.navToS2(e.getSource());
	},
	navToS2: function(e) {
		var t = this.oUtil.getBundleText(undefined, "ERROR_NAV_TO");
		if (this.oMessageHandler.checkMessages(undefined, undefined, t)) {
			return;
		}
		this.oUtil.setChangedItems(this.aChangedItems);
		this.oRouter.navTo("DeliveryItem", {
			contextPath: e.getBindingContext().getPath().substr(1)
		});
	},
	handelIconTabSelect: function(e) {
		if (e.getParameter("key") !== this.byId("S1TabBar").data("sSeletedKey")) {
			this.byId("S1TabBar").data("sSeletedKey", e.getParameter("key"));
			this.setHeaderFooterOptions(this.getHeaderFooter());
		}
		if (e.getParameter("key") === "Attachments") {
			this.updateAttachmentComponent(e);
		}
	},
	handleHeaderVisibility: function(e) {
		var t = e.getSource().getId() === this.createId("S1HeaderShowMoreLink") ? true : false;
		this.oUtil.setFieldControlProperty("HeaderExpanded", t);
		this.oUtil.setFieldControlProperty("HeaderNotExpanded", !t);
		jQuery.sap.delayedCall(0, this, function() {
			if (t) {
				this.getView().byId("S1HeaderShowLessLink").getFocusDomRef().focus();
			} else {
				this.getView().byId("S1HeaderShowMoreLink").getFocusDomRef().focus();
			}
		});
	},
	getChangedHeaderObject: function() {
		var e = this.getView();
		this.oChangedHeader.data = jQuery.extend(true, {}, e.getModel().getProperty(e.getBindingContext().getPath()));
		delete this.oChangedHeader.data.__metadata;
		delete this.oChangedHeader.data.DeliveryItems;
		this.oChangedHeader.path = e.getBindingContext().getPath();
	},
	setHeaderProperty: function(e, t) {
		if (!this.oChangedHeader.data) {
			this.getChangedHeaderObject();
			this.oChangedHeader.data.Action = "SAV";
		}
		this.oChangedHeader.data[e] = t;
	},
	onGIDateChanged: function(e) {
		if (!e.getParameter("valid")) {
			var t = e.getSource().getBinding("value").oType.getOutputPattern();
			var i = this.oUtil.getBundleText(this, "ERROR_INVALID_DATE", [
				e.getParameter("value"),
				t
			]);
			var a = this.oUtil.getBundleText(this, "ERROR_INVALID_DATE_SHORT", [t]);
			this.oMessageHandler.addMessage(e.getSource(), i, sap.ui.core.ValueState.Error, true, a);
			return;
		}
		if (this.oMessageHandler.getMessage(e.getSource())) {
			this.oMessageHandler.removeMessage(e.getSource());
		}
		var s = e.getSource().getDateValue();
		if (s !== null) {
			this.setHeaderProperty("GoodsIssueActualDate", this.oUtil.convertDate(s));
		} else {
			this.setHeaderProperty("GoodsIssueActualDate", null);
		}
		this.setHeaderFooterOptions(this.getHeaderFooter());
	},
	onGIDateRerendering: function(e) {
		if (this.oMessageHandler.getMessage(e.srcControl)) {
			e.srcControl.$("inner").val(e.srcControl.getValue());
		}
	},
	onHeaderQuantityChanged: function(e) {
		var t = e.getSource();
		var i = this.oUtil.getBundleText(this, "ERROR_INVALID_NUMBER", [t.getValue()]);
		var a = this.oUtil.getBundleText(this, "ERROR_INVALID_NUMBER_SHORT");
		var s = this.byId("S1HeaderNetWeightQuantityInput");
		var n = this.byId("S1HeaderGrossWeightUoMInput");
		var r = this.oUtil.handleQuantityChange(t, e.getParameter("value"), i, a);
		var o, h, l, d, g;
		if (t.getId() === this.createId("S1HeaderGrossWeightQuantityInput")) {
			g = t.getValue();
			d = s.getValue();
		} else if (t.getId() === this.createId("S1HeaderNetWeightQuantityInput")) {
			d = t.getValue();
			g = this.byId("S1HeaderGrossWeightQuantityInput").getValue();
		}
		if (!r) {
			return;
		}
		if (t.getId() === this.createId("S1HeaderGrossWeightQuantityInput") || t.getId() === this.createId("S1HeaderNetWeightQuantityInput")) {
			if (sap.ui.core.format.NumberFormat.getFloatInstance().parse(d) > sap.ui.core.format.NumberFormat.getFloatInstance().parse(g)) {
				i = this.oUtil.getBundleText(this, "WARNING_NET_WEIGHT", [
					d,
					g
				]);
				a = this.oUtil.getBundleText(this, "WARNING_NET_WEIGHT_SHORT");
				this.oMessageHandler.addMessage(s, i, sap.ui.core.ValueState.Warning, true, a);
			} else {
				this.oMessageHandler.removeMessage(s, undefined, sap.ui.core.ValueState.Warning);
			}
			if (t.getId() === this.createId("S1HeaderGrossWeightQuantityInput")) {
				o = this.getView().getModel().getProperty("/#DeliveryHeader/DeliveryGrossWeightQuantity/@sap:label");
				h = this.oUtil.getBundleText(this, "ERROR_NO_UOM", [o]);
				l = this.oUtil.getBundleText(this, "ERROR_NO_UOM_SHORT");
				this.checkHeaderQuantityUoM(n, g, h, l);
			}
		} else if (t.getId() === this.createId("S1HeaderVolumeQuantityInput")) {
			o = this.getView().getModel().getProperty("/#DeliveryHeader/VolumeQuantity/@sap:label");
			h = this.oUtil.getBundleText(this, "ERROR_NO_UOM", [o]);
			l = this.oUtil.getBundleText(this, "ERROR_NO_UOM_SHORT");
			this.checkHeaderQuantityUoM(this.byId("S1HeaderVolumeUoMInput"), t.getValue(), h, l);
		}
		this.setHeaderProperty(t.getBindingPath("value"), r);
		this.setHeaderFooterOptions(this.getHeaderFooter());
	},
	checkHeaderQuantityUoM: function(e, t, i, a) {
		if (!this.oUtil.validateEmptyUoM(t, e, i, a)) {
			return;
		}
		if (e.getValueState() !== sap.ui.core.ValueState.None) {
			if (!this.oUtil.validateChangedCode(e, e.getValue(), "MSEHI", "ERROR_INVALID_VH", "ERROR_INVALID_VH_SHORT")) {
				return;
			}
		}
		this.oMessageHandler.removeMessage(e, undefined, sap.ui.core.ValueState.Error);
	},
	onDeliveryHeaderUoMChange: function(e) {
		var t = e.getSource();
		var i = e.getParameter("value");
		var a, s, n, r, o, h;
		if (t === this.byId("S1HeaderVolumeUoMInput")) {
			a = this.byId("S1HeaderVolumeQuantityInput");
			r = this.getView().getModel().getProperty("/#DeliveryHeader/VolumeQuantity/@sap:label");
		} else {
			a = this.byId("S1HeaderGrossWeightQuantityInput");
			s = this.byId("S1HeaderNetWeightUoMInput");
			r = this.getView().getModel().getProperty("/#DeliveryHeader/DeliveryGrossWeightQuantity/@sap:label");
		}
		o = this.oUtil.getBundleText(this, "ERROR_NO_UOM", [r]);
		h = this.oUtil.getBundleText(this, "ERROR_NO_UOM_SHORT");
		n = this.oUtil.handleUoMCodeChange(t, a, "MSEHI", o, h);
		if (n || n === "") {
			if (n.MSEHI) {
				i = n.MSEHI;
			} else {
				i = n;
			}
			t.setValue(i);
			if (s) {
				s.setValue(i);
			}
			this.setHeaderProperty(t.getBindingPath("value"), i);
		}
		this.setHeaderFooterOptions(this.getHeaderFooter());
	},
	onRegisterVHDialog: function(e) {
		this.oValueHelpHelper.onRegisterVHDialog(e, this);
	},
	registerTypeAhead: function() {
		var e = this.byId("S1HeaderGrossWeightUoMInput");
		var t = this.byId("S1HeaderVolumeUoMInput");
		var i = [{
			path: "DIMID",
			value: "MASS"
		}];
		var a = [{
			labelPath: "/#VL_SH_H_T006_SHP_ODATA/MSEH3/@sap:label",
			path: "MSEH3"
		}, {
			labelPath: "/#VL_SH_H_T006_SHP_ODATA/MSEHL/@sap:label",
			path: "MSEHL"
		}];
		i2d.le.delivery.pick.s1.util.suggestionHelper.registerInputSuggestion(e, a, "20%", "VL_SH_H_T006_SHP_ODATA", i);
		i = [{
			path: "DIMID",
			value: "VOLUME"
		}];
		i2d.le.delivery.pick.s1.util.suggestionHelper.registerInputSuggestion(t, a, "30%", "VL_SH_H_T006_SHP_ODATA", i);
	},
	prepareInputSuggest: function() {
		this.byId("S1DeliveryItemsTable").getItems().forEach(function(e) {
			e.getCells().forEach(function(e) {
				if (e instanceof sap.m.FlexBox) {
					var t = e.getItems()[1];
					t.attachChange(this.handleItemUoMCodeChange, this);
					i2d.le.delivery.pick.s1.util.suggestionHelper.registerSuggestForMaterialUoMCode(t);
				}
				return false;
			}, this);
		}, this);
		this.setHeaderFooterOptions(this.getHeaderFooter());
	},
	handleItemUoMCodeChange: function(e) {
		var t;
		var i = e.getSource();
		var a;
		i.getParent().getItems().forEach(function(e) {
			if (e.getId().indexOf("S1DeliveryQuantityInput") !== -1) {
				t = e;
				return false;
			}
		}, this);
		var s = this.oUtil.getBundleText(undefined, "ERROR_NO_UOM_ITEM", [i.getBindingContext().getProperty("ItemID")]);
		var n = this.oUtil.handleUoMCodeChange(i, t, "MEINH", s);
		if (n || n === "") {
			if (n.MEINH) {
				a = n.MEINH;
			} else {
				a = n;
			}
			i.setValue(a);
			this.aChangedItems = this.oUtil.handleItemChange(i, a, "value", this.aChangedItems, this.getView().getModel(), true);
			this.changeDependentUoMCodeFields(i, n);
		}
		this.setHeaderFooterOptions(this.getHeaderFooter());
	},
	changeDependentUoMCodeFields: function(e, t) {
		if (!t) {
			return;
		}
		e.getParent().getParent().getCells().forEach(function(e) {
			if (e.getId().indexOf("S1PickedQuantityInput") !== -1) {
				e.setDescription(t.MEINH);
				return false;
			}
		});
		var i = this.oUtil.getChangedItemIndex(e.getBindingContext().getPath(), this.aChangedItems);
		this.aChangedItems[i].data.PickedQuantityUoMCode = t.MEINH;
		this.aChangedItems[i].data.SalesToBaseFactor = t.UMREZ;
	},
	onItemQuantityChanged: function(e) {
		var t = e.getSource();
		var i = this.oUtil.getBundleText(this, "ERROR_INVALID_ITEM_NUMBER", [
			t.getBindingContext().getProperty("ItemID"),
			t.getValue()
		]);
		var a = this.oUtil.getBundleText(this, "ERROR_INVALID_NUMBER_SHORT");
		var s;
		var n = this.oUtil.handleQuantityChange(t, e.getParameter("value"), i, a);
		if (!n) {
			return;
		}
		this.aChangedItems = this.oUtil.handleItemChange(t, n, "value", this.aChangedItems, this.getView().getModel(), true);
		var r = this.oUtil.getChangedItemIndex(t.getBindingContext().getPath(), this.aChangedItems);
		this.updateBaseQuantity(r);
		s = this.aChangedItems[r].data;
		if (parseFloat(s.PickedQuantity) > parseFloat(s.DeliveryQuantityInSalesUoM)) {
			i = this.oUtil.getBundleText(this, "ERROR_PICKED_QUANTITY", [
				s.PickedQuantity,
				t.getBindingContext().getProperty("ItemID")
			]);
			a = this.oUtil.getBundleText(this, "ERROR_PICKED_QTY_SHORT");
			this.handlePickedInputErrorMessage(true, t, i, a);
		} else {
			this.handlePickedInputErrorMessage(false, t);
			var o = parseFloat(s.SerialNumberCount);
			var h = parseFloat(s.DeliveryQuantityInBaseUoM);
			if (o > h) {
				a = this.oUtil.getBundleText(this, "ERROR_DLV_QUANTITY_QT_SERIAL_COUNT_SHORT", o);
				i = this.oUtil.getBundleText(this, "ERROR_DLV_QUANTITY_QT_SERIAL_COUNT", o);
				var l;
				if (t.getBindingPath("value") !== "DeliveryQuantityInSalesUoM") {
					var d = t.getId();
					var g = d.replace("S1PickedQuantityInput", "S1DeliveryQuantityInput");
					l = this.byId(g);
				} else {
					l = t;
				}
				this.oMessageHandler.addMessage(l, i, "Error", true, a);
			}
		}
		if (t.getBindingPath("value") !== "PickedQuantity") {
			var u;
			t.getParent().getItems().forEach(function(e) {
				if (e.getId().indexOf("S1DeliveryItemTableSalesUoMCodeInput") !== -1) {
					u = e;
					return false;
				}
			}, this);
			i = this.oUtil.getBundleText(undefined, "ERROR_NO_UOM_ITEM", [t.getBindingContext().getProperty("ItemID")]);
			a = this.oUtil.getBundleText(undefined, "ERROR_NO_UOM_SHORT");
			if (u.getValue() === "") {
				if (this.oUtil.validateEmptyUoM(s.DeliveryQuantityInSalesUoM, u, i, a)) {
					this.oMessageHandler.removeMessage(u, undefined, sap.ui.core.ValueState.Error);
				}
			}
		}
		if (t.getBindingPath("value") === "PickedQuantity") {
			this.getView().getModel().setProperty(t.getBindingContext().getPath() + "/PickedQuantity", n);
		}
		this.setHeaderFooterOptions(this.getHeaderFooter());
	},
	updateBaseQuantity: function(e) {
		var t;
		var i = e;
		if (i === undefined) {
			return;
		}
		var a = this.aChangedItems[i].data;
		var s = parseFloat(a.SalesToBaseDivisor, 10);
		var n = parseFloat(a.SalesToBaseFactor, 10);
		var r = parseFloat(a.DeliveryQuantityInSalesUoM, 10);
		if (!s && !n) {
			return;
		}
		t = (r / s * n).toString();
		this.aChangedItems[i].data.DeliveryQuantityInBaseUoM = t;
	},
	handleSave: function() {
		var e = this.oUtil.getBundleText(undefined, "ERROR_SAVE");
		if (this.oMessageHandler.checkMessages(undefined, undefined, e)) {
			return;
		}
		if (this.aChangedItems.length === 0 && !this.oChangedHeader.data) {
			return;
		}
		var t = this.getView().getModel();
		this.oUtil.createDeliveryBatch(t, this.aChangedItems, this.oChangedHeader);
		this.submitDeliveryBatch(t, "TOAST_SAVE_SUCCESS");
	},
	openDeleteDeliveryConfirmDialog: function() {
		if (this.oUtil.getRequestLoading()) {
			jQuery.sap.delayedCall(100, this, this.openDeleteDeliveryConfirmDialog);
			return;
		}
		this.showConfirmationPopup(this.oUtil.getBundleText(this, "DEL_DELIVERY_TITLE"), this.oUtil.getBundleText(this, "DEL_DELIVERY_QUESTION", [
			this.getView().getBindingContext().getProperty("DeliveryID")
		]), jQuery.proxy(this.handleDeleteDelivery, this));
	},
	handleDeleteDelivery: function() {
		var e = this;
		var t = this.getView().getBindingContext();
		var i = this.getView().getModel();
		this.getView().setBindingContext(null);
		var a = function(a) {
			this.BusyDialog.close();
			this.oErrorHandler._handleError(a, e);
			this.getView().setBindingContext(t);
			i.setRefreshAfterChange(true);
		};
		var s = function(t) {
			this.BusyDialog.close();
			i.setRefreshAfterChange(true);
			if (t) {
				this.oErrorHandler._handleError(t, e);
				return;
			}
			this.hideDeliveryDetails(true);
			sap.m.MessageToast.show(this.oUtil.getBundleText(this, "TOAST_DELETE_SUCCESS"));
		};
		if (!this.BusyDialog) {
			this.BusyDialog = sap.ui.xmlfragment(this.createId("BusyDialog"), "i2d.le.delivery.pick.s1.fragments.BusyDialog", this);
		}
		this.BusyDialog.open();
		i.setRefreshAfterChange(false);
		i.remove(t.getPath(), undefined, jQuery.proxy(s, this), jQuery.proxy(a, this));
	},
	handleGoodsIssue: function() {
		if (this.oUtil.getRequestLoading()) {
			jQuery.sap.delayedCall(100, this, this.handleGoodsIssue);
			return;
		}
		var e = this.getView().getBindingContext().getProperty("DeliveryItems");
		var t = this.getView().getBindingContext().getProperty("DocumentType");
		var i = this.oUtil.determineGoodsMovementDirection(t) === "ISSUE" ? true : false;
		if (e.length === 0) {
			var a;
			if (i) {
				a = this.oUtil.getBundleText(this, "ERROR_GI_NO_ITEMS");
			} else {
				a = this.oUtil.getBundleText(this, "ERROR_GR_NO_ITEMS");
			}
			sap.m.MessageBox.error(a, {
				styleClass: "sapUiSizeCompact"
			});
			return;
		}
		if (this.oMessageHandler.checkMessages()) {
			return;
		}
		var s = this.getView().getModel();
		this.setHeaderProperty("Action", "PGI");
		this.oUtil.createDeliveryBatch(s, this.aChangedItems, this.oChangedHeader);
		var n;
		if (i) {
			n = "TOAST_GI_SUCCESS";
		} else {
			n = "TOAST_GR_SUCCESS";
		}
		this.submitDeliveryBatch(s, n);
	},
	openReverseGIDialog: function() {
		if (this.oUtil.getRequestLoading()) {
			jQuery.sap.delayedCall(100, this, this.openReverseGIDialog);
			return;
		}
		var e = this.getView().getBindingContext().getProperty("DocumentType");
		var t = this.oUtil.determineGoodsMovementDirection(e) === "ISSUE" ? true : false;
		var i = this.getView().getBindingContext();
		if (!this.oReverseGIDateDialog) {
			this.oReverseGIDateDialog = sap.ui.xmlfragment(this.createId("ReverseGIDateDialog"),
				"i2d.le.delivery.pick.s1.fragments.ReverseGIDateSelectDialog", this);
			this.oReverseGIDateDialog.setModel(this.oApplicationFacade.getODataModel("i18n"), "i18n");
			this.oReverseGIDateDialog.setModel(this.getView().getModel());
			this.oReverseGIDateDialog.setBindingContext(this.getView().getBindingContext());
			var a = sap.ui.core.Fragment.byId(this.createId("ReverseGIDateDialog"), "ReverseGIDateDialogDatePicker");
			a.data("lastValidDateDisplay", a.data("ActualGI"));
			var s = sap.ui.core.format.DateFormat.getDateInstance({
				style: "medium"
			});
			var n = s.format(new Date());
			a.setValue(n);
		}
		var r;
		if (t) {
			r = this.oUtil.getBundleText(this, "LABEL_ENTER_GI_DATE", [i.getProperty("GoodsIssueID")]);
		} else {
			r = this.oUtil.getBundleText(this, "LABEL_ENTER_GR_DATE", [i.getProperty("GoodsIssueID")]);
		}
		sap.ui.core.Fragment.byId(this.createId("ReverseGIDateDialog"), "ReverseGIDateDialogText").setText(r);
		this.oReverseGIDateDialog.open();
	},
	handleReverseGIDateSelection: function() {
		var e = sap.ui.core.Fragment.byId(this.createId("ReverseGIDateDialog"), "ReverseGIDateDialogDatePicker");
		var t = e.getDateValue();
		if (this.oMessageHandler.checkMessages(undefined, false)) {
			return;
		}
		if (t) {
			this.setHeaderProperty("GoodsIssueActualDate", this.oUtil.convertDate(t));
		}
		e.data("lastValidDateDisplay", e.getValue());
		this.closeReverseGIDialog();
		this.handleReverseGoodsIssue();
	},
	handleReverseGIDateCancel: function() {
		this.closeReverseGIDialog();
		var e = sap.ui.core.Fragment.byId(this.createId("ReverseGIDateDialog"), "ReverseGIDateDialogDatePicker");
		e.setValue(e.data("lastValidDateDisplay"));
		if (this.oMessageHandler.getMessage(e)) {
			this.oMessageHandler.removeMessage(e);
		}
	},
	closeReverseGIDialog: function() {
		this.oReverseGIDateDialog.close();
		this.oReverseGIDateDialog.destroy();
		delete this.oReverseGIDateDialog;
	},
	handleReverseGIDateChange: function(e) {
		var t = sap.ui.core.Fragment.byId(this.createId("ReverseGIDateDialog"), "ReverseGIDateDialogDatePicker");
		if (!e.getParameter("valid")) {
			var i = e.getSource().getBinding("value").oType.getOutputPattern();
			var a = this.oUtil.getBundleText(this, "ERROR_INVALID_DATE", [
				e.getParameter("value"),
				i
			]);
			var s = this.oUtil.getBundleText(this, "ERROR_INVALID_DATE_SHORT", [i]);
			this.oMessageHandler.addMessage(e.getSource(), a, sap.ui.core.ValueState.Error, true, s);
		} else if (this.oMessageHandler.getMessage(t)) {
			this.oMessageHandler.removeMessage(t);
		}
	},
	handleReverseGoodsIssue: function() {
		var e = this.getView().getModel();
		this.setHeaderProperty("Action", "RGI");
		var t = this.getView().getBindingContext().getProperty("DocumentType");
		var i = this.oUtil.determineGoodsMovementDirection(t) === "ISSUE" ? true : false;
		this.oUtil.createDeliveryBatch(e, this.aChangedItems, this.oChangedHeader);
		var a;
		if (i) {
			a = "TOAST_RGI_SUCCESS";
		} else {
			a = "TOAST_RGR_SUCCESS";
		}
		this.submitDeliveryBatch(e, a);
	},
	openDeleteItemConfirmDialog: function() {
		if (this.oUtil.getRequestLoading()) {
			jQuery.sap.delayedCall(100, this, this.openDeleteItemConfirmDialog);
			return;
		}
		var e = this.oUtil.getBundleText(undefined, "ERROR_DELETE");
		if (this.oMessageHandler.checkMessages(undefined, undefined, e)) {
			return;
		}
		this.showConfirmationPopup(this.oUtil.getBundleText(this, "DEL_DELIVERY_ITEM_TITLE"), this.oUtil.getBundleText(this,
			"DEL_DELIVERY_ITEM_QUESTION"), jQuery.proxy(this.handleDeleteItem, this));
	},
	handleDeleteItem: function() {
		var e = this.getView().getModel();
		var t = this.byId("S1DeliveryItemsTable").getSelectedItems();
		t.forEach(function(e) {
			var t = e.getBindingContextPath();
			var i = this.oUtil.getChangedItemIndex(t, this.aChangedItems);
			if (i === undefined) {
				this.aChangedItems.push({
					path: t,
					method: "PUT",
					data: jQuery.extend(true, {}, this.getView().getModel().getProperty(t))
				});
				i = this.aChangedItems.length - 1;
			}
			this.aChangedItems[i].data.ItemAction = "D";
		}, this);
		this.oUtil.createDeliveryBatch(e, this.aChangedItems, this.oChangedHeader);
		this.submitDeliveryBatch(e, "TOAST_DELETE_ITEM_SUCCESS");
	},
	handleConfirmItem: function() {
		var e = this;
		if (this.oUtil.getRequestLoading()) {
			jQuery.sap.delayedCall(100, this, this.handleConfirmItem);
			return;
		}
		var t = this.oUtil.getBundleText(undefined, "ERROR_CONFIRM");
		var i = this.getView().getModel();
		var a = this.byId("S1DeliveryItemsTable").getSelectedItems();
		var s = false;
		var n;
		var r;
		var o;
		var h;
		if (this.oMessageHandler.checkMessages(undefined, undefined, t)) {
			return;
		}
		a.forEach(function(e) {
			var i = e.getCells();
			i.forEach(function(e) {
				if (e.getId().indexOf("S1DeliveryQuantityBox") !== -1) {
					r = e.getItems()[0];
				}
			});
			var a = this.oUtil.handleQuantityChange(r, r.getProperty("value"), n, o);
			if (!a) {
				return;
			}
			this.aChangedItems = this.oUtil.handleItemChange(r, a, "value", this.aChangedItems, this.getView().getModel(), true);
			h = this.aChangedItems[this.oUtil.getChangedItemIndex(e.getBindingContext().getPath(), this.aChangedItems)].data;
			if (sap.ui.core.format.NumberFormat.getFloatInstance().parse(h.PickedQuantity) !== sap.ui.core.format.NumberFormat.getFloatInstance()
				.parse(h.DeliveryQuantityInSalesUoM)) {
				o = this.oUtil.getBundleText(this, "ERROR_DELIVERY_QTY_NE_PICKING_QTY_SHORT");
				n = this.oUtil.getBundleText(this, "ERROR_DELIVERY_QTY_NE_PICKING_QTY", [e.getBindingContext().getProperty("ItemID")]);
				this.oMessageHandler.addMessage(r, n, sap.ui.core.ValueState.Error, true, o);
				this.oMessageHandler.checkMessages(undefined, undefined, t);
				s = true;
			} else {
				s = false;
			}
			return;
		}, this);
		if (s === false) {
			a.forEach(function(e) {
				var t = e.getBindingContextPath();
				var i = this.oUtil.getChangedItemIndex(t, this.aChangedItems);
				if (i === undefined) {
					this.aChangedItems.push({
						path: t,
						method: "PUT",
						data: jQuery.extend(true, {}, this.getView().getModel().getProperty(t))
					});
					i = this.aChangedItems.length - 1;
				}
				this.aChangedItems[i].data.ItemAction = "X";
			}, this);
			this.oUtil.createDeliveryBatch(i, this.aChangedItems, this.oChangedHeader);
			var l = function(t) {
				this.BusyDialog.close();
				i.setRefreshAfterChange(true);
				if (t.__batchResponses[0].response) {
					this.oErrorHandler._handleError(t, e);
					return;
				}
				sap.m.MessageToast.show(this.oUtil.getBundleText(this, "TOAST_CONFIRM_SUCCESS"));
				this.aChangedItems = [];
				this.oChangedHeader = {};
				this.oUtil.setChangedItems([]);
				this.setHeaderFooterOptions(this.getHeaderFooter());
				this.getView().getElementBinding().refresh(true);
				a.forEach(function(e) {
					e.setSelected(false);
				});
			};
			this.submitDeliveryBatch(i, " ", l);
		}
	},
	handleCopyQuantity: function() {
		var e = this;
		if (this.oUtil.getRequestLoading()) {
			jQuery.sap.delayedCall(100, this, this.handleCopyQuantity);
			return;
		}
		var t = this.oUtil.getBundleText(undefined, "ERROR_COPY_PICKED");
		var i = this.byId("S1DeliveryItemsTable").getSelectedItems();
		var a;
		i.forEach(function(e) {
			var t = e.getCells();
			t.forEach(function(e) {
				if (e.getId().indexOf("S1DeliveryQuantityBox") !== -1) {
					a = e.getItems()[0];
				}
			});
		});
		this.oMessageHandler.removeMessage(a);
		if (this.oMessageHandler.checkMessages("PickedQuantity", undefined, t)) {
			return;
		}
		var s = this.getView().getModel();
		var n = [];
		var r = [];
		var o = false;
		i.forEach(function(e) {
			var t = e.getBindingContextPath();
			var i = this.oUtil.getChangedItemIndex(t, this.aChangedItems);
			if (i === undefined) {
				this.aChangedItems.push({
					path: t,
					method: "PUT",
					data: jQuery.extend(true, {}, this.getView().getModel().getProperty(t))
				});
				i = this.aChangedItems.length - 1;
			}
			var a = this.aChangedItems[i].data,
				s = parseFloat(a.SalesToBaseDivisor, 10),
				h = parseFloat(a.SalesToBaseFactor, 10),
				l = parseFloat(a.PickedQuantity, 10),
				d = l / s * h,
				g = parseFloat(a.SerialNumberCount);
			if (g > d) {
				var u = this.oUtil.getBundleText(this, "ERROR_DLV_QUANTITY_QT_SERIAL_COUNT", g);
				var c = this.oUtil.getBundleText(this, "LABEL_ITEM") + " " + a.ItemID;
				var I = c + ": " + u;
				r.push({
					path: e.getBindingContext().getPath() + "/Test",
					messageText: I,
					fieldName: "MyFieldName",
					valueState: null
				});
			} else {
				var f = this.aChangedItems[i].data.PickedQuantity;
				if (f > 0) {
					if (parseInt(f, 10) > 0) {
						o = true;
					}
					this.aChangedItems[i].data.DeliveryQuantityInSalesUoM = f;
					var p = this.oMessageHandler.getMessage(undefined, e.getBindingContext().getPath() + "/PickedQuantity");
					if (p) {
						n.push(p);
					}
				}
			}
			this.aChangedItems[i].data.ItemAction = "U";
		}, this);
		if (!o) {
			sap.m.MessageToast.show(this.oUtil.getBundleText(this, "TOAST_COPY_NOT_REQUIRED"));
			return;
		}
		this.oUtil.createDeliveryBatch(s, this.aChangedItems, this.oChangedHeader);
		var h = function(t) {
			this.BusyDialog.close();
			s.setRefreshAfterChange(true);
			if (t.__batchResponses[0].response) {
				this.oErrorHandler._handleError(t, e);
				return;
			}
			if (r.length > 0) {
				var i = {};
				i.messages = [];
				for (var a = 0; a < r.length; a++) {
					var o = r[a];
					i.messages.push({
						text: o.messageText,
						icon: i2d.le.delivery.pick.s1.fragments.MessageDialogHandler.getMessageIcon(sap.ui.core.ValueState.Error),
						state: sap.ui.core.ValueState.Error,
						detail: "",
						itemType: i2d.le.delivery.pick.s1.fragments.MessageDialogHandler.getMessageItemType()
					});
				}
				i.headerText = i2d.le.delivery.pick.s1.util.util.getBundleText(undefined, "MESSAGE_ERROR");
				i2d.le.delivery.pick.s1.fragments.MessageDialogHandler.openMultiMessageDialog(i);
			} else {
				sap.m.MessageToast.show(this.oUtil.getBundleText(this, "TOAST_COPY_SUCCESS"));
			}
			n.forEach(function(e) {
				this.oMessageHandler.removeMessage(undefined, e.path);
			}, this);
			this.getView().getElementBinding().refresh(true);
			this.aChangedItems = [];
			this.oChangedHeader = {};
			this.oUtil.setChangedItems([]);
			this.setHeaderFooterOptions(this.getHeaderFooter());
		};
		this.submitDeliveryBatch(s, "TOAST_COPY_SUCCESS", h);
	},
	submitDeliveryBatch: function(e, t, i, a) {
		var s = this;
		if (!a) {
			a = function(t) {
				this.BusyDialog.close();
				this.oErrorHandler._handleError(t, s);
				this.setAllActionsToSave();
				e.setRefreshAfterChange(true);
			};
		}
		if (!i) {
			i = function(i) {
				this.BusyDialog.close();
				e.setRefreshAfterChange(true);
				if (i) {
					if (i.__batchResponses[0].response) {
						this.oErrorHandler._handleError(i, s);
						this.setAllActionsToSave();
						return;
					} else if (i.__batchResponses[0].__changeResponses[0].response) {
						if (i.__batchResponses[0].__changeResponses[0].response.body.indexOf("NaN") > 0) {
							this.setAllActionsToSave();
							return;
						}
					}
				}
				sap.m.MessageToast.show(this.oUtil.getBundleText(this, t));
				this.getView().getElementBinding().refresh(true);
				this.aChangedItems = [];
				this.oUtil.setChangedItems([]);
				this.oChangedHeader = {};
				this.setHeaderFooterOptions(this.getHeaderFooter());
			};
		}
		e.setRefreshAfterChange(false);
		if (!this.BusyDialog) {
			this.BusyDialog = sap.ui.xmlfragment(this.createId("BusyDialog"), "i2d.le.delivery.pick.s1.fragments.BusyDialog", this);
		}
		this.BusyDialog.open();
		e.submitBatch(jQuery.proxy(i, this), jQuery.proxy(a, this), false, true);
	},
	setAllActionsToSave: function() {
		this.aChangedItems.forEach(function(e) {
			e.data.ItemAction = "U";
		});
		if (this.oChangedHeader && this.oChangedHeader.data && this.oChangedHeader.data.Action) {
			this.oChangedHeader.data.Action = "SAV";
		}
	},
	handlePickedInputErrorMessage: function(e, t, i, a) {
		var s = t;
		var n;
		var r;
		if (t.getBindingPath("value") === "PickedQuantity") {
			t.getParent().getCells().forEach(function(e) {
				if (e.getId().indexOf("S1PickedQuantityInput") !== -1) {
					r = e;
				}
				if (e.getId().indexOf("S1DeliveryQuantityBox") !== -1) {
					n = e.getItems()[0];
				}
			}, this);
		}
		if (t.getBindingPath("value") === "DeliveryQuantityInSalesUoM") {
			t.getParent().getParent().getCells().forEach(function(e) {
				if (e.getId().indexOf("S1PickedQuantityInput") !== -1) {
					r = e;
				}
				if (e.getId().indexOf("S1DeliveryQuantityBox") !== -1) {
					n = e.getItems()[0];
				}
			}, this);
			t.getParent().getParent().getCells().forEach(function(e) {
				if (e.getId().indexOf("S1PickedQuantityInput") !== -1) {
					s = e;
					return false;
				}
			}, this);
		}
		if (e) {
			this.oMessageHandler.addMessage(s, i, sap.ui.core.ValueState.Error, true, a);
		} else if (!isNaN(this.oUtil.getAmount(t.getValue()))) {
			this.oMessageHandler.removeMessage(r);
			this.oMessageHandler.removeMessage(n);
		}
	},
	showConfirmationPopup: function(e, t, i) {
		sap.m.MessageBox.show(t, {
			title: e,
			actions: [
				sap.m.MessageBox.Action.OK,
				sap.m.MessageBox.Action.CANCEL
			],
			onClose: function(e) {
				if (e === sap.m.MessageBox.Action.OK) {
					i();
				}
			}
		});
	},
	navToOutputManagement: function() {
		if (this.oUtil.getRequestLoading()) {
			jQuery.sap.delayedCall(100, this, this.navToOutputManagement);
			return;
		}
		if (this.oMessageHandler.checkMessages(undefined, undefined, "ERROR_TEXT_OUTPUT")) {
			return;
		}
		var e = this.getView().getBindingContext().getProperty("DeliveryID");
		e = this.oUtil.adjustLeadingZeros(e, 10);
		this.oRouter.navTo("output_header", {
			DeliveryId: e
		});
	},
	navToItemOutputMgmt: function(e) {
		if (this.oUtil.getRequestLoading()) {
			jQuery.sap.delayedCall(100, this, this.onItemOutputPressed(e));
			return;
		}
		if (this.oMessageHandler.checkMessages(undefined, undefined, "ERROR_TEXT_OUTPUT")) {
			return;
		}
		var t = e.getSource().getBindingContext();
		var i = t.getModel().getProperty(t.sPath);
		var a = i.DeliveryID;
		var s = i.ItemID;
		a = this.oUtil.adjustLeadingZeros(a, 10);
		s = this.oUtil.adjustLeadingZeros(s, 6);
		var n = a.concat(s);
		this.oRouter.navTo("output_item", {
			DeliveryItemId: n
		});
	},
	handleS1Cancel: function() {
		if (this.aChangedItems.length > 0 || this.oChangedHeader.data) {
			this.oUtil.showCancelPopup.call(this, "WARNING_DIALOG_DELIVERY_TEXT", "WARNING_DIALOG_TITLE", this.navBack);
			return;
		} else {
			window.history.back();
			this.oRouter.stop();
		}
	},
	navBack: function(e) {
		if (e === sap.m.MessageBox.Action.OK) {
			window.history.back();
			this.oRouter.stop();
		}
	},
	getNumberOfDeliveryHeaderOutputs: function() {
		var e = this.getView();
		var t = e.getModel().getObject(e.getBindingContext().getPath());
		return t.NumberOfOutputs;
	},
	isDisplayHeaderOutputButtonEnabled: function() {
		return this.getNumberOfDeliveryHeaderOutputs() > 0;
	},
	getHeaderFooter: function() {
		var e = this;
		var t = this.getView();
		var i = this.byId("S1DeliveryItemsTable").getSelectedItems().length;
		var a = i === 0 ? true : false;
		var s;
		var n = false;
		this.aChangedItems = this.oUtil.getChangedItems();
		if (this.aChangedItems && this.oChangedHeader) {
			s = this.aChangedItems.length > 0 || Object.keys(this.oChangedHeader).length > 0 ? false : true;
		} else if (this.aChangedItems) {
			s = this.aChangedItems.length > 0 ? false : true;
		} else if (this.oChangedHeader) {
			s = Object.keys(this.oChangedHeader).length > 0 ? false : true;
		}
		if (this.bChangedAttachment) {
			s = false;
		}
		var r = {
			sI18NFullscreenTitle: "FULLSCREEN_TITLE",
			onBack: jQuery.proxy(this.handleS1Cancel, this)
		};
		if (this.bDeliverySelected) {
			var o = t.getBindingContext();
			var h = o.getProperty("DocumentType");
			var l = this.oUtil.determineGoodsMovementDirection(h) === "RECEIPT" ? false : true;
			var d = o.getProperty("IsCloud");
			if (d === undefined || d === "") {
				d = false;
			} else if (d === "X") {
				d = true;
			}
			var g = o.getProperty("GoodsIssueActualDate");
			if (g === undefined) {
				g = "";
			} else {
				g = this.oFormatter.formatDate(g);
			}
			var u = o.getProperty("ShipToPartyName");
			if (u === undefined) {
				u = "";
			}
			r.oJamOptions = {
				oShareSettings: {
					object: {
						id: document.URL,
						share: e.oUtil.getBundleText(e, "MSG_EMAIL_JAM", [
							o.getProperty("DeliveryID"),
							g,
							u
						]),
						display: new sap.m.Text({
							text: o.getProperty("DeliveryID")
						})
					}
				}
			};
			r.oEmailSettings = {
				sSubject: this.oUtil.getBundleText(this, "EMAIL_SUBJECT", o.getProperty("DeliveryID")),
				fGetMailBody: function() {
					return e.oUtil.getBundleText(e, "MSG_EMAIL_JAM", [
						document.URL,
						g,
						u
					]);
				}
			};
			if (o.getProperty("DeliveryGoodsIssueStatusCode") === "C") {
				n = true;
			}
			var c = [];
			if (!n && !d) {
				c = [{
					sI18nBtnTxt: this.oUtil.getBundleText(this, "DELETE_DELIVERY"),
					onBtnPressed: jQuery.proxy(this.openDeleteDeliveryConfirmDialog, this)
				}, {
					sId: "S1BtnSave",
					sI18nBtnTxt: this.oUtil.getBundleText(this, "SAVE"),
					onBtnPressed: jQuery.proxy(this.handleSave, this),
					bDisabled: s
				}];
			}
			if (!n && d) {
				c = [{
					sI18nBtnTxt: this.oUtil.getBundleText(this, "DELETE_DELIVERY"),
					onBtnPressed: jQuery.proxy(this.openDeleteDeliveryConfirmDialog, this)
				}, {
					sI18nBtnTxt: this.oUtil.getBundleText(this, "PRINT"),
					onBtnPressed: jQuery.proxy(this.navToOutputManagement, this),
					bDisabled: !this.isDisplayHeaderOutputButtonEnabled()
				}, {
					sId: "S1BtnSave",
					sI18nBtnTxt: this.oUtil.getBundleText(this, "SAVE"),
					onBtnPressed: jQuery.proxy(this.handleSave, this),
					bDisabled: s
				}];
			}
			if (n && d) {
				c = [{
					sI18nBtnTxt: this.oUtil.getBundleText(this, "PRINT"),
					onBtnPressed: jQuery.proxy(this.navToOutputManagement, this),
					bDisabled: !this.isDisplayHeaderOutputButtonEnabled()
				}];
			}
			this.enableItemOutput(d);
			if (this.byId("S1TabBar").getSelectedKey() === "DeliveryItems") {
				r.buttonList = c;
				if (!n) {
					r.buttonList.unshift({
						sI18nBtnTxt: this.oUtil.getBundleText(this, "DELETE_ITEM", [i]),
						onBtnPressed: jQuery.proxy(this.openDeleteItemConfirmDialog, this),
						bDisabled: a
					});
					if (o.getProperty("DeliveryPickingStatusCode") !== "") {
						r.buttonList.unshift({
							sI18nBtnTxt: this.oUtil.getBundleText(this, "COPY_PICKED", [i]),
							onBtnPressed: jQuery.proxy(this.handleCopyQuantity, this),
							bDisabled: a
						});
					}
					if (o.getProperty("DeliveryConfirmationStatusCode") !== "" && o.getProperty("DeliveryPickingStatusCode") !== "") {
						r.oEditBtn = {
							sID: "ConfirmPickingBtn",
							sI18nBtnTxt: this.oUtil.getBundleText(this, "CONFIRM_PICKING", [i]),
							onBtnPressed: jQuery.proxy(this.handleConfirmItem, this),
							bDisabled: a
						};
					}
				}
			} else {
				r.buttonList = c;
				if (o.getProperty("DeliveryGoodsIssueStatusCode") === "C") {
					if (o.getProperty("Cold") !== "X") {
						if (l) {
							r.oEditBtn = {
								sI18nBtnTxt: this.oUtil.getBundleText(this, "REVERSE_GOODS_ISSUE"),
								onBtnPressed: jQuery.proxy(this.openReverseGIDialog, this)
							};
						} else {
							r.oEditBtn = {
								sI18nBtnTxt: this.oUtil.getBundleText(this, "REVERSE_GOODS_RECEIPT"),
								onBtnPressed: jQuery.proxy(this.openReverseGIDialog, this)
							};
						}
					}
				} else {
					if (l) {
						r.oEditBtn = {
							sI18nBtnTxt: this.oUtil.getBundleText(this, "GOODS_ISSUE"),
							onBtnPressed: jQuery.proxy(this.handleGoodsIssue, this),
							bDisabled: !this.oUtil.getGIReady()
						};
					} else {
						r.oEditBtn = {
							sI18nBtnTxt: this.oUtil.getBundleText(this, "GOODS_RECEIPT"),
							onBtnPressed: jQuery.proxy(this.handleGoodsIssue, this),
							bDisabled: !this.oUtil.getGIReady()
						};
					}
				}
			}
		}
		if (this.extHookModifyFooterOptions) {
			r = this.extHookModifyFooterOptions(r);
		}
		return r;
	},
	enableItemOutput: function(e) {
		this.byId("S1DeliveryItemsTableOutputColumn").setVisible(e);
	},
	onNavToMaterialObjectPage: function(e) {
		var t = this;
		var i = e.getSource().data("materialID");
		var a = sap.ushell.Container.getService("CrossApplicationNavigation");
		var s = this.oUtil.getChangedItems();
		if (a) {
			t.oRouter.stop();
			var n = "C_ProductObjPg('" + i + "')";
			var r = "Material-displayFactSheet&/" + encodeURIComponent(n);
			if (s && s.length > 0 || this.oChangedHeader && Object.keys(this.oChangedHeader).length > 0) {
				this.sHash = r;
				this.oUtil.showCancelPopup.call(this, "WARNING_DIALOG_DELIVERY_TEXT", "WARNING_DIALOG_TITLE", this.closeCancelPopupCrossAppNav);
				return;
			} else {
				this.onCrossAppNavigation(r, a);
			}
		}
	},
	onNavToDeliveryObjectPage: function(e) {
		var t = this;
		var i = e.getSource().getText();
		var a = e.getSource().data("docType");
		var s = sap.ushell.Container.getService("CrossApplicationNavigation");
		var n = "";
		var r = "";
		var o = this.oUtil.getChangedItems();
		if (s) {
			t.oRouter.stop();
			if (a === "J") {
				n = "C_OutboundDeliveryFs('" + i + "')";
				r = "OutboundDelivery-displayFactSheet&/" + encodeURIComponent(n);
			} else {
				n = "C_CustomerReturnDeliveryFs('" + i + "')";
				r = "ReturnsDelivery-displayFactSheet&/" + encodeURIComponent(n);
			}
			if (o && o.length > 0 || this.oChangedHeader && Object.keys(this.oChangedHeader).length > 0) {
				this.sHash = r;
				this.oUtil.showCancelPopup.call(this, "WARNING_DIALOG_DELIVERY_TEXT", "WARNING_DIALOG_TITLE", this.closeCancelPopupCrossAppNav);
				return;
			} else {
				this.onCrossAppNavigation(r, s);
			}
		}
	},
	onCrossAppNavigation: function(e, t) {
		if (!t) {
			t = sap.ushell.Container.getService("CrossApplicationNavigation");
		}
		t.isIntentSupported([e]).done(function(i) {
			if (i[e].supported) {
				if (t) {
					t.toExternal({
						target: {
							shellHash: e
						}
					});
				}
			}
		});
	},
	closeCancelPopupCrossAppNav: function(e) {
		if (e === sap.m.MessageBox.Action.OK) {
			this.oUtil.setChangedItems([]);
			this.oChangedHeader = {};
			this.onCrossAppNavigation(this.sHash, null);
		}
	},
	onExit: function() {
		if (this.oMessageTemplate) {
			this.oMessageTemplate.destroy();
		}
		if (this.oBackButton) {
			this.oBackButton.destroy();
		}
		if (this.oBeginButton) {
			this.oBeginButton.destroy();
		}
		if (this.oMessageView) {
			this.oMessageView.destroy();
		}
		if (this.oDialog) {
			this.oDialog.destroy();
		}
	},
	extHookModifyFooterOptions: function(r) {
		// Place your hook implementation code here 
	}
};
sap.ui.controller("i2d.le.delivery.pick.s1.LE_SHP_PICKS1Extension.view.S1Custom", i2d.le.delivery.pick.s1.view.S1Controller);