[activeannoservice](../index.md) / [document](index.md) / [updateIndexes](./update-indexes.md)

# updateIndexes

`suspend fun updateIndexes(): `[`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/index.html)

Create all indexes in mongoDB. If they already exist, nothing will happen. Every index is sparse, because they are dynamic and depend on user
input. Normally, this would not be recommended when designing a database, but because of the highly configurable nature of ActiveAnno, it is
done that way.

