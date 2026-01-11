export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'یوازې POST اجازه لري' });
    }

    const { fileName, content, folder } = req.body;
    const token = process.env.GITHUB_TOKEN; 

    // دلته فولډر په ډینامیک ډول ټاکل کېږي (books یا covers)
    const url = `https://api.github.com/repos/rahmatalmi145-dotcom/my-books-library/contents/${folder}/${fileName}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `نوی فایل اپلوډ شو: ${fileName}`,
                content: content
            })
        });

        const data = await response.json();

        if (response.ok) {
            res.status(200).json({ message: "فایل په بریالیتوب سره واستول شو", data });
        } else {
            res.status(response.status).json({ message: "GitHub تېروتنه وکړه", error: data });
        }
    } catch (error) {
        res.status(500).json({ message: "سرور کې ستونزه ده", error: error.message });
    }
}
