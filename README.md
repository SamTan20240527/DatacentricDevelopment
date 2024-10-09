# Project Assessment
Module 6: Datacentric Development \
Submitted by: Tan Chee Meng (Sam Tan) \
Date: 09-Oct-2024 \
GitHub link: https://github.com/SamTan20240527/DatacentricDevelopment/

# Introduction
A souvenirs distributor needs a sales order system to keep track of products and sales orders
- Database: sales_order_app
  - Primary collection: item
    - Document fields: item_number, description, country_of_origin, price 
  - Secondary collection: sales_order
    - Document fields: _id, item_number, order_quantity, delivery_date \
    (Other data such as customer, address, etc. are skipped to reduce data-entry during testing)
  - Relationship: <sales_order.item_number> is the foreign key to <item.item_number>

# RESTful API testing in VS Code extension Thunder Client
## Test server: http://localhost:3000/
![Test Server](test_data/TestServer.png)
## POST users: {"email":"samtan@abc.com", "password":"abc123"}
![POST users](test_data/POSTusers.png)
## POST login to get token: {"email":"samtan@abc.com", "password":"abc123"}
![POST login](test_data/POSTloginToGetToken.png)
## GET profile by pasting the token at Auth-Bearer: http://localhost:3000/profile/
![GET profile](test_data/GETprofileFromLoginToken.png)
## GET item: http://localhost:3000/item/
![GET item](test_data/GETitem.png)
## POST item: http://localhost:3000/item/
![POST item](test_data/POSTitem.png)
## GET sales_order: http://localhost:3000/sales_order/<_id>
![GET sales_order](test_data/GETsales_order.png)
## POST sales order: http://localhost:3000/sales_order/
![POST sales_order success](test_data/POSTsales_orderSuccess.png)
![POST sales_order failed](test_data/PUTsales_orderFailedItemInvalid.png)
## PUT sales_order: http://localhost:3000/sales_order/<_id>
![PUT sales_order success](test_data/PUTsales_orderSuccess.png)
![PUT sales_order failed](test_data/PUTsales_orderFailedItemInvalid.png)
## DELETE sales order: http://localhost:3000/sales_order/<_id>
![DELETE sales_order](test_data/DELETEsales_order.png)
-end-







