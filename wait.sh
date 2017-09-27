#!/usr/bin/env bash
max_seconds=900

echo "Testing against web root"

while true ; do
     printf "."
     if [[ `curl -s -o /dev/null -w "%{http_code}" "http://$1:$2/"` == 200 ]] ; then echo " Found" ; exit 0 ; fi ;
     if [[ $SECONDS -gt $max_seconds ]] ; then echo " Timeout" ; exit 1 ; fi ;
     sleep 2;
done
