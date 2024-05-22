# @fng/socket
Fractured Nations Games socket message handler for Elysia.

## Features
- Socket message standardization handling. 
- Built in JWT authentication.   

#### Sample Code

```
import { createMesssageHandler, MessageHandlerConfig } from '@fng/socket';

interface ZonePayload {
  zoneId: string
}

interface User {
  id: string; 
  username: string;
}

const config = {
  handleZoneJoin: {
    actionMethod: <ZonePayload, User>(
      ws: WebSocketInterface,
      payload?: ZonePayload,
      user?: User 
    ) => {
      ...
    }
  },
  handleMessageSend: (
    ws: WebSocketInterface,
    payload?: JsonObj,
    user?: JsonObj 
  ) => {
    ...
  }
} as MessageHandlerConfig 
```


