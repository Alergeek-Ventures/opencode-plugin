# State management

We should minimize the amount of stored state in our applications. Quite often, the less we
save in the database, object storage or key-value cache, the better.

## Goal

Look through the changes to the state management - what we use in the code.
Understand if it's all required to be stored and if it's derived correctly.
Highlight wrong approaches and incorrect usage. Challenge assumptions
regarding performance.

## Why

Rule of thumb should be that only 20% of the state should be stored, 80% should
be derived instead. Things that can be computed, should be - otherwise we have
multiple sources of truth and risk inconsistencies.

The only reason to store state that could be derived is for performance reasons.

It's also important to understand the client / server side state - more on that
later.
