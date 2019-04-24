//nice to have: triggered month year
//myFunction("2018-12-01", "2018-12-31");

/**
*Create the spreadsheet based on the start and end dates given
*@param start_date The date from where the function will begin to get orders
*@param end_date The date where the function will stop getting orders
*/
function myFunction(start_date, end_date) {
//function myFunction() {
  //var start_date = "2018-10-01";
  //var end_date = "2018-10-31";
  //get the array of objects
  //call order_function with appropriate start and end date strings as parameters
  var orders = order_function(start_date, end_date);
  
  //ss is the spreadsheet that the script will work with
  //var ss = SpreadsheetApp.getActiveSpreadsheet();
  //working with the first worksheet in the spreadsheet, hence [0]
  //var sheet = ss.getSheets()[0];
  
  //create the array that will hold the sheet values
  var sheet_values = [];
  
  //create an array that will hold the header values
  var header_values = [
     "customer_id", "first_name", "last_name", "status", "order_type", "location", 
     "personality_style", "what_are_you", "fave_clothing_type", "weight", 
     "dress_size_letter", "dress_size_number", "top_size_number", "top_size_letter",
     "bottom_size_number", "bottom_size_letter", "denim_size", "jacket_size_number",
     "jacket_size_letter", "shoe_size", "bra_size", "birth_day", "birth_month", "birth_year"];
  
  //push the header values into the sheet_values array
  sheet_values.push(header_values);

  //set the range of columns that will be populated by the information
  //var range = sheet.getRange("A1:W1");
  
  //loop to get the required elements from the orders and customer arrays
  //doo this x amount of times equal to the length of the orders array
  for (var i = 0; i < orders.length; i++) {
    
    //create an array to hold the values that will populate the rows
    var myArr = [];
    //customer_info will be the object that will hold the information of each specific customer
    //customers will be identified by the id element in orders
    var customer_info = customer_function("https://customr.heliumdev.com/api/v1/customers/",orders[i]["id"]);
    
    //push the required information into myArr and convert to string
    myArr.push(orders[i]["id"].toString());
    myArr.push(orders[i]["first_name"].toString());
    myArr.push(orders[i]["last_name"].toString());
    myArr.push(orders[i]["status"].toString());
    myArr.push(JSON.stringify(orders[i]["order_type"]));
    myArr.push(JSON.stringify(orders[i]["location"]));
    myArr.push(JSON.stringify(customer_info["personality_style"]));
    myArr.push(JSON.stringify(customer_info["what_are_you"]));
    myArr.push(JSON.stringify(customer_info["fave_clothing_type"]));
    myArr.push(JSON.stringify(customer_info["weight"]));
    myArr.push(JSON.stringify(customer_info["dress_size_letter"]));
    myArr.push(JSON.stringify(customer_info["dress_size_number"]));
    myArr.push(JSON.stringify(customer_info["top_size_number"]));
    myArr.push(JSON.stringify(customer_info["top_size_letter"]));
    myArr.push(JSON.stringify(customer_info["bottom_size_number"]));
    myArr.push(JSON.stringify(customer_info["bottom_size_letter"]));
    myArr.push(JSON.stringify(customer_info["denim_size"]));
    myArr.push(JSON.stringify(customer_info["jacket_size_number"]));
    myArr.push(JSON.stringify(customer_info["jacket_size_letter"]));
    myArr.push(JSON.stringify(customer_info["shoe_size"]));
    myArr.push(JSON.stringify(customer_info["bra_size"]));
    myArr.push(JSON.stringify(customer_info["birth_day"]));
    myArr.push(JSON.stringify(customer_info["birth_month"]));
    myArr.push(JSON.stringify(customer_info["birth_year"]));
    
    //push the information created in each iteration into sheet_values
    //these values will be the rows on the spreadsheet
    sheet_values.push(myArr);
  }
  
  //return sheet_valuse in order to print them on the spreadsheet  
  return sheet_values;
}

