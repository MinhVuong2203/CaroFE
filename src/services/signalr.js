import * as signalR from '@microsoft/signalr'

export const connection = new signalR.HubConnectionBuilder()
  .withUrl('https://caro-production-097e.up.railway.app/gameHub')
  .withAutomaticReconnect()
  .build()
