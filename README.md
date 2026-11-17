# Repro for issue 11532

## Versions

firebase-tools: v15.36.0

## Steps to reproduce

1. Install dependencies
2. Run `firebase deploy --only functions:authBlockingTest11532 --project PROJECT_ID`
3. (optiona) Run `node checkProjectConfig.js PROJECT_ID` to check blockingFunctions
```
$ node checkProjectConfig.js PROJECT_ID
--- blockingFunctions
{
  triggers: {
    beforeSendSms: {
      functionUri: 'https://us-east1-PROJECT_ID.cloudfunctions.net/authBlockingTest11532',
      updateTime: '2026-11-17T11:51:10.117Z'
    }
  },
  forwardInboundCredentials: {}
}
```
4. Make small changes to the `authBlockingTest11532` function, then run `firebase deploy --only functions:authBlockingTest11532 --project PROJECT_ID`
5. (optiona) Run `node checkProjectConfig.js PROJECT_ID` to check blockingFunctions
   - Note that the URL in `triggers.beforeSendSms.functionUri` has changed
```
$ node checkProjectConfig.js PROJECT_ID
--- blockingFunctions
{
  triggers: {
    beforeSendSms: {
      functionUri: 'https://authblockingtest11532-RANDOM_STRING-ue.a.run.app',
      updateTime: '2026-11-17T11:53:52.172Z'
    }
  },
  forwardInboundCredentials: {}
}
```
6. Run `firebase functions:delete authBlockingTest11532 --project PROJECT_ID`
```
$ firebase functions:delete authBlockingTest11532 --project PROJECT_ID
✔ You are about to delete the following Cloud Functions:
        authBlockingTest11532(us-east1)
  Are you sure? Yes
i  functions: deleting Node.js 24 (2nd Gen) function authBlockingTest11532(us-east1)...
✔  functions[authBlockingTest11532(us-east1)] Successful delete operation.
```
7. Run `node checkProjectConfig.js PROJECT_ID` to check blockingFunctions
   - See that the config still has value for `triggers.beforeSendSms.functionUri`
```
$ node checkProjectConfig.js PROJECT_ID
--- blockingFunctions
{
  triggers: {
    beforeSendSms: {
      functionUri: 'https://authblockingtest11532-RANDOM_STRING-ue.a.run.app',
      updateTime: '2026-11-17T12:00:07.567Z'
    }
  },
  forwardInboundCredentials: {}
}
```
8. Sending sms fails with 
```
Error sending SMS: Firebase: HTTP Cloud Function returned an error:  (auth/internal-error).
```