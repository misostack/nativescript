#!/usr/bin/env bash

echo ".................................."
echo "...............START..............."
echo ".................................."

from=src/environments/environment.dest.ts

declare -a List=(
                 "local" 
                 "dev" 
                 "prod"
                )
for env in "${List[@]}"
   do
   	 to="src/environments/environment.$env.ts"
     echo -e "Copy $from to $to"
     search="ENV_NAME"
     replace="$env"
     sed "s/$search/$replace/g" $from > $to
   done

echo ".................................."
echo "Copy firebase.nativescript.json.sample firebase.nativescript.json"
echo "...............DONE..............."
echo ".................................."

cp firebase.nativescript.json.sample firebase.nativescript.json