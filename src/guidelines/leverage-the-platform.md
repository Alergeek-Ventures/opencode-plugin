# Leverage the platform

Try to use what we have. Libraries already installed in the environment
should be leveraged - not reimplemented.

## Goal

Prevent reimplementing the wheel. Prevent increasing maintenance surface.

## Why

Web platform, React Native environment, standard libraries and existing project
dependencies - and other components like that - will give you a lot of
functionality out of the box. You shouldn't rewrite those when you can use
someone else's implementation - they will then take a burden of maintaining
it on themselves.

Leverage documentation (MCPs, webfetch) to verify if the functionality is
available in the platform or in the project dependencies and suggest
a refactor if it is.

## Examples

### useQuery

In `@tanstack/react-query` we have a `useQuery` that returns an oobject. If you
leverage the platform (meaning in this instance Typescript) you will be able to
have it work for you. Don't destructure the object, use it directly. Then
checking the boooleans (like `isLoading` or `isError`) will properly derive
other fields as well.

### Invariant programming

Throw away undesired states early. Don't let arrays, `null | undefined`` etc
spread across your codebase.

For example, if you are using an ORM and want to find a single record, you
shouldn't return an array. Instead, leverage a method of the library / framework
if available. Or, if not, just throw an error when shape doesn't match.
