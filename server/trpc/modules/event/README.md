# TODOs

## Recurring events

Naive implementation would be to generate all recurring events in 1 month and send that to the frontend for rendering.

Which, should be ok since that's theoretically the most the frontend will see anyways. Should not have too big of a performance penalty.

https://github.com/calcom/cal.com/pull/2562/files#diff-51521667f6405997351e8ec8cb1f62e7466236695c9492b9c0558b176b4f2682R24

Seems like this is what calcom does as well.

## Hard coded upcoming events

For now, the upcoming events are hardcoded to return the next 3 days of events.

Would be nice to change it to a dynamic number 0 < n < 32
