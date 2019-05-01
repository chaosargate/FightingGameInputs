def make_page(title, body, add_page=False):
    return "{header}<h1>{title}</h1><br/>{table}".format(
        header=page_header(title, add_page),
        title=title,
        table=body
    )


def page_header(title, add_page):
    react_imports = """
        <script src='/bin/js/react.development.js'></script>
        <script src='/bin/js/react-dom.development.js'></script>
        <script src='/bin/js/babel6.js'></script>
        <script type="text/babel" src='/bin/js/add_page.js'></script>
        <link rel='stylesheet' href='/bin/css/add_page.css'>
    """
    return """
    <head>
        {react_imports}
        <link rel='stylesheet' href='/bin/css/main.css'>
        <title>{title}</title>
    </head>
    """.format(
           react_imports=react_imports if add_page else "",
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
