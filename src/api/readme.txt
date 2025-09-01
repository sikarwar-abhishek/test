Template for client side API call using tanstack/react query and axios 

1. Add your API endpoint in the appropriate file
(Create a new file in the api folder if necessary.)
Example: app/api/auth.js

2. Import useMutationHandler in the page
No need to manually manage the state of onSuccess, onError, or isLoading.
Example: app/hooks/useMutationHandler.js

