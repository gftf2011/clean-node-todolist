# Find Note - Business Rule

> ## Success Case - REST

1.  ✅ Receives **GET** request at route **/api/V1/find-note/:id**
2.  ✅ Validates if **authorization** header is valid
3.  ✅ Checks if user with given email already exists
4.  ✅ Note title is **decrypted**
5.  ✅ Note description is **decrypted**
6.  ✅ **Retrieves** note with decrypted values
7.  ✅ Returns **200** status code with **note**

> ## Success Case - GraphQL

1.  ✅ Receives **POST** request at route **/graphql** with query **getNote**
2.  ✅ Validates if **authorization** header is valid
3.  ✅ Checks if user with given email already exists
4.  ✅ Note title is **decrypted**
5.  ✅ Note description is **decrypted**
6.  ✅ **Retrieves** note with decrypted values
7.  ✅ Returns **200** status code with **note**

> ## Error Case

1. ❗Returns status error **401** if authorization token is expired
2. ❗Returns status error **401** if user does not exists in database
3. ❗Returns status error **500** if occurs problem in the database
4. ❗Returns status error **503** if database is unavailable
5. ❗Returns status error **599** if unmapped error occurs