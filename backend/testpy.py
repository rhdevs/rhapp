from flask import Flask

app = Flask("rhapp")

@app.route('/')
def root_route():
    return 'What up losers'