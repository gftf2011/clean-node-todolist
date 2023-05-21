# Create Note - Business Rule

> ## Success Case - REST

1.  ✅ Receives **POST** request at route **/api/V1/create-note**
2.  ✅ Validates if **authorization** header is valid
3.  ✅ Validates required fields **title**, **description**
4.  ✅ Validates if **title** length is between 1 and 120 characters
5.  ✅ Validates if **description** length is between 1 and 1000 characters
6.  ✅ Checks if user with given email already exists
7.  ✅ Note title is **encrypted** for security reasons
8.  ✅ Note description is **encrypted** for security reasons
9.  ✅ **Creates** note with encrypted values
10. ✅ Returns **201** status code

> ## Success Case - GraphQL

1.  ✅ Receives **POST** request at route **/graphql** with mutation **createNote**
2.  ✅ Validates if **authorization** header is valid
3.  ✅ Validates required fields **title**, **description**
4.  ✅ Validates if **title** length is between 1 and 120 characters
5.  ✅ Validates if **description** length is between 1 and 1000 characters
6.  ✅ Checks if user with given email already exists
7.  ✅ Note title is **encrypted** for security reasons
8.  ✅ Note description is **encrypted** for security reasons
9.  ✅ **Creates** note with encrypted values
10. ✅ Returns **201** status code

> ## Error Case

1. ❗Returns status error **400** if **title**, **description** were not provided by client
2. ❗Returns status error **400** if **title**, **description** were invalid
3. ❗Returns status error **401** if authorization token is expired
4. ❗Returns status error **401** if user does not exists in database
5. ❗Returns status error **500** if occurs problem in the database
6. ❗Returns status error **503** if database is unavailable
7. ❗Returns status error **599** if unmapped error occurs