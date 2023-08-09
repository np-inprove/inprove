# TODO

## Proper RBAC verification

I wrote this half awake-ish so probably should double check that the RBAC is correct.

Also, I feel like theres a better way to get the institution id from the user, rather than `ctx.session.user.institution?.id` which Typescript cannot tell will never be undefined
