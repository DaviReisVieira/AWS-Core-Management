#!/usr/bin/env bash

# get inside backend directory
cd backend

# install dependencies
pip install -r requirements.txt

# run flask in subshell
flask run &
FLASK_PID=$!

# get inside frontend directory
cd ../frontend

# install dependencies
yarn install

# create .env.local file with NEXT_PUBLIC_BACKEND_URL=http://localhost:5000/api
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:5000/api" > .env.local

# run nextjs in subshell
yarn dev &
NEXT_PID=$!

# wait for user to press enter
read -p "Press enter to stop"

# kill flask
kill $FLASK_PID

# kill nextjs
kill $NEXT_PID