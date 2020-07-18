// --------------------------------------------------
// Budget controller
// --------------------------------------------------
let budgetController = (function(){ 

    let Expenses = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
      
    };

    // for each separate button percentage in expenses 
    // calculates the value
    Expenses.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = ((this.value / totalIncome) * 100).toFixed(2);
        }else{
            this.percentage = 0;
        }
        
    };

    // returns the value
    Expenses.prototype.getPercentage = function(){
        return this.percentage;
    };

    let Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let calculateTotal = function(type){
        let sum = 0;

        data.allItems[type].forEach(function(current) {
            sum += current.value;
        });
        // store the data in data.totals[type]
        data.totals[type] = sum;
    };

    // arrays to store income and expenses 
    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: {
            estimate: 0,
            percentage: -1
        }

    }

    return {
        addItem: function(type, des, val) {
            let newItem, iD;
            
            // adding the last item of the array
            // ex: [1,2,4,6,8] the nest item should be 9
            // define .id
            if(data.allItems[type].length > 0){
                iD = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                iD = 0;
            }
            

            if (type === 'exp') {
                newItem = new Expenses(iD, des, val);
            }else if (type === 'inc') {
                newItem = new Income(iD, des, val);
            }

            // push it into the data structure (array of objects)
            data.allItems[type].push(newItem);

            // return the item
            return newItem;

        },

        deleteItem: function(type, id) {
            let ids, index;

            // ex: id = 6
            // data.allItems[type][id]
            // ids = [1 2 4 6 8]
            // index = 3
            // map will create a new array
            ids = data.allItems[type].map(current => current.id);
            // index return the id number of the array
            index = ids.indexOf(id);

            // slice to remove elements 
            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function() {
            // calculate total income and expenses
            calculateTotal('inc');
            calculateTotal('exp');


            // calculate the budget: income - expenses
            if(data.totals.inc > 0){
                data.budget.estimate = data.totals.inc - data.totals.exp;
            }
            
            // calculate the percentage of income spent
            if(data.totals.inc > 0){
                data.budget.percentage = ((data.totals.exp / data.totals.inc) * 100).toFixed(2);
                // console.log('total_inc: ' + data.totals.inc);
            }else if(data.totals.inc <= 0){
                data.budget.percentage = 0;
                data.budget.estimate = 0;
            }

            

        },

        // updateBudget()
        // displayBudget function 
        getBudget: function() {
            return {
                totalBudget: data.budget.estimate, //actual budget
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.budget.percentage

            };
        },

        calculatePercentages: function() {

            data.allItems.exp.forEach(function(curr){
                curr.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function() {
            // map creates an array and stores it in allPercents
            let allPercents = data.allItems.exp.map(cur => cur.getPercentage());
            return allPercents;
        },

        testing: function(){
            console.log(data);
        }
    }


})();


// --------------------------------------------------
// UI controller
// --------------------------------------------------
let UIController = (function(){ 

    let DOMStrings = {
        inputType: '.add_type',
        inputDescription: '.input_description',
        inputValue: '.input_value',
        inputButton: '.add_btn',
        incomeContainer: '.income_0',
        expensesContainer: '.expenses_1',
        totalBudget: '.total',
        totalIncome: '.total_income',
        totalExpenses: '.total_expenses',
        budgetPercentage: '.btn_percentage',
        btnPercentage: '.item_delete_btn_exp',
        container: '#container_expenses',
        month: '.month'
    };

     // format the number
     let formatNumber = function(num, type) {
        let numSplit, int, dec;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if(int.length > 3){
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length-3, 3);
        }
        dec = numSplit[1];

        // ternary operator
        // type === 'exp' ? '-' : '+';
        if(type === null){
            return int + '.' + dec;
        }else{
            return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
        }
        
    
    };
    let nodeListForEach = function(list, callback){
        for (let i = 0; i < list.length; i++){
            // call back nodeListForEach() function
            // iterate based on the length of nodeListForEach function
            callback(list[i], i);

        }
    };

    
    
    return {
        getInput: function () {
            // return the objects from DOMStrings
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                // parseFloat convert string into an integer
                amount: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };

        },

        addListItems: function(obj, type) {

            let html, newHtml, element, fields, fieldsArray;

            // create HTML string with placeholder text 
            if(type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="income_list" id="inc-%id%"><div class="item_description">%description%</div>\
                <div class="item_value">%value%</div><div class="item_delete">\
                <button class="item_delete_btn"><i class="btn_style"></i></button>\
                </div></div>';

            }else if (type === 'exp'){
                element = DOMStrings.expensesContainer;
                html = '<div class="expenses_list" id="exp-%id%"><div class="item_description">%description%</div>\
                <div class="item_value">%value%</div><div class="item_delete">\
                <button class="item_delete_btn_exp"> <i class="btn_style"></i></button>\
                </div></div>';
            }

            // Replace the placeholder text with some actual data 

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
           
           


            // Insert the HTML into the DOM
            // beforeend will be inserted before the end of the parent of the child
            // parent expenses_1 and income_0
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);


        },

        // delete income and expenses being added
        deleteListItem: function(selectorID) {

            let child = document.getElementById(selectorID);
            child.parentNode.removeChild(child);
        
           
        },

        clearFields: function() {
            fields = document.querySelectorAll(DOMStrings.inputDescription + ' , ' + DOMStrings.inputValue);

            // make a list into an array
           fieldsArray = Array.prototype.slice.call(fields);

        //     clears the fields 
           fieldsArray.forEach(function(current) {
               current.value = '';
           });
           
        //    brings the cursor into the description field after each enter
           fieldsArray[0].focus();
        },

        displayBudget: function(obj) {
            
            document.querySelector(DOMStrings.totalBudget).textContent =  '$' + formatNumber(obj.totalInc, null);
            document.querySelector(DOMStrings.totalExpenses).textContent =  '$' + formatNumber(obj.totalExp, null);
            document.querySelector(DOMStrings.totalIncome).textContent =  '$' + formatNumber(obj.totalBudget, null);
            document.querySelector(DOMStrings.budgetPercentage).textContent = obj.percentage + '%';
            
        },

        displayPercentages: function(percentages) {
            
            let fields = document.querySelectorAll(DOMStrings.btnPercentage);

            
            nodeListForEach(fields, function(current, index) {
                current.textContent = percentages[index] + '%';
                
            });
        },

        displayMonth: function() {
            let now, year, month, month_name;
            now = new Date();

            month_name = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 
        'September', 'October', 'November', 'December'];

            year = now.getFullYear();
            month = now.getMonth();

            document.querySelector(DOMStrings.month).textContent = month_name[month] + ' ' + year;

        },

        // it will change the color of the select option based on the input
        changedType: function(){

            let fields = document.querySelectorAll(
                DOMStrings.inputType);

            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red_focus');
            });


        },

        getDomStrings: function() {
            return DOMStrings;
        },

    }
})();

