#!/bin/sh
echo "#/bin/sh\n./web.sh lint && ./web.sh test" >> .git/hooks/pre-push
chmod +x .git/hooks/pre-push
