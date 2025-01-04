from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__, template_folder='templates')

# Game state
game_state = {
    "gameBoard": ['', '', '', '', '', '', '', '', ''],
    "currentPlayer": 'X',
    "player1": '',
    "player2": ''
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/play', methods=['POST'])
def play():
    data = request.get_json()
    index = int(data['index'])
    current_player = data['currentPlayer']
    game_board = data['gameBoard']
    game_mode = data['gameMode']
    
    # Make the move
    if game_board[index] == '':
        game_board[index] = current_player
    
    # Check if there's a winner
    winner_name = check_winner(game_board)
    
    if winner_name:
        return jsonify({"gameBoard": game_board, "nextPlayer": 'X' if current_player == 'O' else 'O', "winnerName": winner_name})

    # If playing with computer, make the computer's move
    if game_mode == 'computer' and current_player == 'X':  # Computer is 'X'
        computer_move(game_board)
        winner_name = check_winner(game_board)
        if winner_name:
            return jsonify({"gameBoard": game_board, "nextPlayer": 'O', "winnerName": winner_name})
    
    next_player = 'X' if current_player == 'O' else 'O'
    
    return jsonify({"gameBoard": game_board, "nextPlayer": next_player, "winnerName": ''})

def check_winner(game_board):
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
        if game_board[a] and game_board[a] == game_board[b] and game_board[a] == game_board[c]:
            return "Player 1" if game_board[a] == 'X' else "Player 2"
    
    return None

def computer_move(game_board):
    # AI selects a random available spot
    available_moves = [i for i, x in enumerate(game_board) if x == '']
    move = random.choice(available_moves)
    game_board[move] = 'X'  # Computer is 'X'

if __name__ == '__main__':
    app.run(debug=True)
