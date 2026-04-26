---
title: C++
category: Языки программирования
published: 2024-01-15
updated: 2026-04-26
author: Codepedia Community
---

# C++

<div class="info-box warning">
  <strong>⚠️ Сложность:</strong> Высокая. Требует понимания указателей, управления памятью и низкоуровневых концепций.
</div>

**C++** — язык, который даёт вам полный контроль над железом. Создан Бьёрном Страуструпом как "C с классами", теперь это один из самых мощных языков в индустрии.

<div class="toc">
  <strong>📑 Содержание</strong>
  <ul>
    <li><a href="#features">Ключевые особенности</a></li>
    <li><a href="#example">Пример кода (современный C++)</a></li>
    <li><a href="#versions">Стандарты C++</a></li>
    <li><a href="#applications">Где используется</a></li>
    <li><a href="#proscons">Плюсы и минусы</a></li>
    <li><a href="#memory">Управление памятью</a></li>
  </ul>
</div>

## <span id="features">⚙️ Ключевые особенности</span>

<div class="feature-list">
  <div>
    <strong>🔹 Компилируемый</strong><br>
    Максимальная производительность, бинарный код
  </div>
  <div>
    <strong>🔹 Прямой доступ к памяти</strong><br>
    Указатели, ручное управление
  </div>
  <div>
    <strong>🔹 Zero-cost абстракции</strong><br>
    То, что вы не используете, не замедляет код
  </div>
  <div>
    <strong>🔹 RAII</strong><br>
    Автоматическое управление ресурсами
  </div>
</div>

## <span id="example">💻 Пример кода (современный C++20)</span>

```cpp
#include <iostream>
#include <vector>
#include <memory>
#include <optional>
#include <ranges>
#include <format>

namespace ranges = std::ranges;

// Использование optional для безопасного поиска
std::optional<int> safe_divide(int a, int b) {
    if (b == 0) return std::nullopt;
    return a / b;
}

// Класс с RAII
template<typename T>
class SafeArray {
private:
    std::unique_ptr<T[]> data;
    size_t size_;
    
public:
    explicit SafeArray(size_t size) 
        : data(std::make_unique<T[]>(size)), size_(size) {
        std::cout << std::format("Создан массив из {} элементов\n", size);
    }
    
    T& operator[](size_t index) {
        if (index >= size_) throw std::out_of_range("Индекс за пределами");
        return data[index];
    }
    
    size_t size() const { return size_; }
    
    // Адаптер диапазона C++20
    auto view() {
        return ranges::subrange(data.get(), data.get() + size_);
    }
};

int main() {
    std::cout << "🚀 Современный C++ в действии\n";
    
    // Умные указатели вместо new/delete
    auto ptr = std::make_unique<int>(42);
    
    // SafeArray с RAII
    SafeArray<int> arr(5);
    for (int i = 0; i < arr.size(); ++i) {
        arr[i] = i * i;
    }
    
    // Диапазоны C++20
    auto squares = arr.view() 
                 | ranges::views::transform([](int x) { return x * x; });
    
    for (int val : squares) {
        std::cout << val << " ";
    }
    std::cout << "\n";
    
    // Безопасное деление
    if (auto result = safe_divide(10, 2)) {
        std::cout << std::format("10 / 2 = {}\n", *result);
    }
    
    return 0;
}
