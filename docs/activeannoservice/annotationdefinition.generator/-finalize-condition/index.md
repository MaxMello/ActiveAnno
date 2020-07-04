[activeannoservice](../../index.md) / [annotationdefinition.generator](../index.md) / [FinalizeCondition](./index.md)

# FinalizeCondition

`sealed class FinalizeCondition`

Condition system which decides if a generated annotation can be finalized automatically

### Types

| Name | Summary |
|---|---|
| [Always](-always/index.md) | Always finalize / green light a generated annotation`object Always : `[`FinalizeCondition`](./index.md) |
| [And](-and/index.md) | `data class And : `[`FinalizeCondition`](./index.md) |
| [Not](-not/index.md) | `data class Not : `[`FinalizeCondition`](./index.md) |
| [Or](-or/index.md) | `data class Or : `[`FinalizeCondition`](./index.md) |
| [ProbabilityGreaterThanEquals](-probability-greater-than-equals/index.md) | Decision based on probability of prediction`data class ProbabilityGreaterThanEquals : `[`FinalizeCondition`](./index.md) |
| [SetEquals](-set-equals/index.md) | `data class SetEquals : `[`FinalizeCondition`](./index.md) |
| [ValueIn](-value-in/index.md) | `data class ValueIn : `[`FinalizeCondition`](./index.md) |

### Functions

| Name | Summary |
|---|---|
| [execute](execute.md) | `abstract fun execute(annotation: `[`Annotation`](../../document.annotation/-annotation.md)`<*>): `[`Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean/index.html) |
