#!/bin/bash
# Create a systemd service & timer that runs the given backup daily
# by Uli Köhler - https://techoverflow.net
# Licensed as CC0 1.0 Universal
export SERVICENAME=$(basename $(pwd) | tr [A-Z] [a-z])-backup
export SERVICEFILE=/etc/systemd/system/${SERVICENAME}.service
export TIMERFILE=/etc/systemd/system/${SERVICENAME}.timer
echo "Creating systemd service... $SERVICEFILE"
sudo cat >$SERVICEFILE <<EOF
[Unit]
Description=$SERVICENAME
[Service]
Type=oneshot
ExecStart=/bin/bash ./scripts/backup.sh
WorkingDirectory=$(pwd)
EOF

echo "Creating systemd timer... $TIMERFILE"
sudo cat >$TIMERFILE <<EOF
[Unit]
Description=$SERVICENAME
[Timer]
#OnCalendar=daily
OnCalendar=*-*-* 5:00:00
Persistent=true
[Install]
WantedBy=timers.target
EOF

echo "Enabling & starting $SERVICENAME.timer"
sudo systemctl enable $SERVICENAME.timer
sudo systemctl start $SERVICENAME.timer
