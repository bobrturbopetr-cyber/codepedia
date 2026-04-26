---
title: Python
category: Languages
date: 2024-01-15
---

# Python

**Python** — высокоуровневый язык программирования общего назначения с динамической строгой типизацией и автоматическим управлением памятью. Создан Гвидо ван Россумом в 1991 году.

## Особенности

- Простой и читаемый синтаксис
- Динамическая типизация
- Интерпретируемый
- Кроссплатформенность
- Огромная экосистема библиотек

## Пример кода

```python
# Hello World
print("Hello, Codepedia!")

# Функция с аннотациями типов
def greet(name: str) -> str:
    return f"Hello, {name}!"

# Класс
class Developer:
    def __init__(self, name, language):
        self.name = name
        self.language = language
    
    def code(self):
        print(f"{self.name} пишет на {self.language}")

# Использование
dev = Developer("Анна", "Python")
dev.code()
