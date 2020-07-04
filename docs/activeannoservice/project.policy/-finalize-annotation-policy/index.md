[activeannoservice](../../index.md) / [project.policy](../index.md) / [FinalizeAnnotationPolicy](./index.md)

# FinalizeAnnotationPolicy

`enum class FinalizeAnnotationPolicy`

### Enum Values

| Name | Summary |
|---|---|
| [EXPORT_EVERY_ANNOTATION_SEPARATELY](-e-x-p-o-r-t_-e-v-e-r-y_-a-n-n-o-t-a-t-i-o-n_-s-e-p-a-r-a-t-e-l-y.md) | Don't merge annotations, export every single one created by annotators. No automatic curation requests. |
| [MAJORITY_VOTE_PER_ANNOTATION_OR_CURATOR](-m-a-j-o-r-i-t-y_-v-o-t-e_-p-e-r_-a-n-n-o-t-a-t-i-o-n_-o-r_-c-u-r-a-t-o-r.md) | for 1 annotator: will automatically be finalized for 2 annotator: identical answers: finalized, else curator for 3 annotator: identical answers: finalized, 2+ identical answers for every annotation: finalized, else curator for 4 annotator: identical answers: finalized, 3+ identical answers for every annotation: finalized, else curator ... |
| [MAJORITY_VOTE_WHOLE_DOCUMENT_OR_CURATOR](-m-a-j-o-r-i-t-y_-v-o-t-e_-w-h-o-l-e_-d-o-c-u-m-e-n-t_-o-r_-c-u-r-a-t-o-r.md) | for 1 annotator: will automatically be finalized for 2 annotator: identical answers: finalized, else curator for 3 annotator: identical answers: finalized, else curator for 4 annotator: identical answers: finalized, else curator |
| [ALWAYS_REQUIRE_CURATION](-a-l-w-a-y-s_-r-e-q-u-i-r-e_-c-u-r-a-t-i-o-n.md) | Always require curation, even on full agreement of annotators |
| [MAJORITY_VOTE_PER_ANNOTATION_OR_ADDITIONAL_ANNOTATOR](-m-a-j-o-r-i-t-y_-v-o-t-e_-p-e-r_-a-n-n-o-t-a-t-i-o-n_-o-r_-a-d-d-i-t-i-o-n-a-l_-a-n-n-o-t-a-t-o-r.md) | On disagreement, instead of curation, ask another annotator (if no more annotators exist, inform manager) |
| [MAJORITY_VOTE_WHOLE_DOCUMENT_OR_ADDITIONAL_ANNOTATOR](-m-a-j-o-r-i-t-y_-v-o-t-e_-w-h-o-l-e_-d-o-c-u-m-e-n-t_-o-r_-a-d-d-i-t-i-o-n-a-l_-a-n-n-o-t-a-t-o-r.md) | On disagreement, instead of curation, ask another annotator (if no more annotators exist, inform manager) |
