# Running the diagram script

## Installation (Windows)

### Install Graphviz

https://forum.graphviz.org/t/new-simplified-installation-procedure-on-windows/224

### Install dependencies

inside the current directory:

```
$ py -3 -m venv venv
$ venv\Scripts\activate
$ pip install diagrams
```

### Run script

```
$ python diagram.py
```

Should produce the diagram "architecture.png" inside the current directory