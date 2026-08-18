import os
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'dev-secret-key-12345')

# Mock data loaders
def load_json(filename):
    import json
    try:
        with open(f'data/{filename}', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/cookies')
def cookies():
    data = load_json('cookies.json')
    return render_template('cookies.html', cookies=data)

@app.route('/kpdh')
def kpdh():
    data = load_json('kpdh.json')
    return render_template('kpdh.html', characters=data)

@app.route('/news')
def news():
    data = load_json('news.json')
    return render_template('news.html', news=data)

@app.route('/events')
def events():
    data = load_json('events.json')
    return render_template('events.html', events=data)

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/api/search')
def search():
    query = request.args.get('q', '').lower()
    results = {'cookies': [], 'kpdh': [], 'news': [], 'events': []}
    
    cookies = load_json('cookies.json')
    for c in cookies:
        if query in c['name'].lower(): results['cookies'].append(c)
        
    kpdh = load_json('kpdh.json')
    for k in kpdh:
        if query in k['name'].lower(): results['kpdh'].append(k)
        
    news = load_json('news.json')
    for n in news:
        if query in n['title'].lower(): results['news'].append(n)
        
    events = load_json('events.json')
    for e in events:
        if query in e['name'].lower(): results['events'].append(e)
        
    return jsonify(results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
