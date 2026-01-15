---
description: Prefer composition over configuration, keep logic out of templates, use container-based spacing
---

# Building HTML Interfaces

## Introduction

This is applicable to both HEEx (LiveView) and JSX (React). Meaning, you should
follow this guidelines each time you're building a new interface that in the
end "compiles" into HTML.

### Don't put extensive logic in layout

Only basic logic should be in JSX/HEEx - like conditional rendering, event handling.

Prefer a nicely named booleans that are instantiated in the component's body,
to complex logic statements evaluated within the template.

### Layout should be built around the components

Don't add margins or paddings to the component itself. Always try to leverage the
containers to add things like spacing. Meaning, use `flex` and `grid`, and then
`gap` on those. Padding in the container is better than margin in the child.

### Composition

Prop drilling (configuration) is often a sign of bad architecture. When we
have to do a lot of `isLink`, `isButton` or `hasSearchBar` props, then
it's a nudge towards the composition approach.

Split the component into a bunch of smaller ones, and compose them together.
For things that need to be passed down, prefer React Context API.

```typescript
// bad: configuration (monolithic component with many props)
<Composer
  isThread={true}
  channelID={"C12345"}
  disableAttachments={false}
  renderSubmit={renderThreadSubmitButton}
  actions={allActions}
/>

// good: composition (building the component from smaller parts)
<ThreadComposerProvider channelID={"C12345"}>
  <ComposerFrame>
    <ComposerInput />
    <ComposerFooter>
      <ComposerCommonActions />
      <ComposerSubmitButton />
      <AlsoSendToChannel />
    </ComposerFooter>
  </ComposerFrame>
</ThreadComposerProvider>
```

This is not easily applicable to HEEx, but we should follow the same principles
there.
