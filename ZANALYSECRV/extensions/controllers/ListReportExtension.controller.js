sap.ui.controller("reporting_analyse_crv.extensions.controllers.ListReportExtension", {
	
    onAfterRendering: function () {
      //Id trouvé dans le changes.changes-bundle sinon chercher à l'aide de l'onglet Elements du debugger.
      var oSmartTable = this.byId("reporting_analyse_crv::sap.suite.ui.generic.template.ListReport.view.ListReport::ZC_AnalyseCRV--listReport");
            //Déclaration de l'event 
      oSmartTable.attachBeforeExport(function (oEvent) {
      var oExportSettings = oEvent.getParameter("exportSettings");
        if(oExportSettings){
          oExportSettings.dataSource.sizeLimit = oExportSettings.dataSource.count;
        }
      }.bind(this));
    
    oSmartTable.attachDataReceived(function(oEvent){
    	this._exportApplicationFilters = [];
    	//save filters
    	if(oEvent.getParameter("oSource").aApplicationFilter[0]){
    		if(oEvent.getParameter("oSource").aApplicationFilter[0].aFilters){
    			this._exportApplicationFilters = oEvent.getParameter("oSource").aApplicationFilter[0].aFilters;
    		} else {
    			this._exportApplicationFilters.push(oEvent.getParameter("oSource").aApplicationFilter[0]);
    		}
    	}
		//save FieldGroup for aggregation
		this._exportMaxAggregationLevel  = oEvent.getParameter("oSource").getDimensionDetails();	
		//save FieldMeasure
		this._exportaMeasureName =  oEvent.getParameter("oSource").getMeasureDetails();
		//save path 
		this._exportPath = oEvent.getParameter("oSource").getPath();
    }.bind(this));
    
    var oButton = new sap.m.Button({
    	text:"Extraction Serveur",
    	icon:"sap-icon://download", // https://sapui5.hana.ondemand.com/test-resources/sap/m/demokit/iconExplorer/webapp/index.html
    	press: function(oEvent){
    		//Lire et créer les paramètres du function import.
    		var path = this._exportPath;
    		var fieldGroup = "";
    		var fieldMeasure = "";
    		//Alimentation du FieldGroup tel qu'on a A, B, C...
    		Object.keys(this._exportMaxAggregationLevel).forEach(function(key,index) {
    				if(index === 0){
    					fieldGroup = key;
    				} else {
    					fieldGroup = fieldGroup.concat(', ', key);
    				}
    				return fieldGroup;
    		}.bind(fieldGroup));
			//Alimentation du FieldMeasure tel qu'on aSUM( A ) , SUM( B ) , SUM( C ) ...    		
    		Object.keys(this._exportaMeasureName).forEach(function(key,index) {
    			if(index === 0){
    					fieldMeasure = fieldMeasure.concat('SUM( ', key, ' )');
    				} else {
    					fieldMeasure = fieldMeasure.concat(' , SUM( ', key, ' )');
    				}
    				return fieldMeasure;
    		}.bind(fieldMeasure));
    		
    		//Creation des filtres (function crée plus bas)
    		var filter = "";
    		var andJSymbol = "";
    		filter = this.createFilters(this._exportApplicationFilters, filter, andJSymbol);
			
			//function import
			sap.m.MessageToast.show("L'exportation des données a été lancée en arrière plan.", {
				duration: 3000,
				animationDuration: 300

			});
    		this.getView().getModel("exportExcel").callFunction("/excelExportSpe", {
				method: "POST",
				urlParameters: {
					"path": path,
					"fieldGroup": fieldGroup,
					"fieldMeasure": fieldMeasure,
					"filter": filter
				},
				//success
				success: function (oResponse) {
					// Do nothing
				}.bind(this),
				//error
				error: function (oError) {
					sap.m.MessageBox.error("Une erreur est survenue lors de l'extraction en arrière plan");
				}.bind(this)
			});
    	}.bind(this)
    });
    //Get Toolbar ID to add the new button 
    var oToolbar = oSmartTable.getItems()[0];
    oToolbar.addContent(oButton);
  },
  
  createFilters: function(aFilters, filterString, andJ1Symbol){
  	var j = 0;
  	var andJSymbol = "";

  	if (andJ1Symbol === "" || andJ1Symbol === true){
		andJ1Symbol = "and";
	} else {
		andJ1Symbol = "or";
	}
		
  	for ( j = 0; j < aFilters.length; j++){
  		var oValue1 = undefined;
  		var oValue2 = undefined;
  		var date = "";
  		var val = "";
  		
  		function pad(num, size) {
		    var s = num+"";
		    while (s.length < size) s = "0" + s;
		    return s;
		}
  		
		if (andJSymbol === "" || aFilters[j].bAnd === true){
			andJSymbol = " and ";
		} else {
			andJSymbol = " or ";
		}
		
		if (filterString === "" || j === 0){
			filterString = filterString.concat(" ( ");
		} else {
			filterString = filterString.concat( andJ1Symbol, " ( ");
		} 
		
	 	if(Object.prototype.hasOwnProperty.call(aFilters[j], "sPath" )){
	 		oValue1 = aFilters[j].oValue1;
	 		oValue2 = aFilters[j].oValue2;
	 		//If type of = object => Date => Convert in 'yyyymmdd'
	 		if (typeof oValue1 === "object"){
	 			date = "";
	 			date = date.concat("'", oValue1.getFullYear(), pad(oValue1.getMonth() + 1 , 2), pad(oValue1.getDate(), 2), "'");
	 			oValue1 = date;
	 		} else if (typeof oValue1 === "string"){
	 			val = "";
	 			val = val.concat("'", oValue1, "'");
	 			oValue1 = val;
	 		}
	 		if (typeof oValue2 === "object"){
	 			date = "";
	 			date = date.concat("'", oValue2.getFullYear(), pad(oValue2.getMonth() + 1 , 2), pad(oValue2.getDate(), 2), "'");
	 			oValue2 = date;
	 		} else if (typeof oValue2 === "string"){
	 			val = "";
	 			val = val.concat("'", oValue2, "'");
	 			oValue2 = val;
	 		}
	 		if (oValue2 === undefined){
	 			filterString = filterString.concat(aFilters[j].sPath, ' ', aFilters[j].sOperator, ' ', oValue1);
	 		} else {
				filterString = filterString.concat(aFilters[j].sPath, ' ', aFilters[j].sOperator, ' ', oValue1, ' and ', oValue2);
	 		}
		} else {
			andJSymbol = aFilters[j].bAnd;
			filterString = this.createFilters(aFilters[j].aFilters, filterString, andJSymbol);
		}
		filterString = filterString.concat( " ) ");
	}
	
  	return filterString;
  }
  
  
});