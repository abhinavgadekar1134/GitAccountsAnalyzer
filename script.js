async function fetchGitHubData() {
    const username = document.getElementById('username').value;
    if (!username) {
        alert("Please enter a GitHub username");
        return;
    }

    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) {
        alert("No data found");
        document.getElementById("profile-card").classList.add("d-none");
        document.getElementById("question-section").classList.add("d-none");
        return;
    }

    const data = await response.json();
    if (!data || Object.keys(data).length === 0) {
        alert("No data found");
        document.getElementById("profile-card").classList.add("d-none");
        document.getElementById("question-section").classList.add("d-none");
        return;
    }

    document.getElementById("avatar").src = data.avatar_url;
    document.getElementById("name").innerText = data.name || "N/A";
    document.getElementById("bio").innerText = data.bio || "No bio available";
    document.getElementById("login").innerText = data.login;
    document.getElementById("repos").innerText = data.public_repos;
    document.getElementById("followers").innerText = data.followers;
    document.getElementById("following").innerText = data.following;
    document.getElementById("location").innerText = data.location || "Not specified";
    document.getElementById("profile-link").href = data.html_url;

    document.getElementById("profile-card").classList.remove("d-none");
    document.getElementById("question-section").classList.remove("d-none");
}

async function askQuestion() {
    const username = document.getElementById('username').value;
    const question = document.getElementById('question').value;
    if (!question) {
        alert("Please enter a question");
        return;
    }

    const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization:
                    "Bearer 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",
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: "system",
                        content:
                            "give answers for the question you asked for github profile. in 1 to 2 line answer. always give result in json format key as answer",
                    },
                    {
                        role: "user",
                        content: "give me"+question + " for profile on github" + username,
                    },
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 1,
                max_completion_tokens: 1024,
                top_p: 1,
                stream: false,
                response_format: {
                    type: "json_object",
                },
                stop: null,
            }),
        }
    );
    const body = await response.json();
    const res = JSON.parse(body.choices[0].message.content).answer;
    console.log(res);

    if (!response.ok) {
        document.getElementById("answer").innerText = "Error fetching answer";
        return;
    }

    document.getElementById("answer").innerText = res;
}
