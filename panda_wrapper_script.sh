#!/usr/bin/env bash

#Starting first process : unicorn
first_process="unicorn"
/usr/local/bundle/bin/unicorn -c path/to/unicorn.rb -E development -D
status=$?
if [ $status -ne 0 ]; then
	echo "Process $first_process failed to start with error $status"
	exit $status
fi
#Starting second process : nginx
second_process="nginx"
/usr/sbin/nginx -c /etc/nginx/nginx.conf
status=$?
if [ $status -ne 0 ]; then
	echo "Process $second_process failed to start with error $status"
	exit $status
fi
# Checking every 60 sec if process are still alive.
while /bin/true; do
	ps aux | grep $first_process
	p1_status=$?
	ps aux | grep $second_process
	p2_status=$?
	if [ $p1_status -ne 0 ]; then
		echo "Process $first_process is no longer running."
		failure=1
	fi
	if [ $p2_status -ne 0 ]; then
		echo "Process $second_process is no longer running."
		failure=1
	fi
	if [ $failure == 1 ]; then
		exit -1
	fi
	sleep 60
done
