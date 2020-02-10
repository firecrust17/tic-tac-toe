# from get_config import *
import cherrypy

class Server(object):
   @cherrypy.expose
   def index(self, **params):
       pass

if __name__ == '__main__':
  
  config_json = {
    'config': {
      'app_server': {
        'dist': '/home/aneeshkumarbhola/tic-tac-toe/dist/tic-tac-toe/',
        'host': '0.0.0.0',
        'port': '4202'
      }
    }
  }

  dist_dir = config_json['config']['app_server']['dist']
  index = dist_dir + '/' + "index.html"

  host = config_json['config']['app_server']['host']
  port = int(config_json['config']['app_server']['port'])

  cherrypy.config.update({'server.socket_host': host, 'server.socket_port': port})
  cherrypy.tree.mount(Server(), '/', config={
     '/': {
         'tools.staticdir.on': True,
         'tools.staticdir.dir': dist_dir,
         'tools.staticdir.index': index
     }
  })

  cherrypy.engine.start()
  cherrypy.engine.block()
