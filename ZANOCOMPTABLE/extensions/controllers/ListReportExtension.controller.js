sap.ui.controller("reporting_suivi_ano_comptables.extensions.controllers.ListReportExtension", {

	onAfterRendering: function () {
		//Id trouv� dans le changes.changes-bundle sinon chercher � l'aide de l'onglet Elements du debugger.
		var oSmartTable = this.byId(
			"reporting_suivi_ano_comptables::sap.suite.ui.generic.template.ListReport.view.ListReport::ZC_SuiviAnoCptables--listReport");
		//D�claration de l'event 
		oSmartTable.attachBeforeExport(function (oEvent) {
			var oExportSettings = oEvent.getParameter("exportSettings");
			if (oExportSettings) {
				oExportSettings.dataSource.sizeLimit = oExportSettings.dataSource.count;
			}
		});
	},

	onBeforeRendering: function () {
		var oFilterBar = this.byId("listReportFilter"),
			tfilterGroupItems,
			oVariantManagementFilter = oFilterBar.getVariantManagement(),
			tVariantManagementFilterItems = oVariantManagementFilter.getVariantItems(),
			sDefaultVariantFilterKey = oVariantManagementFilter.getDefaultVariantKey(),

			oSmartTable = this.byId("listReport"),
			//Attention : Pas de getter pour le variantManagement, revoir � la prochaine �volution
			oVariantManagementTable = oSmartTable._oVariantManagement,
			tVariantManagementTableItems = oVariantManagementTable.getVariantItems(),
			sDefaultVariantTableKey = oVariantManagementTable.getDefaultVariantKey(),

			ret;

		//Suppression de tous les filtres polluants (associations)
		tfilterGroupItems = oFilterBar.getFilterGroupItems();
		tfilterGroupItems.forEach(function (ofilterGroupItem) {
			if (ofilterGroupItem.getGroupName().startsWith('to_')) {
				ofilterGroupItem.setVisible(false);
			}
		});

		//Variante par d�faut pour tous les utilisateurs
		if (sDefaultVariantFilterKey === "*standard*") {
			tVariantManagementFilterItems.every(function (item, index) {
				if (item.getText().startsWith('Par d�faut')) {
					sDefaultVariantFilterKey = item.getKey();
					oVariantManagementFilter.setCurrentVariantId(sDefaultVariantFilterKey);
					ret = false;
				} else {
					ret = true;
				}

				return ret;
			});
		}

		if (sDefaultVariantTableKey === "*standard*") {
			tVariantManagementTableItems.every(function (item, index) {
				if (item.getText().startsWith('Par d�faut')) {
					sDefaultVariantTableKey = item.getKey();
					oVariantManagementTable.setCurrentVariantId(sDefaultVariantTableKey);
					ret = false;
				} else {
					ret = true;
				}

				return ret;
			});
		}
	}

});