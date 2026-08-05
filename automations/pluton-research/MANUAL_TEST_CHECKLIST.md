# Pluton Research manual test checklist

1. Import both workflow JSON files; keep both inactive.
2. Set the error workflow on the main workflow and select all three Google credentials.
3. Add the Pluton status columns to a copy of the linked response Sheet.
4. Use `fixtures/sample-form-response.json` to create a test row with a real, permitted website in `Business Profile URL`.
5. Run the main workflow manually from the trigger or execute the normalization node with the fixture data.
6. Confirm the row changes to `Researching` and receives `Research Started`.
7. Confirm the Firecrawl crawl has a maximum limit of 20 and that only relevant pages were retained.
8. Confirm public-source results include URLs and repeated header/footer content is not in the evidence package.
9. Confirm the report file lands in the configured Drive folder and the Sheet `Report URL` opens it.
10. Confirm all report sections exist, there are no more than five opportunities, and there are 5-10 discovery questions.
11. Confirm verified findings have URLs; unsupported claims are in `inferences` or `missingInformation`.
12. Confirm the completion email arrives at the Ellis notification address.
13. Temporarily use an invalid Firecrawl key in a test environment and confirm retries plus the error-handler email. Restore the secret immediately.
14. Activate the main workflow only after all checks pass.
