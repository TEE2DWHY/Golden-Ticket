## Architecture Diagram

![System Architecture](./server/src/architecture.png)

The application is split into two main parts: a Next.js frontend and an Express backend, with MongoDB handling data storage.

The frontend communicates with the backend through HTTP requests. There are two main endpoints:

GET /api/v1/inventory – Fetches the product details, including its name, price and remaining stock. This information is displayed on the product page.
POST /api/v1/buy – Handles purchase requests. It accepts a productId and quantity, checks the available stock and processes the purchase if enough inventory remains.
MongoDB stores the product and its available quantity. After a successful purchase, the frontend refreshes the inventory so the remaining stock displayed on the page reflects the latest database value.

The backend is responsible for validating purchases and maintaining inventory integrity. The frontend handles the user experience, including loading, success, sold-out and error states.

## Concurrency Strategy

The main challenge with this application is preventing overselling when multiple users attempt to purchase tickets at the same time.

My initial implementation used a read-then-write approach:

Find the product in the database.
Check whether the available quantity is enough.
Subtract the requested quantity.
Save the updated product.
Although this works under normal conditions, it introduces a race condition when multiple requests arrive simultaneously.

For example, imagine there is only one ticket remaining and two users attempt to purchase it at the same time. Both requests could read the same stock value before either has updated it. As a result, both could pass the stock check and receive a successful response, even though only one ticket exists.

To prevent this, I moved the stock validation and decrement into a single MongoDB operation:

```ts
const updated = await Product.findOneAndUpdate(
	{ _id: productId, quantity: { $gte: quantity } },
	{ $inc: { quantity: -quantity } },
	{ new: true },
);
```

The important part is that the stock condition and decrement happen together.

The quantity: { $gte: quantity } condition ensures that the update only succeeds when enough stock is available. MongoDB guarantees atomicity for writes to a single document, meaning concurrent updates cannot both successfully consume the same remaining inventory.

If the condition is no longer satisfied, the operation returns null and no stock is deducted.

The API then responds with:

200 OK – The purchase was successful.
404 Not Found – The requested product does not exist.
409 Conflict – There is insufficient stock to complete the purchase.
I also use an initial product lookup to distinguish between a missing product and insufficient stock. However, this lookup is not relied upon for concurrency control. The atomic database operation is what prevents overselling.

## Scalability

If traffic increased to around one million users, my main concern would be the number of concurrent write requests reaching MongoDB.

Since all purchases update the same product document, that document could become a bottleneck under extremely high traffic.

One improvement I would consider is introducing Redis to handle inventory reservations before persisting successful purchases to MongoDB.

Redis would act as a fast inventory reservation layer:

Initialize the Redis stock counter when the product drop begins.
Use an atomic Lua script to check available stock and decrement it only when sufficient inventory exists.
Reject requests immediately when there is insufficient stock, without sending unnecessary writes to MongoDB.
Persist successful reservations as orders in MongoDB, using a reliable queue or event-processing mechanism.
Using an atomic Redis operation ensures that inventory cannot become negative, even when thousands of requests arrive simultaneously.

This would reduce the number of competing writes against MongoDB and allow the database to focus on storing purchase records rather than handling every inventory check.

There is also an important consistency consideration: Redis and MongoDB must remain synchronised. Successful reservations should be reliably recorded, and failed persistence operations must be handled through retries or compensation so that reserved stock is not permanently lost.

For the current application, MongoDB's atomic update is sufficient and keeps the implementation simple. Introducing Redis would be a future improvement if traffic and performance requirements justified the additional infrastructure.
