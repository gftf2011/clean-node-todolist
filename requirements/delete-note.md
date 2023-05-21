# Delete Note - Business Rule

> ## Success Case - REST

1.  ✅ Receives **DELETE** request at route **/api/V1/delete-note**
2.  ✅ Validates if **authorization** header is valid
3.  ✅ Validates required fields **title**, **description**
4.  ✅ Checks if user with given email already exists
5.  ✅ Checks if note **finished** status is `true`
6.  ✅ **Deletes** note using ID
7.  ✅ Returns **204** status code

> ## Success Case - GraphQL

1.  ✅ Receives **POST** request at route **/graphql** with mutation **updateNote**
2.  ✅ Validates if **authorization** header is valid
3.  ✅ Validates required fields **title**, **description**
4.  ✅ Checks if user with given email already exists
5.  ✅ Checks if note **finished** status is `true`
6.  ✅ **Deletes** note using ID
7.  ✅ Returns **204** status code

> ## Error Case


1. ❗Returns status error **400** if **finished** status is `false`
2. ❗Returns status error **400** if note does not exists
3. ❗Returns status error **401** if authorization token is expired
4. ❗Returns status error **401** if user does not exists in database
5. ❗Returns status error **500** if occurs problem in the database
6. ❗Returns status error **503** if database is unavailable
7. ❗Returns status error **599** if unmapped error occurs