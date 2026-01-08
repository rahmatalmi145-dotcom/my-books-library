export default async function handler(req, res) {
    // یوازې د POST غوښتنې منو ترڅو امنیت خوندي وي
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    const { fileName, content, title, author, uploader } = req.body;
    
    // دا هغه ټوکن دی چې تا په Vercel Settings کې پټ کړی دی
    const token = process.env.GITHUB_TOKEN; 

    const url = `https://api.github.com/repos/rahmatalmi145-dotcom/my-books-library/contents/books/${fileName}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `نوی کتاب: ${title} د ${uploader} لخوا`,
                content: content
            })
        });

        const data = await response.json();

        if (response.ok) {
            res.status(200).json({ message: "کتاب په بریالیتوب سره GitHub ته واستول شو", data });
        } else {
            res.status(response.status).json({ message: "GitHub خطا ورکړه", error: data });
        }
    } catch (error) {
        res.status(500).json({ message: "سرور کې تخنیکي ستونزه ده", error: error.message });
    }
}
