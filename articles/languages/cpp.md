---
title: C++
category: Languages
date: 2024-01-15
---

# C++

**C++** — компилируемый статически типизированный язык программирования общего назначения. Создан Бьёрном Страуструпом в 1985 году как расширение языка C.

## Ключевые особенности

- Компилируемый — высокая производительность
- Статическая типизация
- Поддержка ООП, обобщённого и функционального программирования
- Прямой доступ к памяти (указатели)
- RAII (управление ресурсами)

## Пример кода

```cpp
#include <iostream>
#include <string>
#include <vector>

// Функция
int square(int x) {
    return x * x;
}

// Класс
class Developer {
private:
    std::string name;
    std::string language;
    
public:
    Developer(std::string n, std::string lang) 
        : name(n), language(lang) {}
    
    void code() const {
        std::cout << name << " пишет на " << language << std::endl;
    }
};

int main() {
    // Hello World
    std::cout << "Hello, Codepedia!" << std::endl;
    
    // STL контейнер
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    for (int n : numbers) {
        std::cout << n << "^2 = " << square(n) << std::endl;
    }
    
    // Использование класса
    Developer dev("Максим", "C++");
    dev.code();
    
    return 0;
}
