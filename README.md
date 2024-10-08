# Project Assessment
Module 6: Datacentric Development \
Submitted by: Tan Chee Meng (Sam Tan) \
Date: 09-Oct-2024 \
GitHub link: https://github.com/SamTan20240527/DatacentricDevelopment

# Introduction
A souvenirs distributor needs a sales order system to keep track of products and sales orders
- First collection = item: item_number, description, country_of_origin, price
- Second collection = sales_order: orderId, item_number, order_quantity, delivery_date (other data such as customer, address, etc. are skipped to reduce data-entry during testing)
- Relationship = sales_order.item_number is foreign key to item.item_number. In other words, item_number must exist in item

# RESTful API testing on Thunder Client in VS Code
## Test server
![Test Server](test_data/TestServer.png)
## Testing






