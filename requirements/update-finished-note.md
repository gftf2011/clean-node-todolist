# Update Note - Business Rule

> ## Success Case - REST

1.  ✅ Receives **PATCH** request at route **/api/V1/update-finished-note**
2.  ✅ Validates if **authorization** header is valid
3.  ✅ Checks if user with given email already exists
4.  ✅ Note is **finished** status is updated
5.  ✅ **Updates** note **finished** status and updates field **updatedAt**
6.  ✅ Returns **200** status code with **decripted** note information

> ## Success Case - GraphQL

1.  ✅ Receives **POST** request at route **/graphql** with mutation **updateFinishedNote**
2.  ✅ Validates if **authorization** header is valid
3.  ✅ Checks if user with given email already exists
4.  ✅ Note is **finished** status is updated
5.  ✅ **Updates** note **finished** status and updates field **updatedAt**
6.  ✅ Returns **200** status code with **decripted** note information

> ## Error Case

1. ❗Returns status error **401** if authorization token is expired
2. ❗Returns status error **401** if user does not exists in database
3. ❗Returns status error **500** if occurs problem in the database
4. ❗Returns status error **503** if database is unavailable
5. ❗Returns status error **599** if unmapped error occurs
