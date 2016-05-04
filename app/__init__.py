# coding: utf-8

import os
import re
import json
from flask import Flask, render_template


app = Flask(__name__)

BOOKS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "books")
SYMBOLS = u"[!\"#$%&\'()*+,­./:;<=>?@\[\]\\^_`{|}~]"


def only_ascii(char):
    if ord(char) > 127:
        return ''
    else:
        return char


def load_books(file_path):
    """Load the Books and return punctuated tests"""
    data = []
    pattern = re.compile(SYMBOLS)
    for filename in os.listdir(file_path):
        if filename.endswith(".txt"):
            with open(os.path.join(file_path, filename), "r") as inputfile:
                title = inputfile.readline().strip()
                title = filter(only_ascii, title)
                author = inputfile.readline().strip()
                content = inputfile.read()
            data.append({
                "title": title,
                "key": filename.split(".txt")[0],
                "author": author,
                "punctuations": pattern.findall(content)[:625]
            })
    return data

TEXT_SELECTIONS = load_books(BOOKS_DIR)


@app.route("/")
def index():
    """Render index page"""
    punctuations = list(set([val for val in SYMBOLS]))

    return render_template('index.html',
        text_choices=TEXT_SELECTIONS,
        text_data=json.dumps(TEXT_SELECTIONS),
        symbols=json.dumps(punctuations))
