#!/bin/sh
lsof -n -i4TCP:9099| grep LISTEN | awk '{ print $2 }' | xargs kill -9
lsof -n -i4TCP:5001| grep LISTEN | awk '{ print $2 }' | xargs kill -9
lsof -n -i4TCP:8080| grep LISTEN | awk '{ print $2 }' | xargs kill -9
lsof -n -i4TCP:3333| grep LISTEN | awk '{ print $2 }' | xargs kill -9
lsof -n -i4TCP:9000| grep LISTEN | awk '{ print $2 }' | xargs kill -9
lsof -n -i4TCP:9199| grep LISTEN | awk '{ print $2 }' | xargs kill -9
lsof -n -i4TCP:9399| grep LISTEN | awk '{ print $2 }' | xargs kill -9

pkill -f firebase
