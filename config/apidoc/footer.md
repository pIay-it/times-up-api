# Codes & Values

## <a id="errors"></a>⚠️ Errors

If you have an error from the API, you'll get a generic structure. (_See: [Classes - Error](#error-class)_)

Description for each case below :   

| Code | Type                                       | HTTP Code |                 Description                                                                               |
|:----:|:------------------------------------------:|:---------:|-----------------------------------------------------------------------------------------------------------|
| 1    | BAD_REQUEST                                |    400    | You provided incorrect params.                                                                            |
| 2    | UNAUTHORIZED                               |    401    | You're not authorized.                                                                                    |
| 3    | NOT_FOUND                                  |    404    | The requested resource is not found.                                                                      |
| 4    | INTERNAL_SERVER_ERROR                      |    500    | The server got an error, this is not your fault.                                                          |