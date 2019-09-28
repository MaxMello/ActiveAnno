[activeannoservice](../../index.md) / [config.export](../index.md) / [OnWebHookFailureBehavior](./index.md)

# OnWebHookFailureBehavior

`enum class OnWebHookFailureBehavior`

What to do when calling the WebHook failed

### Enum Values

| Name | Summary |
|---|---|
| [IGNORE](-i-g-n-o-r-e.md) | act as if call was successful, ignore document for future |
| [RESEND_ON_NEXT_TRIGGER](-r-e-s-e-n-d_-o-n_-n-e-x-t_-t-r-i-g-g-e-r.md) | Try to re-send result with next time the web hook gets triggered |