/**
*Returns an object with the required customer information 
*@param url url to be used to get the customer data from
*@param customer_id The id of the customer who's information the function will be getting
*/
function customer_function(url, customer_id){
  
  //headers information
  var headers = 
      { 
        "content-type": "application/json",
        "Accept": "application/json",
        "Authorization": "Token token=\"2d7cb22d7a2ae934faf1a4f3b4d9acea3e312f6672eeee1d2428fd5ed5c2b0ce\""
      };
  
  //options information
  var options = 
      { 
        "content-type": "application/json",
        "method": "GET",
        "headers": headers
      };

  //convert customer_id into a string and concatenate to the url 
  var url_2 = url + customer_id.toString();
  //get data using new url and options as parameters
  var response = UrlFetchApp.fetch(url_2, options);
  //get the content of the data as text
  var content = response.getContentText();

  //convert the content into a JSON object
  var customer = JSON.parse(content);
  
  //create a customer_info object to store the required information
  var customer_info = {};
  
  //add the information into the customer_info object
  customer_info["personality_style"] = customer["customer"]["What is your style personality"];
  customer_info["what_are_you"] = customer["customer"]["What are you "];
  customer_info["fave_clothing_type"] = customer["customer"]["favorite clothing typ"];
  customer_info["weight"] = customer["customer"]["What is your weight"];
  customer_info["dress_size_letter"] = customer["customer"]["Dress Size"];
  customer_info["dress_size_number"] = customer["customer"]["Choose one number"];
  customer_info["top_size_number"] = customer["customer"]["Choose one number "];
  customer_info["top_size_letter"] = customer["customer"]["Choose one letter"];
  customer_info["bottom_size_number"] = customer["customer"]["Choose one number BS"];
  customer_info["bottom_size_letter"] = customer["customer"]["Choose one letter BS"];
  customer_info["denim_size"] = customer["customer"]["One letter DWS"];
  customer_info["jacket_size_number"] = customer["customer"]["Choose one number JS"];
  customer_info["jacket_size_letter"] = customer["customer"]["Choose one letter JS"];
  customer_info["shoe_size"] = customer["customer"]["Choose one number to SS"];
  customer_info["bra_size"] = customer["customer"]["one to designate your bra size"];
  customer_info["birth_day"] = customer["customer"]["birthday_day"];
  customer_info["birth_month"] = customer["customer"]["birthday_month"];
  customer_info["birth_year"] = customer["customer"]["birthday_year"];
  
  //return customer_info which now has all of the required information
  return customer_info;
}

/**
*Returns an array of order objects with the required information
*@param start_date The date from where the function will begin to get orders
*@param end_date The date where the function will stop getting orders
*/
function order_function(start_date, end_date){
  
  //header information
  var headers = {
    "Authorization" : "Basic " + Utilities.base64Encode("d23586849c609cd4cdaf38cb9512eac7" + ':' + "66e3424aceb0ffbaaa9afa7f74d7c874")
  };

  //params information
  var params = {
    "method":"GET",
    "headers":headers
  };
  
  //get data using the url and given start and end dates alongside params as arguments
  //the start and end dates will be turned into strings and concatenated to the url
  var response = UrlFetchApp.fetch("https://luxe-catch.myshopify.com/admin/orders.json?created_at_min=" + start_date.toString() + "T00:00:00-05:00&created_at_max=" + end_date.toString() + "T23:59:59-05:00&status=any&limit=250", params);
  //get the data as text
  var content = response.getContentText();
  Logger.log(content);
  //convert the content into a JSON object
  var orders = JSON.parse(content);
  
  //create an array that will hold the order information
  var orderdisparr =[] 
  
  //loop to get the required information from orders
  for (var i = 0; i < orders["orders"].length; i++){
    
       //create an object to hold the information
       
       var line_item_count = orders["orders"][i]["line_items"].length;
      
          for (var j = 0; j < line_item_count; j++){
             var orderdisp= {};
       //get data from each object in orders
             orderdisp["id"] = orders["orders"][i]["customer"]["id"].toString();
             orderdisp["first_name"] = orders["orders"][i]["customer"]["first_name"];
             orderdisp["last_name"] = orders["orders"][i]["customer"]["last_name"];
             orderdisp["location"] = orders["orders"][i]["billing_address"]["province_code"];
       
       //check if order type has "monthly" in it
             var ordersp = orders["orders"][i]["line_items"][j]["title"].toLowerCase();
             orderss = "monthly";
    
       //if order type contains monthly, then add it to orderdisp
            if(ordersp.indexOf(orderss) !== -1){
              orderdisp["order_type"] = ordersp;
            }              
            
            var order_status = orders["orders"][i]["line_items"][j]["fulfillment_status"];
            if(order_status == null){
              orderdisp["status"] = "unfullfilled";
            }
            else{
              orderdisp["status"] = order_status;
            }
            
            orderdisparr.push(orderdisp);
          }
      
       //orderdisp["status"] = orders["orders"][i]["line_items"][0]["fulfillment_status"].toLowerCase();

       //push the object with the required information into the array
       
  }
  
  //return orderdisparr which contains an array of order objects with the required information
  return orderdisparr;  
}
