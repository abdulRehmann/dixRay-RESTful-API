# dixRay---RESTful-API
### Technologies
*   Node
*   Express
*   RESTful Architecture
*   Functional Proramming
*   Cloud Firestore
*   Google Cloud Platform

### URL Structure

| Type  | Entity | Demand  | URL |
| ------------- | ------------- | ------------- | ------------- |
| POST  | User  | Create a user  | v1/users  |
| GET  | User  | Get a user  | v1/users/:id  |
| GET  | User  | Get all users  | v1/users  |
| PATCH  | User  | Update a user  | v1/users/:id  |
| ------------- | ------------- | ------------- | ------------- |
| POST  | Messages  | Create a chat  | v1/chats  |
| POST  | Messages  | Create a room  | v1/chats/rooms  |
| GET  | Messages  | Get single room  | v1/chats/rooms/:id  |
| GET  | Messages  | Get all chats  | v1/chats  |
| PATCH  | Messages  | Update room  | v1/chats/rooms/:id  |
| ------------- | ------------- | ------------- | ------------- |
| POST  | Payment  | Create payment  | v1/payments  |
| GET  | Payment  | Get payment  | v1/payments  |
| PATCH  | Payment  | Update payment  | v1/payments/:id  |
| ------------- | ------------- | ------------- | ------------- |
| POST  | Image  | Upload image  | v1/images  |
| GET  | Image  | Get images  | v1/images  |
| PATCH  | Image  | Update image  | v1/images/:id  |
