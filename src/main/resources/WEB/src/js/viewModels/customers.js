/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your customer ViewModel code goes here
 */
define(['ojs/ojcore', 'ojs/ojmodel', 'ojs/ojvalidation-base', 'knockout', 'ojs/ojknockout', 'ojs/ojdatagrid', 'ojs/ojcollectiondatagriddatasource', 'ojs/ojinputtext', 'ojs/ojinputnumber', 'ojs/ojdatetimepicker','ojs/ojformlayout'],
 function(oj, Model, Validation, ko) {

    function CustomerViewModel() {
      var self = this;
      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.

		  var dateOptions = { formatType: 'date', dateFormat: 'medium' };
          var dateConverterFactory = Validation.Validation.converterFactory("datetime");
          self.dateConverter = dateConverterFactory.createConverter(dateOptions);
  
          var salaryOptions = {
            style: "currency",
            currency: "USD",
            currencyDisplay: "symbol"
          };
          var salaryConverterFactory =
            Validation.Validation.converterFactory("number");
          self.salaryConverter =
            salaryConverterFactory.createConverter(salaryOptions);

	  self.url = '/greet/employees';

	  self.collection = new oj.Collection(null, {
	    model: new oj.Model.extend({
		idAttribute: 'id',
		urlRoot: self.url}),
	    url: self.url
	  });

	  self.dataSource = new oj.CollectionDataGridDataSource(
	   self.collection, {
	     rowHeader: 'id',
	     columns: ['FIRST_NAME', 'LAST_NAME', 'HIRE_DATE', 'SALARY']
	  });

		var nextKey = 121;
		self.inputEmployeeID = ko.observable(nextKey);
		self.inputFirstName = ko.observable();
		self.inputLastName = ko.observable();
		self.inputHireDate = ko.observable();
		self.inputSalary = ko.observable();
		
		//build a new model from the observables in the form
          self.buildModel = function () {
            return {
              'EMPLOYEE_ID': self.inputEmployeeID(),
              'FIRST_NAME': self.inputFirstName(),
              'LAST_NAME': self.inputLastName(),
              'HIRE_DATE': self.inputHireDate(),
              'SALARY': self.inputSalary()
            }
          }.bind(this);
		
		//used to update the fields based on the selected row
          self.updateFields = function (model) {
            self.inputEmployeeID(model.get('EMPLOYEE_ID'));
            self.inputFirstName(model.get('FIRST_NAME'));
            self.inputLastName(model.get('LAST_NAME'));
            self.inputHireDate(model.get('HIRE_DATE'));
            self.inputSalary(model.get('SALARY'));
          };
  
          //add the model to the collection at index 0
          self.add = function () {
            if (self.inputEmployeeID(nextKey) < nextKey) {
              self.inputEmployeeID(nextKey);
            }
            var model = self.buildModel();
            nextKey += 1;
            self.inputEmployeeID(nextKey);
            self.collection.add(model, { at: 0 });
          }.bind(this);
  
          // update the model in the collection
          self.update = function () {
            if (self.modelToUpdate) {
              self.modelToUpdate.set(self.buildModel());
            }
          }.bind(this);
  
          //remove the selected model from the collection
          self.remove = function () {
            self.collection.remove(self.modelToUpdate);
          }.bind(this);
  
          //reset the fields to their original values
          self.resetFields = function () {
            self.inputEmployeeID(nextKey);
            self.inputFirstName('Jane');
            self.inputLastName('Doe');
            self.inputHireDate(Validation.IntlConverterUtils.dateToLocalIso(new Date()));
            self.inputSalary(15000);
          }.bind(this);
  
          //intialize the observable values in the forms
          self.inputEmployeeID = ko.observable(nextKey);
          self.inputFirstName = ko.observable('Jane');
          self.inputLastName = ko.observable('Doe');
          self.inputHireDate = ko.observable(Validation.IntlConverterUtils.dateToLocalIso(new Date()));
          self.inputSalary = ko.observable(15000);
  
          self.getCellClassName = function (cellContext) {
            var key = cellContext['keys']['column'];
            if (key === 'SALARY') {
              return 'oj-helper-justify-content-right';
            }
            return 'oj-helper-justify-content-flex-start';
          }

		self.handleSelectionChanged = function (event) {
		     var selection = event.detail['value'][0];
		     if (selection != null) { 
		         var rowKey = selection['startKey']['row'];
		         self.modelToUpdate = self.collection.get(rowKey);
		         self.updateFields(self.modelToUpdate);
		     }
		};
  
     

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
      self.connected = function() {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function() {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      self.transitionCompleted = function() {
        // Implement if needed
      };
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new CustomerViewModel();
  }
);
