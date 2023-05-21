# Sing In - Business Rule

> ## Success Case - REST

1.  ✅ Receives **POST** request at route **/api/V1/sign-in**
2.  ✅ Validates required fields **email**, **password**
3.  ✅ Validates if **email** is valid
4.  ✅ Validates if **password** has at least:
    1. 8 numbers
    2. 1 lowercase letter
    3. 1 uppercase letter
    4. 1 specail character - (^!@#$%&?)
    5. length is less than 24
5.  ✅ Checks if user with given email already exists
6.  ✅ User email is again **encrypted** to check with the one in database
7.  ✅ User password is again **hashed** to check with the one in database
8.  ✅ Checks if user password matches with the one in database
9.  ✅ Creates **access-token** using code retrieved ID
10. ✅ Returns **200** status code with **access-token**

> ## Success Case - GraphQL

1.  ✅ Receives **POST** request at route **/graphql** with mutation **signIn**
2.  ✅ Validates required fields **email**, **password**
3.  ✅ Validates if **email** is valid
4.  ✅ Validates if **password** has at least:
    1. 8 numbers
    2. 1 lowercase letter
    3. 1 uppercase letter
    4. 1 specail character - (^!@#$%&?)
    5. length is less than 24
5.  ✅ Checks if user with given email already exists
6.  ✅ User email is again **encrypted** to check wit the one in database
7.  ✅ User password is again **hashed** to check with the one in database
8.  ✅ Checks if user password matches with the one in database
9.  ✅ Creates **access-token** using code retrieved ID
10. ✅ Returns **200** status code with **access-token**

> ## Error Case

1. ❗Returns status error **400** if **email**, **password** were not provided by client
2. ❗Returns status error **400** if **email**, **password** were invalid
3. ❗Returns status error **401** if email provided does not exists
4. ❗Returns status error **403** if password provided does not match
5. ❗Returns status error **500** if occurs problem in the database
6. ❗Returns status error **503** if database is unavailable
7. ❗Returns status error **599** if unmapped error occurs