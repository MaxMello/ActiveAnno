[activeannoservice](../../index.md) / [annotationdefinition](../index.md) / [CaseBehavior](./index.md)

# CaseBehavior

`enum class CaseBehavior`

How to handle differences in cases between tags?

### Enum Values

| Name | Summary |
|---|---|
| [KEEP_ORIGINAL](-k-e-e-p_-o-r-i-g-i-n-a-l.md) | Keep case as is, allowing "tag", "Tag", "tAg", ... to exist side by side |
| [TO_LOWER](-t-o_-l-o-w-e-r.md) | Lower case all tags, "TAG", "Tag" =&gt; "tag" |
| [TO_UPPER](-t-o_-u-p-p-e-r.md) | Upper case all tags, "tag", "Tag" =&gt; "TAG" |
| [CAPITALIZE](-c-a-p-i-t-a-l-i-z-e.md) | Capitalize all tags, "tags, "tAGS" =&gt; "Tags" |
