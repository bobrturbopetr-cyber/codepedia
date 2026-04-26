# 📚 Codepedia

Минималистичная энциклопедия программирования в стиле Wikipedia

## 📖 Разделы

- **Languages** — языки программирования (Python, C++, Java, Go, Rust)
- **Algorithms** — алгоритмы и структуры данных
- **Concepts** — фундаментальные концепты (ООП, ФП, memory management)
- **Tools** — инструменты (Git, Docker, VSCode)

## 🔍 Как добавить статью

### Способ 1: Через GitHub Web (простой)
1. Откройте папку `articles/[раздел]/`
2. Нажмите `Add file` → `Create new file`
3. Назовите файл `название.md` (например, `javascript.md`)
4. Скопируйте [шаблон](articles/templates/article-template.md)
5. Заполните содержимое и нажмите `Commit changes`

### Способ 2: Через Git (локально)
```bash
git clone https://github.com/ваш-username/Codepedia.git
cd Codepedia
cp articles/templates/article-template.md articles/languages/new-language.md
# Редактируйте файл
git add .
git commit -m "Add article: new-language"
git push
