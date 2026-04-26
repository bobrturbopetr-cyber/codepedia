---
title: Python
category: Языки программирования
published: 2024-01-15
updated: 2026-04-26
author: Codepedia Community
---

# Python

<div class="info-box">
  <strong>📌 Кратко:</strong> Высокоуровневый язык с динамической типизацией. Создан в 1991 году. 
  <strong>Парадигма:</strong> мультипарадигмальный (ООП, функциональный, императивный).
</div>

**Python** — интерпретируемый язык программирования, который славится своей читаемостью и простотой. Назван в честь комик-группы *Monty Python*, а не змеи.

<div class="toc">
  <strong>📑 Содержание</strong>
  <ul>
    <li><a href="#features">Особенности</a></li>
    <li><a href="#example">Пример кода</a></li>
    <li><a href="#applications">Где используется</a></li>
    <li><a href="#proscons">Плюсы и минусы</a></li>
    <li><a href="#history">История</a></li>
    <li><a href="#see-also">См. также</a></li>
  </ul>
</div>

## <span id="features">✨ Особенности</span>

| Особенность | Описание |
|-------------|----------|
| Динамическая типизация | Типы определяются во время выполнения |
| Автоматическая сборка мусора | Не нужен ручной контроль памяти |
| "Батарейки в комплекте" | Большая стандартная библиотека |
| Кроссплатформенность | Работает на Windows, Linux, macOS |

## <span id="example">💻 Пример кода</span>

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""Простой пример REST API на Flask"""

from flask import Flask, jsonify
from dataclasses import dataclass
from typing import List

app = Flask(__name__)

@dataclass
class Article:
    """Модель статьи"""
    title: str
    content: str
    views: int = 0
    
    def view(self) -> None:
        self.views += 1

# Список статей
articles: List[Article] = [
    Article("Python", "Динамический язык"),
    Article("C++", "Компилируемый язык")
]

@app.route('/api/articles')
def get_articles():
    """GET endpoint для получения статей"""
    return jsonify([{
        'title': a.title,
        'views': a.views
    } for a in articles])

if __name__ == '__main__':
    app.run(debug=True)