// --------------------------------------------------
//  global app controller 
// --------------------------------------------------
let controller = (function(budgetCtrl, UICtrl){

    let setupEventListeners = function () {
        let DOM = UICtrl.getDomStrings();

        // response when the button is pressed
        // get the object from UIController
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem)


        // response when the "Enter key works"
        document.addEventListener('keypress', function (event) {
            // key press event
            // to get the key code
            // console.log(event);

            if (event.keyCode === 13 || event.which === 13) {
                // console.log('Enter key was pressed');
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    }

    let updatePercentages = function () {

        // calculate individual percentages 
        budgetCtrl.calculatePercentages();

        // read percentages from the budget controller
        let percentages  = budgetCtrl.getPercentages();

        // update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
        console.log(percentages);
    }

    let updateBudget = function() {
        // calculate the budget
        budgetCtrl.calculateBudget();

        // return the budget 
        let budget = budgetCtrl.getBudget();


        // display the budget on the UI 
        UICtrl.displayBudget(budget);

        // console.log(budget);
    }

   
    let ctrlAddItem = function(){
        let input, newItem;

        // 1.get the input data
        input = UICtrl.getInput();
        // console.log(input);


        if (input.description !== "" &&  !isNaN(input.amount) &&  input.amount > 0){

            // 2.add the item to the budget controller
            // addItem accepts the parameters from getInput()
            newItem = budgetCtrl.addItem(input.type, input.description, input.amount);


            // 3.add the item to the UI
            UICtrl.addListItems(newItem, input.type);

            UICtrl.clearFields();

            // 4.calculate the budget
            updateBudget();
           
            // calculate and update percentages
            updatePercentages();

            // console.log('The crlAdditem function works');

        }else{
            alert("Please check your input, there is something missing");
        }
        
    }

    let ctrlDeleteItem = function(event) {
        let itemID, splitID, type, ID;

        // to get the id of the property
        // console.log(event.target.parentNode.id);
        // traversing 
        itemID = event.target.parentNode.parentNode.id;

        if(itemID) {
            // ex: 'inc-1' -> split('-') -> ['inc', '1'] using the split method
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // delete the item from data structure
            budgetCtrl.deleteItem(type, ID);

            // delete the item from IU
            UICtrl.deleteListItem(itemID);

            // update and show the new budget 
            updateBudget();

            // calculate and update percentages
            updatePercentages();
        }
    }

    return {
        // this function will return other functions within
        init: function() {
            // console.log('Application has started');
            UICtrl.displayMonth();
            setupEventListeners();
        }
    };

})(budgetController, UIController);

// --------------------------------------------------
// must call the function from controller to work
// --------------------------------------------------
controller.init();