
PORT=${PORT:-5001}
lsof -ti:$PORT | xargs kill -9 2>/dev/null
echo "Port $PORT cleared"

