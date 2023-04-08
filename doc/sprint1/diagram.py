# https://diagrams.mingrammer.com/docs
# https://www.graphviz.org/doc/info/attrs.html



from diagrams import Cluster, Diagram, Edge

from diagrams.onprem.database import MongoDB
from diagrams.onprem.compute import Server
from diagrams.onprem.client import Client

from diagrams.programming.framework import Flask
from diagrams.programming.framework import React

from diagrams.programming.language import Python 
from diagrams.programming.language import Javascript

from diagrams.generic.os import Windows
from diagrams.generic.network import Router
from diagrams.generic.compute import Rack


graph_attr = {
    "fontsize": "30",
    "ranksep": "3",
    "nodesep": "3",
    "splines": "true",
    "dirtype": "foward",
}

with Diagram("Architecture", show=True, graph_attr=graph_attr):
    
    
    # windows = Windows("OS")
    router1 = Router("localhost:3000")
    router2 = Router("localhost:5000")

    with Cluster("Model", ):
        mongo = MongoDB("MongoDB") 

    with Cluster("Controller"):
        flask = Flask()
        python = Python()
        python - flask
        
    with Cluster("View"):
        react = React("React")
        js = Javascript()
        js - react
        
        
  
    mongo >> Edge() >> flask
    flask >> Edge() >> mongo
    
    react >> Edge(label="AJAX", color="darkgreen") >> flask
    flask >> Edge(label="REST API", color="darkgreen") >> react

    router2 - mongo
    router2 - flask
    router1 - react

    # windows - mongo
    # windows - flask
    # windows - react