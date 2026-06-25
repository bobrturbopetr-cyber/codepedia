// Работа с D1 базой данных
export class Database {
    constructor(env) {
        this.db = env.DB;
    }

    // Утилиты
    async query(sql, params = []) {
        try {
            const stmt = this.db.prepare(sql);
            const result = await stmt.bind(...params).all();
            return result.results || [];
        } catch (error) {
            console.error('Ошибка запроса:', error);
            throw error;
        }
    }

    async queryOne(sql, params = []) {
        try {
            const stmt = this.db.prepare(sql);
            const result = await stmt.bind(...params).first();
            return result;
        } catch (error) {
            console.error('Ошибка запроса:', error);
            throw error;
        }
    }

    async execute(sql, params = []) {
        try {
            const stmt = this.db.prepare(sql);
            const result = await stmt.bind(...params).run();
            return result;
        } catch (error) {
            console.error('Ошибка выполнения:', error);
            throw error;
        }
    }

    // ======== ВИКИ ========
    async getWikis() {
        return await this.query('SELECT * FROM wikis ORDER BY created_at DESC');
    }

    async getWiki(id) {
        return await this.queryOne('SELECT * FROM wikis WHERE id = ?', [id]);
    }

    async getWikiBySubdomain(subdomain) {
        return await this.queryOne('SELECT * FROM wikis WHERE subdomain = ?', [subdomain]);
    }

    async createWiki(name, subdomain, description, owner = 'system') {
        const result = await this.execute(
            'INSERT INTO wikis (name, subdomain, description, owner) VALUES (?, ?, ?, ?)',
            [name, subdomain, description, owner]
        );
        return { id: result.meta.last_row_id, name, subdomain };
    }

    async updateWiki(id, data) {
        const fields = [];
        const values = [];
        for (let [key, value] of Object.entries(data)) {
            if (value !== undefined) {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }
        values.push(id);
        return await this.execute(
            `UPDATE wikis SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            values
        );
    }

    async deleteWiki(id) {
        return await this.execute('DELETE FROM wikis WHERE id = ?', [id]);
    }

    // ======== СТАТЬИ ========
    async getArticles(wikiId) {
        return await this.query(
            'SELECT * FROM articles WHERE wiki_id = ? ORDER BY created_at DESC',
            [wikiId]
        );
    }

    async createArticle(title, content, wikiId, author = 'anonymous') {
        const result = await this.execute(
            'INSERT INTO articles (title, content, wiki_id, author) VALUES (?, ?, ?, ?)',
            [title, content, wikiId, author]
        );
        return { id: result.meta.last_row_id, title };
    }

    async deleteArticle(id) {
        return await this.execute('DELETE FROM articles WHERE id = ?', [id]);
    }

    // ======== ПРОЕКТЫ ========
    async getProjects() {
        return await this.query('SELECT * FROM projects ORDER BY created_at DESC');
    }

    async createProject(name, subdomain, description, owner = 'system') {
        const result = await this.execute(
            'INSERT INTO projects (name, subdomain, description, owner) VALUES (?, ?, ?, ?)',
            [name, subdomain, description, owner]
        );
        return { id: result.meta.last_row_id, name, subdomain };
    }

    async deleteProject(id) {
        return await this.execute('DELETE FROM projects WHERE id = ?', [id]);
    }

    async getProjectFiles(projectId) {
        return await this.query(
            'SELECT * FROM project_files WHERE project_id = ? ORDER BY uploaded_at DESC',
            [projectId]
        );
    }

    async addProjectFile(projectId, name, path, size) {
        const result = await this.execute(
            'INSERT INTO project_files (project_id, name, path, size) VALUES (?, ?, ?, ?)',
            [projectId, name, path, size]
        );
        return { id: result.meta.last_row_id, name };
    }

    async deleteProjectFile(id) {
        return await this.execute('DELETE FROM project_files WHERE id = ?', [id]);
    }

    // ======== ИГРЫ ========
    async getGames() {
        return await this.query('SELECT * FROM games ORDER BY created_at DESC');
    }

    async createGame(name, genre, description, url, image, uploadedBy = 'user') {
        const result = await this.execute(
            'INSERT INTO games (name, genre, description, url, image, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)',
            [name, genre, description, url, image, uploadedBy]
        );
        return { id: result.meta.last_row_id, name };
    }

    async deleteGame(id) {
        return await this.execute('DELETE FROM games WHERE id = ?', [id]);
    }

    async incrementGameDownloads(id) {
        return await this.execute(
            'UPDATE games SET downloads = downloads + 1 WHERE id = ?',
            [id]
        );
    }

    // ======== ЧАТ ========
    async getMessages(room, limit = 50) {
        return await this.query(
            'SELECT * FROM messages WHERE room = ? ORDER BY timestamp DESC LIMIT ?',
            [room, limit]
        );
    }

    async saveMessage(room, author, text) {
        const result = await this.execute(
            'INSERT INTO messages (room, author, text) VALUES (?, ?, ?)',
            [room, author, text]
        );
        return { id: result.meta.last_row_id, room, author, text };
    }
}
