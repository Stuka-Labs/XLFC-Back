#!/bin/sh
lsof -n -i4TCP:3333| grep LISTEN | awk '{ print $2 }' | xargs kill -9
lsof -n -i4TCP:4400| grep LISTEN | awk '{ print $2 }' | xargs kill -9
lsof -n -i4TCP:4500| grep LISTEN | awk '{ print $2 }' | xargs kill -9
lsof -n -i4TCP:5000| grep LISTEN | awk '{ print $2 }' | xargs kill -9
lsof -n -i4TCP:5432| grep LISTEN | awk '{ print $2 }' | xargs kill -9
pkill -f firebase
