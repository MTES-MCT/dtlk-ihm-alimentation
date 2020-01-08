#!/bin/sh

if [ ! -z "$API_URL" ]; then
    sed -i 's|apiUrl:"[^"]*"|apiUrl:"'$API_URL'"|g' /www/js/*.js
fi

exec "$@"
