[activeannoservice](../../index.md) / [config.policy](../index.md) / [FinalizeAnnotationPolicy](index.md) / [MAJORITY_VOTE_PER_ANNOTATION_OR_ADDITIONAL_ANNOTATOR](./-m-a-j-o-r-i-t-y_-v-o-t-e_-p-e-r_-a-n-n-o-t-a-t-i-o-n_-o-r_-a-d-d-i-t-i-o-n-a-l_-a-n-n-o-t-a-t-o-r.md)

# MAJORITY_VOTE_PER_ANNOTATION_OR_ADDITIONAL_ANNOTATOR

`MAJORITY_VOTE_PER_ANNOTATION_OR_ADDITIONAL_ANNOTATOR`

On disagreement, instead of curation, ask another annotator (if no more annotators exist, ask curator)

for 1 annotator: will automatically be finalized
for 2 annotator: identical answers: finalized, else ask additional annotator
for 3 annotator: identical answers: finalized, 2+ identical answers for every annotation: finalized, else ask additional annotator
for 4 annotator: identical answers: finalized, 3+ identical answers for every annotation: finalized, else ask additional annotator

