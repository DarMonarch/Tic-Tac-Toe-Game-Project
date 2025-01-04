import json

# Initialize the game state
game_board = ['', '', '', '', '', '', '', '', '']
current_player = 'X'

def handler(request):
    global game_board, current_player

    # Get the data from the request
    body = request.get_json()

    if not body:
        return json.dumps({"error": "Invalid data"}), 400

    index = body.get('index')
    player = body.get('currentPlayer')
    game_mode = body.get('gameMode')

    if index is None or player is None:
        return json.dumps({"error": "Missing parameters"}), 400

    # If the square is already occupied or the game is over, do nothing
    if game_board[index] != '' or check_winner():
        return json.dumps({'gameBoard': game_board, 'nextPlayer': current_player})

    # Make the move
    game_board[index] = player
    current_player = 'O' if player == 'X' else 'X'

    # Return the updated game state and the next player
    winner = check_winner()
    return json.dumps({'gameBoard': game_board, 'nextPlayer': current_player, 'winnerName': winner})


def check_winner():
    # Define win conditions (rows, columns, diagonals)
    win_patterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    for pattern in win_patterns:
        a, b, c = pattern
        if game_board[a] and game_board[a] == game_board[b] == game_board[c]:
            return current_player
    return None
