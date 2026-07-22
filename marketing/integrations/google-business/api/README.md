# API Contract

Future runtime services must use the official Business Profile API families and current Google documentation. Keep endpoint versions and fields configurable; do not hard-code credentials or assume access to every location.

| Need | Official API family | Draft-only integration behavior |
| --- | --- | --- |
| Account/location discovery | Account Management and Business Information | List only authorized accounts and locations |
| Business information | Business Information | Read selected location fields into an internal snapshot |
| Reviews | Google My Business Reviews | Retrieve review data and create response drafts only |
| Local Posts | Google My Business Local Posts | Generate payload-ready drafts only; never call create automatically |
| Performance | Business Profile Performance | Retrieve approved metrics for intelligence records |

Use the official documentation at [Business Profile APIs](https://developers.google.com/my-business) as the implementation authority. API access eligibility, quotas, policies, and field availability must be checked during future runtime implementation.
