from livereload import Server

server = Server()
server.watch('.', delay=10)
server.watch('./js/app.js', delay=10)

server.serve(port=8000, host='localhost')
