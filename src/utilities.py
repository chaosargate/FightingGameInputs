def make_page(title, body):
    return "{header}<h1>{title}</h1><br/>{table}".format(
        header=page_header(title),
        title=title,
        table=body
    )


def page_header(title):
    return """
    <head>
        <link rel='stylesheet' href='/bin/css/main.css'>
        <title>{title}</title>
    </head>
    """.format(title=title)


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
