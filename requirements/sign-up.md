# Sing Up - Business Rule

> ## Success Case - REST

1.  ✅ Receives **POST** request at route **/api/V1/sign-up**
2.  ✅ Validates required fields **name**, **lastname**, **email**, **password**
3.  ✅ Validates if **name** length is between 1 and 255 characters
4.  ✅ Validates if **lastname** length is between 1 and 255 characters
5.  ✅ Validates if **email** is valid
6.  ✅ Validates if **password** has at least:
    1. 8 numbers
    2. 1 lowercase letter
    3. 1 uppercase letter
    4. 1 specail character - (^!@#$%&?)
    5. length is less than 24
7.  ✅ Checks if user with given email does not exists
8.  ✅ User email is **encrypted** for security reasons
9.  ✅ User password is **hashed** for security reasons - (not reversible)
10. ✅ **Creates** user account with encrypted and hashed values
11. ✅ Creates **access-token** using code generated ID
12. ✅ Returns **201** status code with **access-token**

> ## Success Case - GraphQL

1.  ✅ Receives **POST** request at route **/graphql** with mutation **signUp**
2.  ✅ Validates required fields **name**, **lastname**, **email**, **password**
3.  ✅ Validates if **name** length is between 1 and 255 characters
4.  ✅ Validates if **lastname** length is between 1 and 255 characters
5.  ✅ Validates if **email** is valid
6.  ✅ Validates if **password** has at least:
    1. 8 numbers
    2. 1 lowercase letter
    3. 1 uppercase letter
    4. 1 specail character - (^!@#$%&?)
    5. length is less than 24
7.  ✅ Checks if user with given email does not exists
8.  ✅ User email is **encrypted** for security reasons
9.  ✅ User password is **hashed** for security reasons - (not reversible)
10. ✅ **Creates** user account with encrypted and hashed values
11. ✅ Creates **access-token** using code generated ID
12. ✅ Returns **200** status code with **access-token**

> ## Error Case

1. ❗Returns status error **400** if **name**, **lastname**, **email**, **password** were not provided by client
2. ❗Returns status error **400** if **name**, **lastname**, **email**, **password** were invalid
3. ❗Returns status error **403** email provided already exists
4. ❗Returns status error **500** if occurs problem in the database
5. ❗Returns status error **503** if database is unavailable
6. ❗Returns status error **599** if unmapped error occurs