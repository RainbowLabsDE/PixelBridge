# modLED PixelBridge
A modular software that can accept image data from multiple sources, convert them and send them to a sink.  
Management of sources and sinks can be done via a web interface.

It's targeted to do the image data conversion for the [modLED project](https://github.com/opendata-heilbronn/modLED).


## How to run
Run with `npm start` (don't forget to run `npm i` and `npm run build` the first time).

## Development
Develop with `npm run dev`. Then access http://localhost:8081 for the development frontend. (Port 8080 will still host the outdated release frontend)

**Disclaimer**: This is my first big Typescript project. So there are bound to be horrific architectural decisions and many other beginner's mistakes. Please excuse that.  
The premise is to get to the first milestone with as little premature optimization as possible, otherwise I would never arrive there.