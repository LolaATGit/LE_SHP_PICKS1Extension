jQuery.sap.declare("i2d.le.delivery.pick.s1.LE_SHP_PICKS1Extension.Component");

// use the load function for getting the optimized preload file if present
sap.ui.component.load({
	name: "i2d.le.delivery.pick.s1",
	// Use the below URL to run the extended application when SAP-delivered application is deployed on SAPUI5 ABAP Repository
	url: "/sap/bc/ui5_ui5/sap/LE_SHP_PICKS1"
		// we use a URL relative to our own component
		// extension application is deployed with customer namespace
});

this.i2d.le.delivery.pick.s1.Component.extend("i2d.le.delivery.pick.s1.LE_SHP_PICKS1Extension.Component",{
	metadata: {
		manifest: "json"
	}
});