import hashlib
import uuid
import jwt


def make_page(title, body, react_page=False):
    return "{header}<h1>{title}</h1><br/>{table}".format(
        header=page_header(title, react_page),
        title=title,
        table=body
    )


def page_header(title, react_page):
    react_imports = """
        <script src='/bin/js/react.development.js'></script>
        <script src='/bin/js/react-dom.development.js'></script>
        <script src='/bin/js/babel6.js'></script>
        <script src='/bin/js/utilities.js'></script>
        <script src='/bin/js/api_calls.js'></script>
        <script src='/bin/js/jquery-3.4.0.min.js'></script>
        <script type="text/babel" src='/bin/js/add_page.js'></script>
        <script type="text/babel" src='/bin/js/CharacterAddForm.js'></script>
        <script type="text/babel" src='/bin/js/CharacterMoveAddForm.js'></script>
        <script type="text/babel" src='/bin/js/GameAddForm.js'></script>
        <script type="text/babel" src='/bin/js/MoveAddForm.js'></script>
        <script type="text/babel" src='/bin/js/characterViewer.js'></script>
        <link rel='stylesheet' href='/bin/css/add_page.css'>
        <link rel='stylesheet' href='/bin/css/characterViewer.css'>
    """
    return """
    <head>
        {react_imports}
        <link rel='stylesheet' href='/bin/css/main.css'>
        <title>{title}</title>
    </head>
    """.format(
           react_imports=react_imports if react_page else "",
           title=title
    )


def make_input_td(series, move_input):
    input_td = ""
    inputs = move_input.split(",")

    for button in inputs:
        input_td += make_input_img(series, button)

    return input_td


def make_input_img(series, button):
    return "<img src='/bin/buttons/{series}/{button}.png' height='24px' />".format(
        series=series,
        button=button
    )


def hash_password(password):
    return hashlib.sha1(password.encode()).hexdigest()


def make_session_id():
    return str(uuid.uuid4())


def make_jwt(user_id, session_id, signing_key):
    payload = {
        "user_id": user_id,
        "sessionId": session_id
    }
    return jwt.encode(payload, signing_key, algorithm='HS256').decode("utf-8")


def decode_jwt(encoded_jwt, signing_key):
    return jwt.decode(encoded_jwt, signing_key, algorithms=["HS256"])


