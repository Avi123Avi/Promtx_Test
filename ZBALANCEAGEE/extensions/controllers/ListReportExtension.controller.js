sap.ui.controller("reporting_balance_agee.extensions.controllers.ListReportExtension", {

  onInit: function(){
    var oDatePicker = this.getView().byId("BalanceAgee_KeyDate"),
      oDateFormat = sap.ui.core.format.DateFormat.getInstance("short"),
      oDate = new Date();

    oDatePicker.setValue(oDateFormat.format(oDate));
  },

  onAfterRendering: function () {
      //Id trouvé dans le changes.changes-bundle sinon chercher à l'aide de l'onglet Elements du debugger.
      var oSmartTable = this.byId("reporting_balance_agee::sap.suite.ui.generic.template.ListReport.view.ListReport::ZC_BalanceAgeeResults--listReport");
      //Déclaration de l'event
      oSmartTable.attachBeforeExport(function (oEvent) {
      var oExportSettings = oEvent.getParameter("exportSettings");
        if(oExportSettings){
          oExportSettings.dataSource.sizeLimit = oExportSettings.dataSource.count;
        }
      });
    },

  onBeforeRebindTableExtension: function(oEvent) {
    var oSmartTable = oEvent.getSource(),
      oSmartFilterbar = this.byId(oSmartTable.getSmartFilterId()),
      oDateTimeFormat = sap.ui.core.format.DateFormat.getInstance({pattern: "yyyy-MM-ddThh:mm:ss"}),
      oDate = oSmartFilterbar.getControlByKey("KeyDate"),
      // oInterval1 = oSmartFilterbar.getControlByKey("Interval1"),
      // oInterval2 = oSmartFilterbar.getControlByKey("Interval2"),
      // oInterval3 = oSmartFilterbar.getControlByKey("Interval3"),
      // oInterval4 = oSmartFilterbar.getControlByKey("Interval4"),
      // oInterval5 = oSmartFilterbar.getControlByKey("Interval5"),
      // oInterval6 = oSmartFilterbar.getControlByKey("Interval6"),
      sDate, sDateName;
      // sInterval1, sInterval2, sInterval3, sInterval4, sInterval5, sInterval6,, sIntervalName1, sIntervalName2, sIntervalName3, sIntervalName4, sIntervalName5, sIntervalName6


    if (oDate.getValue() > "" 
    // && oInterval1.getValue() > "" && oInterval2.getValue > "" && oInterval3.getValue() > "" && oInterval4.getValue() > "" && oInterval5.getValue() > "" && oInterval6.getValue() > ""
    ){
      // sInterval1 = oInterval1.getValue();
      // sIntervalName1 = oInterval1.getName();
      // sInterval2 = oInterval2.getValue();
      // sIntervalName2 = oInterval2.getName();
      // sInterval3 = oInterval3.getValue();
      // sIntervalName3 = oInterval3.getName();
      // sInterval4 = oInterval4.getValue();
      // sIntervalName4 = oInterval4.getName();
      // sInterval5 = oInterval5.getValue();
      // sIntervalName5 = oInterval5.getName();
      // sInterval6 = oInterval6.getValue();
      // sIntervalName6 = oInterval6.getName();
      sDate = encodeURIComponent("datetime'" + oDateTimeFormat.format(oDate.getDateValue()) + "'");
      sDateName = oDate.getName();

      oSmartTable.setTableBindingPath("/ZC_BalanceAgee(" 
        + sDateName + "=" + sDate +
        // "," 
        // + sIntervalName1 + "=" + sInterval1 + ","
        // + sIntervalName2 + "=" + sInterval2 + ","
        // + sIntervalName3 + "=" + sInterval3 + ","
        // + sIntervalName4 + "=" + sInterval4 + ","
        // + sIntervalName5 + "=" + sInterval5 + ","
        // + sIntervalName6 + "=" + sInterval6 + 
        ")/Results");
    }
  },

  onBeforeRendering: function() {
    var oFilterBar = this.byId("listReportFilter"), 
      tfilterGroupItems, 
      oVariantManagementFilter = oFilterBar.getVariantManagement(),
      tVariantManagementFilterItems = oVariantManagementFilter.getVariantItems(),
      sDefaultVariantFilterKey = oVariantManagementFilter.getDefaultVariantKey(),

      oSmartTable = this.byId("listReport"), 
      //Attention : Pas de getter pour le variantManagement, revoir à la prochaine évolution
      oVariantManagementTable = oSmartTable._oVariantManagement,
      tVariantManagementTableItems = oVariantManagementTable.getVariantItems(),
      sDefaultVariantTableKey = oVariantManagementTable.getDefaultVariantKey(),

      ret;

    //Suppression de tous les filtres polluants (associations)
    tfilterGroupItems = oFilterBar.getFilterGroupItems();
    tfilterGroupItems.forEach(function(ofilterGroupItem) {
      if (ofilterGroupItem.getGroupName().startsWith('to_')) {
        ofilterGroupItem.setVisible(false);
      }
    });

    //Variante par défaut pour tous les utilisateurs
    if (sDefaultVariantFilterKey === "*standard*") { 
      tVariantManagementFilterItems.every(function(item, index) {
        if (item.getText().startsWith('Par défaut')) {
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
      tVariantManagementTableItems.every(function(item, index) {
        if (item.getText().startsWith('Par défaut')) {
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