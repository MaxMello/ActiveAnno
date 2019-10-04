# Filter Condition Syntax

ActiveAnno filter are based on MongoDB query operators, because ActiveAnno uses MongoDB. ActiveAnno puts a light wrapper
on top of MongoDB queries to gain type safety and better (de-)serialization of the query json.

This is an example filter json:
```json
{
  "operator": "eq",
  "key": "originalDocument.id",
  "value": 1
}
```

In the Manage UI for projects, you don't need to write the json yourself. Still, the configuration is highly technical as this
type of query cannot be abstracted. You select the operator by a dropdown, but the key has to be provided as a text/string.
Therefore, here is the key syntax defined.

### Key syntax
A document is stored in a specific JSON structure and therefore how you define the key is dependent on it.
```js
{
  "storeTimestamp": <UTC value as a long>,
  "originalDocument": {
      // here, the document sent via the import function or upload UI is stored
  },
  "configAnnotationData": {
      "<CONFIG_ID>": {      // Here, the annotation data is stored for each config under the ID of the config
         "annotations": [   // Every annotation result of a annotator or curator is stored in this list
            {
               "id": "<Generated ID string>",
               "timestamp": <UTC timestamp of annotation result",
               "documentAnnotations": {
                  "<ANNOTATION_ID>": {
                     "value": <any value possible by annotation>
                  },
                  ...
               }
            },
            ...
         ],
         ...
      }
  }
}
```
Applying conditions on `configAnnotationData` is currently very hard to achieve, therefore the main focus is on expressing conditions 
on the original document.
```json
{
  "comment": "This is a comment",
  "id": 1,
  "innerDocument": {
     "id": 2
  }
}
```
For the example original document above, triggering on documents with `id=1` would need the `key`: `originalDocument.id`, for the 
id inside `innerDocument`, the key would need to be `originalDocument.innerDocument.id`.

You could also filter on `storeTimestamp`, e.g. to separate documents by their import time into buckets. For this, you would just need to use the
key `storeTimestamp`.


### Value syntax
The value is dependent on the operator chosen and the data type of the field. The following operators require a simple value of type string, number or boolean:
* Equals
* Not Equals
* Regex (string only, needs to be a valid regex to work)
* Greater Than
* Greater Than Equals
* Less Than
* Less Than Equals
* Size (number only, trigger on size of list)
* Exists (boolean only, true / false)

The following operators require a list of values:
* In List
* Not in List
* Contains All in List

Lastly, the logical operators are not yet supported, but are mentioned here:
* Not (requires a single condition as a value)
* And, Or, Nor (require a list of conditions as a value)
