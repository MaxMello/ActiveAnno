[activeannoservice](../../index.md) / [config.policy](../index.md) / [FinalizeAnnotationPolicy](index.md) / [MAJORITY_VOTE_PER_ANNOTATION_OR_CURATOR](./-m-a-j-o-r-i-t-y_-v-o-t-e_-p-e-r_-a-n-n-o-t-a-t-i-o-n_-o-r_-c-u-r-a-t-o-r.md)

# MAJORITY_VOTE_PER_ANNOTATION_OR_CURATOR

`MAJORITY_VOTE_PER_ANNOTATION_OR_CURATOR`

for 1 annotator: will automatically be finalized
for 2 annotator: identical answers: finalized, else curator
for 3 annotator: identical answers: finalized, 2+ identical answers for every annotation: finalized, else curator
for 4 annotator: identical answers: finalized, 3+ identical answers for every annotation: finalized, else curator
...

