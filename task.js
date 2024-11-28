 class Article {
    constructor(title, type, author, date) {
        this.title = title;
        this.type = type;
        this.author = author;
        this.date = new Date(date);
    }

    getFormattedDate() {
        return this.date.toLocaleDateString("uk-UA");
    }
}


function groupByType(articles) {
    return articles.reduce((groups, article) => {
        if (!groups[article.type]) groups[article.type] = [];
        groups[article.type].push(article);
        return groups;
    }, {});
}


async function fetchArticles() {
    const cloudUrl = "https://api.jsonbin.io/v3/b/6748d595ad19ca34f8d22f0a/latest"; 

    const response = await fetch(cloudUrl);

    if (!response.ok) {
        throw new Error(`Помилка отримання даних: ${response.status}`);
    }
    
    const result = await response.json();
    return result.record; 
}

async function displayArticles() {
    try {
        const data = await fetchArticles();

        const articles = data.map(
            (item) => new Article(item.title, item.type, item.author, item.date)
        );

        const groupedArticles = groupByType(articles);

        const content = document.getElementById("content");

        for (const [type, group] of Object.entries(groupedArticles)) {
            const groupDiv = document.createElement("div");
            groupDiv.className = "group";
            groupDiv.innerHTML = `<h2>${type}</h2>`;

            group.forEach((article) => {
                const articleDiv = document.createElement("div");
                articleDiv.className = "article";
                articleDiv.innerHTML = `
                    <h3>${article.title}</h3>
                    <p><strong>Автор:</strong> ${article.author}</p>
                    <p><strong>Дата публікації:</strong> ${article.getFormattedDate()}</p>
                `;
                groupDiv.appendChild(articleDiv);
            });

            content.appendChild(groupDiv);
        }
    } catch (error) {
        console.error("Помилка обробки:", error);
    }
}

displayArticles();
