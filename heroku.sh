#! /bin/bash
heroku container:push --app=quiet-castle-81468 web

heroku container:release --app=quiet-castle-81468 web
